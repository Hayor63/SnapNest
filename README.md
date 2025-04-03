# The Site

SnapNest is a Pinterest-inspired platform that allows users to discover, save, and organize images into collections. Built with a scalable backend, SnapNest ensures seamless image uploads, user authentication, and interaction with posts through likes, comments, and shares.

## Features

* **User Authentication** – Secure sign-up, login, and session management.
* **Image Uploads & Management** – Upload, store, and organize images into collections.
* **Collections & Boards** – Create and manage categorized boards for organizing images.
* **Search & Discover** – Find inspiring content through search and recommendations.
* **Likes & Comments** – Engage with posts through likes and comments.
* **User Profiles** – Customize and manage personal profiles.
* **Follow System** – Follow other users and see their latest posts.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Cloud Storage**: Cloudinary (for image uploads) 
- **API Documentation**: Swagger

# Setup & Installation

Follow these steps to set up and run the **SnapNest Backend** locally.

#### 1️⃣ Clone the Repository  
Open your terminal and run the following commands:  

```bash
git clone https://github.com/yourusername/snapnest-backend.git
cd snapnest-backend
```
#### 2️⃣ Install Dependencies
Run the following command to install all required packages:

```
npm install
```
#### 3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add the required variables:

```
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster_url>/Snapnest?retryWrites=true&w=majority  
ACCESSTOKEN=<your_access_token>  
REFRESHTOKEN=<your_refresh_token>  
PORT=9000  
TEST=mongodb+srv://<username>:<password>@<cluster_url>/Snapnest_test?retryWrites=true&w=majority  
BREVO_MAIL_KEY=<your_brevo_mail_key>  
HOST=smtp-relay.brevo.com  
BREVO_PORT=587  
USER_MAIL_LOGIN=<your_mail_login>  
BASE_URL="https://snapnest.com"  
EMAIL_VERIFICATION_PRIVATE_KEY=<your_email_verification_key>  
RESET_PASSWORD_PRIVATE_KEY=<your_reset_password_key>  
JWT_SECRET=<your_jwt_secret>  
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>  
CLOUDINARY_API_KEY=<your_cloudinary_api_key>  
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>  
```
#### 4️⃣ Start the Server
Run the following command to start the server:

```
npm start
```

## 📌 API Endpoints

Method   | Endpoint                                     | Description                                             
-------- | -------------------------------------------- | --------------------------------------------------------- 
POST     | /api/v1/users/create                         | Creates a new user                                       
PATCH    | /api/v1/users/verify-account/{userId}/{token} | Verifies a user's account with the user ID and token      
POST     | /api/v1/auth/login                           | User login using username and password                    
GET      | /api/v1/auth/profile                         | Authenticate user using bearer token                      
GET      | /api/v1/auth/profile/{userName}              | Get user profile by username                              
PATCH    | /api/v1/auth/update-user/{id}                | Update user profile by ID                                
POST     | /api/v1/auth/recover-password                | Initiate password recovery                                
PATCH    | /api/v1/auth/reset-password/{id}/{token}     | Reset user password with ID and token                     
PUT      | /api/v1/auth/follow/{userId}                 | Follow a user by user ID                                  
PUT      | /api/v1/auth/unfollow/{userId}               | Unfollow a user by user ID                                
GET      | /api/v1/auth/following/{id}                  | Get a list of users that the specified user is following  
GET      | /api/v1/auth/followers/{id}                  | Get a list of users following the specified user          
POST     | /api/v1/pins/create                          | Create a new pin (Authentication required)                
GET      | /api/v1/pins/                                | Fetch a paginated list of pins (Authentication required)  
GET      | /api/v1/pins/followed                        | Get pins from followed users (Authentication required)    
GET      | /api/v1/pins/random-explore                  | Get random pins for exploration                          
GET      | /api/v1/pins/{id}/userpins                   | Get pins created by a specific user (Authentication required)
PUT      | /api/v1/pins/like/{id}                       | Like a pin (Authentication required)                     
PUT      | /api/v1/pins/dislike/{id}                    | Dislike a pin (Authentication required)                  
GET      | /api/v1/pins/{id}/likedpins                  | Get pins liked by a user (Authentication required)       
PATCH    | /api/v1/pins/{id}/update                     | Update a pin (Authentication required)                   
DELETE   | /api/v1/pins/{id}                            | Delete a pin (Authentication required)                   
GET      | /api/v1/pins/{id}/related                    | Get related pins based on shared tags (Authentication required)
GET      | /api/v1/pins/singlepin/{id}                  | Get a single pin by ID (Authentication required)         
POST     | /api/v1/comments/{id}/add                    | Add a comment to a pin                                   
PUT      | /api/v1/comments/comments/like/{id}          | Like a comment                                           
PUT      | /api/v1/comments/comments/dislike/{id}       | Dislike a comment                                         
DELETE   | /api/v1/comments/delete/{id}                 | Delete a comment                                          
GET      | /api/v1/comments/{id}                        | Get a comment                                             
PATCH    | /api/v1/comments/{id}                        | Update a comment                                          
GET      | /search                                      | Search the database                                      
GET      | /search/tags                                 | Get all available tags                                   
DELETE   | /search/{id}/tags/{index}                    | Delete a specific tag by index for a given ID             

## Notes:

- Authentication required for all endpoints that interact with user data, pins, or comments (specified in the API documentation).
- Ensure that environment variables are configured correctly to avoid issues related to database connections, authentication, and Cloudinary integration.


