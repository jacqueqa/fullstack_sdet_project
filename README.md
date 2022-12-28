## How to Run With Docker
### To Start 
```bash
`./start-app.sh`
```
### To Stop
```bash
`docker-compose down`
```
## API 
We have two endpoints to import the data to our collections. Check the list with all the endpoints below.
``
### API endpoints:
`http://localhost:3000/api-docs`
- /cases
    - GET /unreviewed/userId
    - POST /import
    - PUT /review
    - DELETE /

- /conditions
    - GET /
    - POST /
    - POST /import
    
- /users
    - POST /login
    - POST /register

### MONGO DB
`MONGODB_CONNECTION=mongodb://127.0.0.1:27018/test`
