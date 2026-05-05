# Backend_project2
It contain all backend task code
# Authentication API

This is a backend authication service built as part of my backend coding task. It handle user registration , login , and secure token generated using cookie with refresh token.

## FEATURES
- **USER REGISTRATION**: collate user credential and hash password before storing into the database.
- **LOGIN**: Validate user input and return aJWT token for easy access with addiction of refresh token to extend user session.

## Tech Stack
- **NODEJS** (SERVER)
- **Nodemon**(for server auto reload)
- **BCRYPT** (for password hashing)
- **JWT** (for token generation)
- **Cookie Paser** (for token storage)
- **PostgresSQL** (for database)

## API EndPoint

| Method | EndPoint | Description |
|:--- | :--- | :--- |
| POST | `/register` | Register new user |
| POST | `/login` | login and generate a new token |
| POST | `/refresh` | refresh and generate new token |

## API TESTING (THURDER CLIENT )

## Register Endpoint
![Register successful](./images/Capture1.PNG)

## Login Endpoint
![Login  successful](./images/Capture2.PNG)

## Refresh Endpoint
![Register successful](./images/Capture3.PNG)