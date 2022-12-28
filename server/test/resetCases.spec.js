const supertest = require('supertest')


describe('DELETE /cases/', function() {
    it("it should clean the cases data", function(done) {
      supertest('http://localhost:3000')
        .delete('/cases')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if(res.body = true){            
            return done()
          } else {
            return done(Error('Error: Couldn\'t delete the cases'));
          }
      });
    });
  });
  
  describe("POST /cases/import", function() {
    it("it should be possible to import cases after the delete action", function(done) {
      supertest('http://localhost:3000')
        .post("/cases/import")
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if(res.body.nUpserted > 0 && res.body.upserted.length > 0){
            return done();
          } else {
            return done(Error('Error: Failed to reload cases'));
          }
      });
    });
  });