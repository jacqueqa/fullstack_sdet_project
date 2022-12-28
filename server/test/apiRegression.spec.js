const supertest = require('supertest')

let drName = "Dra Jacqueline";
let drEmail = "drajackie@superdoctor.com";
let drPassword = "Lalala#123";
let wrongDrPassword = "Senh4#Errad4"; 

//Register 
describe("POST /users/register", function() {
  it("it should be possible to register a user", function(done) {
    supertest('http://localhost:3000')
      .post("/users/register")
      .send({name: drName, email: drEmail, password: drPassword})
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});

//Register same email
describe("POST /users/register", function() {
  it("it shouldn't be possible to register with the same email", function(done) {
    supertest('http://localhost:3000')
      .post("/users/register")
      .send({name: drName, email: drEmail, password: drPassword})
      .set('Content-Type', 'application/json')
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});

//Login 
let user_id;
describe("POST /users/login", function() {
  it("it should be possible to login with a registered user", function(done) {
    supertest('http://localhost:3000')
      .post("/users/login")
      .send({email: drEmail, password: drPassword})
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        if(res.body.email === drEmail && res.body.name === drName){
          user_id = res.body.id
          return done();
        } else {
          return done(Error('Error: email or name dont match login'));
        }
    });
  });
});


//Login with wrong password
describe("POST /users/login", function() {
  it("it should be impossible to login with the wrong password", function(done) {
    supertest('http://localhost:3000')
      .post("/users/login")
      .send({email: drEmail, password: wrongDrPassword})
      .set('Content-Type', 'application/json')
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
    });      
  });
});

//Get unreviewed cases
describe("POST /cases/import", function() {
  it("it should be possible to import new cases", function(done) {
    supertest('http://localhost:3000')
      .post("/cases/import")
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        if(res.body.nUpserted > 0 && res.body.upserted.length > 0){
          return done();
        } else {
          return done(Error('Error: There were no cases to import'));
        }
    });
  });
});

let unreviewedCases = []
  describe(`GET /cases/unreviewed/${user_id}`, function() {
    it("it should have unreviewed cases to review", function(done) {
      supertest('http://localhost:3000')
        .get(`/cases/unreviewed/${user_id}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if(res.body.length > 0){
              res.body.forEach(function (element) {
                unreviewedCases.push(element.id)
            })
            
            return done()
          } else {
            return done(Error('Error: There were no unreviewed cases'));
          }
      });
    });
  });

//Import Conditions
let listNumberofItens
describe("POST /conditions/import", function() {
  it("it should be possible to import a list of conditions", function(done) {
    supertest('http://localhost:3000')
      .post("/conditions/import")
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        listNumberofItens = res.body.nUpserted
        if(listNumberofItens > 0 && res.body.upserted.length > 0){
          return done();
        } else {
          return done(Error('Error: There were no conditions to import'));
        }
    });
  });
});

let conditionsList = []
describe("GET /conditions/", function() {
  it(" it should be able to get the conditions and match the number of imported conditions", function(done) {
    supertest('http://localhost:3000')
      .get("/conditions")
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        if (res.body.length > 0){
            res.body.forEach(function (element) {
              conditionsList.push(element._id)
          })
          if (conditionsList.length === listNumberofItens){
          return done();
          }
            else {
              return done(Error('Error: The list is incomplete, try to import again'));
            }
        } else {
          return done(Error('Error: There were no conditions to import'));
        }
   });
  });
});

let reviewDate
let drReviewer
//Add the condition on the case
describe("PUT /cases/review", function() {
  it("it should be possible to add a condition to the cases", function(done) {
    unreviewedCases.forEach(function (caseForReview, i) {
      supertest('http://localhost:3000')
        .put("/cases/review")
        .send({id: caseForReview, review: {userId: user_id, conditionId: conditionsList[Math.floor(Math.random() * listNumberofItens)]}})
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if(res.body.reviews[0] != null){
            drReviewer = res.body.reviews[0].userId
            reviewDate = res.body.reviews[0].date
            console.log("The following caseId: " + caseForReview + " was reviewed on " + reviewDate + " by the user with ID " + drReviewer)
          } else {
            return done(Error('Error: The condition couldn\'t be added '));
          }

          if(i === unreviewedCases.length - 1) {
            return done();
          }
      });
    });  
  });
});

//You are done. :: API Version 
describe(`GET /cases/unreviewed/${user_id}`, function() {
  it("it shouldn\'t have unreviewed cases", function(done) {
    supertest('http://localhost:3000')
      .get(`/cases/unreviewed/${user_id}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        if(res.body.length === 0){
          return done()
        } else {
          return done(Error('Error: There\'s still cases to review'));
        }
    });
  });
});



// This code was done while listening :: https://open.spotify.com/playlist/1vhJs1460Af0vFT8VtmAQU :D