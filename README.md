TaupeDefenseApi
## Launching project
1- npm install
2- launch mongo server
3- npm start 


##Create user 
you need make POST action:
1- Header with "Content-Type"
2- {
    "user": {
        "email": "test@test.test",
        "password": "test"
        }
} in body
3- then send POST on localhost:8000/api/users