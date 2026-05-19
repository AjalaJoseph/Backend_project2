# Backend_project2
It contain all backend task code
# Authentication API

This is a backend authication service built as part of my backend coding task. It handle user registration, login, and secure token generated using cookie with refresh token.

This api supports:

- User registration
- User login
- Password Hashing
- jwt authentication
- welcome email running backround
- Role base athourization
- secure logout
- Rate limiting 
- Background jobs and queues

# FEATURES

## Authentication 

- Register Account
- Login account
- jwt access token generation
- Refresh token generation
- Refresh token stored in cookie
- Refresh token stored in redis
- Logout system

## Security Features

 - password Hashing using bcryt salt 10
 - jwt authenticatoin
 - Refresh token store inside cookies parser
 - sensitive environment variable using `.env`
 - Rate limiting using express-rate-limit
 - Secure environment variable
 - Cookie-base authentication

## Email System
  - gmail as a transporter services
  - welcome email after registration
  - html email format

##  Queue system 

  - BullMq express js queue
  - Redis Worker
  - Background job


## Tech Stack

| Technology | Purpose |
| --- |---|
| Node.js | Runtime |
| Express.js | Backend Fremework |
| PostgresSQl | Database |
| BullMq | Background jobs and Queue |
| Nodemailer | Email sending |
| Redis | session storage and queue |
| express-rate-limit | API rate limiting |
| cookies-parser | cookie handlinh to store refresh token |
| dotenv | Environment variable library |
| bcrypt | Password hashing |
| jwt | Token generation (Authentication) |

# Environment Variable

Create a `.env` file in the root folder. 

Example:

```env
JWT_SCRETE =69670d3aec1e1a754a8ab456f32aa13acd23fb218b251b644bb9b0bd1f9a66e1 ;
REFRESH_TOKEN_SECRET=18868133baf16bf5316e6853fc8340b946276e8113b4f761367681f475597c7589915f548b2b7dccb91cd9ecc37d05d0588b473c1b1d1939ad602061cd7d3022
PORT=3000
postgres_password= "Amgreat27!"
postgresPort = 5432
email_port=587
email_user= 'ajalaoluwafikayomi27@gmail.com'
email_password='nqlf uxet agyv nbsq'
postgres_userName = "postgres"
redis_port = 6379
redis_host= '127.0.0.1'
```

# API Base URL 

``` http://localhost:3000/api/auth```

## API EndPoint

## 1. Register User
## Endpoint 

```http://localhost:3000/api/auth/register```

## Method 
 POST
### purpose
Create a new user account.
### Request Body
 ```json
 {
  "user_name": "Joseph",
  "email":"example@gmail.com",
  "password":"123456789"
 }
```
###  Request Fields

| Field | Type | Required |
|---|---:|---:|
|user_name | string | yes |
| email | string | yes |
| password | string | yes |

### How  It Works
 ```text
 1. Validate request body (email must include @ and .com, password must long must than 7 character)
 2. check if email already exists
 3. Hash password using bcrypt
 4. Save user to PostgresSql
 5. Return succes respond and start process queue jobs
 6. Add welcome email job to BullMq queue
 7. Worker process email job
 8. Nodemailer sends welcome email
 ```
 ### success Response
 ``` json
 {
  "message": "User created"
}
```
![Register successful](./authentication/images/Capture1.PNG)

### possible Errors

```json
{
  "error": "Email already exists"
}
```
![Register error](./authentication/images/registration%20errror.png)

## 2. Login User
## Endpoint 

```http://localhost:3000/api/auth/login```

## Method 
 POST
### purpose
Authenticate a user and generates access and refresh token.
### Request Body
 ```json
 {
  "email":"example@gmail.com",
  "password":"123456789"
 }
```
###  Request Fields

| Field | Type | Required |
|---|---:|---:|
| email | string | Yes |
| password | string | Yes |

### How  It Works
 ```text
 1. Validate email and password  
 2. check if user exist in database postgresSQL 
 3. Compare password with the one save before using bcrypt.compare
 4. Generate access token and refresh token
 5. Save refresh token inside redis and cookies-parser
 6. Return access token and successful message

 ```
 ### success Response
 ``` json
{
  "message": "login successfull",
  "data": {
    "user": {
      "id": 51,
      "user_name": "Ajala joseph",
      "email": "ajalaoluwafikayomi2@gmail.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUxLCJlbWFpbCI6ImFqYWxhb2x1d2FmaWtheW9taTJAZ21haWwuY29tIiwiaWF0IjoxNzc5MjAxNDcxLCJleHAiOjE3NzkyMDE3NzF9._shiOHg-HK0oSjRvpRU23VbvokCmXpKnXbzpthvwwPM"
  }
}
```
![Login  successful](./authentication//images/new%20login.png)

### possible Errors

```json

 {
  "error": "Invalid credential"
}
when user not found 
```
![Login error](./authentication/images/loginerror.png)


## 3. Refresh Access token
## Endpoint 

```http://localhost:3000/api/auth/refresh```

## Method 
 POST
### purpose
Generate a new access token after the previous token expires.
### Request Body
No request body required

### How  It Works
 ```text
 1. Read refresh token from cookies
 2. Verify refresh token  
 3. if match generate new access token
 4. Return new access token 

 ```

 ## 4. Logout User
## Endpoint 

```http://localhost:3000/api/auth/logout```

## Method 
 POST
### purpose
Logs out user by removing refresh token from Redis and clearing cookies.
### Request Body
 No request body


### How  It Works
 ```text
 1. Read refresh token from cookies  
 2. Remove refresh token from Redis  
 3. Clear refresh token cookie
 4. Return success response

 ```
 ### success Response
 ```json
 {
  "message": "Logged out successfully"
}
```
# Rate Limiting
The API use:
```txt
express-rate-limit
```
to prevent abuse and brute force or too many revoking of api

Example:
```text
Too many login attemts
```
the server temporiry blocks execessive requests.

Setup
```text
WindowMS:15,
limit:5
```
![Rate limit](./authentication/images/ratelimit.png)
## API TESTING (THURDER CLIENT )

## MiddleWare
express middleware
-- app.use(express.json())
-- app.use(cookieParser())
