- Create a repo
- Initialize the repository
- know abt node_modules, package.json and package-lock.json
- Install Express
- Create a server, listen to PORT number 7777
- Write req handlers for /test, /hello
- Install nodemon and update script in package.json
- diff in ^ and ~

<!-- Route and Request Handling -->

- go to express and read abt routing
- explore routing and use of ?, "\*", +, () in the routes
- use of regex in routes /a/, /.\*fly$/
- reading the query, params in the routes and dynamic routes

<!-- middle ware -->

- Multiple route handlers and play with it
- next() function, along with erros along with res.send()
- put next() and res.send() before later , use multiple route handler function (within Array or outside the array)
- app.use("/route",rH,[rH2,rh3],rH4)
- what is middleware and why do we need it?
- how express basically handles request behind the scene?
- diff btn app.use and app.all
- write a dummy auth middleware for all "admin" and "user" routes, except /user/login
- Error Handling using app.use("/) and

<!-- Database, schema and model mongoose -->

- connect with cluster
- install mongoose lib through npm
- connect ur application to the database - <connectionUrl> + /dataBaseName
- call connectDB function and connect to database before strting application on 7777
- create a userSchema and user Model in models/user.js folder/file
- create POST /signup API to add data to database
- push some documents using API calls from postman
- Error handling using Try catch

<!-- diving into API's -->

- diff btn JS object and JSON
- add the express.json() middleware to ur app
- make ur signup api to receive data from the end user
- find out if we use ModelName.findOne() it will return which object/document if we have duplicate data (is it returning older one or newer one)
- Build API - Get user by email (use try catch and handle edge cases)
- Build API - Feed API - GET /feed- get all users from the database (findOne, find, findById) (use try catch and handle edge cases)
- create a delete user API
- diff btn patch and put
- API to update a user
- Explore the mongoose documention for model methods
- what are options in a Model.findOneAndUpdate method, explore more about it
- API - update the user with email ID (returnDocument:"after")

  === commmit-> about all of this

  <!-- data Sanitization and schema validations -->
  - Explore schematypes options from the documentation
  - add require, unique, lowerCase, min, minLength, trim
  - Add "default"
  - Create a custom validate function for gender, (also enable the validation using runValidators)
  - Improve the DB schema - put all appropiate validations on each fields in schema
  - Add timestamps to the user schema
  - Add API level validation on Patch request and signup post api
  - Data sanitizing - Add API validaiton for each field(in schema)
  - Install Validator lib
  - Explore validator lib,functions and Use validator function for password, email, photoURL

  <!-- Encrypting Password -->
  - Create utils folder(helper function), validate data(req.body) in signup API
  - install bcrypt package
  - create a password hash using bcrypt.hash and save the user with hash passwrd
  - create login API
  - validate the email and compare passwords and throw errors if email or password is invalid

  <!-- Auth, JWT and Cookies -->
  - install cookie-parser
  - send a dummy cookie to user(res.cookies)
  - create GET /profile API and chekc if you get the cookie back(req.cookies.token)
  - install jsonwebtoken
  - In login API, after email and password validation, create a JWT token and send it to user in cookies(jwt.sign and passkey)
  - read the cookies inside your profile API and find the logged in User
  - Handle case when token is invalid and user is not in DB
  - create UserAuth Middleware
  - Add the userAuth middleware in profile API and send a new sendConnectionRequest API
  - Set the Expiry of JWT token and cookies to 7 days
  - create userSchema method to getJWT() and comparePassword(passwordInputByUser,passwordHash) - of bcrypt

  <!-- Diving into APIs and express -->
  - Explore the tinder APIs
  - Create a list of all APIs you can think of in Dev Tinder
  - Group multiple routes under respective routers
  - Read documentation for express.Router()
  - Create routes folder for managing auth, profile,request routers
  - Create authRouter, profileRouter, requestRouter
  - Import these routers in app.js
  - Create POST /logout API
  - Create PATCH /profile/edit
  - Create PATCH /profile/password API ==> forgot password API
  - Make you validate all data in every POST, PATCH APIs

<!-- Logical DB Query and Compound Indexes -->

- Create connectionRequest schema
- Send connectionRequest API(post)
- Proper Validation of Data
- Think about all corner cases
- Read about $or and $and query(and also all other queries) in mongoose
- $or query $and query in mongoose - https://www.mongodb.com/docs/manual/reference/operator/query-logical/
- schema.pre("save") function
- Read more about indexes in MongoDB
- Why do we need index in DB?
- What is the advantages and disadvantage of creating?
- Read this arcticle about compond indexes - https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/

<!-- Ref, Populate and thoughts process of writig API -->

- write code with proper validation for POST - POST /request/review/:status/:requestId
- ALWAYS THINK ABOUT CORNER CASES
- Thought process -> POST and GET
- Read about Ref and Populate - https://mongoosejs.com/docs/populate.html
- Create GET API for /user/request/received with all the checks

<!-- BUILDING FEED API and PAGINATION -->

- Logic for GET /feed api
- Explore the $nin, $ne, $and and Other queries operators from mongoDB site

<!-- DOUBT -->

what if 2 people are send request to each other at same time how will this gonna handle ?
we cannt ignore the request if someone has not send yet the request

<!-- Credentials -->

{
"emailId": "Naruto@gmail.com",
"password": "Naruto@123"
}

{
"emailId": "katiyarashish24@gmail.com",
"password": "Ashish@123"
}

<!-- TODO -->

1.if user is already logged out thn from postman u cant logged out again
2.if user is already logged in thn from postman u cant logged in again(first logged out current user thn logged in)
