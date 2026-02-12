Clothing Store – Full Stack Web Application

A full-stack clothing store web application built using **Node.js, Express, and MySQL**, featuring authentication, product listings, and a shopping cart system.


Features

Product listing page
Shopping cart functionality
User authentication (Login / Signup)
Logout system
MySQL database integration
Clean frontend UI (HTML, CSS, JavaScript)
Express backend API

Tech Stack

Frontend

HTML
CSS
Vanilla JavaScript

Backend

Node.js
Express.js

Database

MySQL



Project Structure
This has been changed to fit into GitHub and remove sensitive info 


clothing-store/
│
├── node_modules/
├── public/              # Frontend files
│   ├── index.html
│   ├── cart.html
│   ├── login.html
│   ├── signup.html
│   ├── styles.css
│   ├── app.js
│   ├── cart.js
│   ├── login.js
│   ├── signup.js
│   ├── logout.js
│   └── images
│
├── db.js                # Database connection
├── server.js            # Express server
├── package.json
├── package-lock.json
├── .env                 # Environment variables (not committed)
└── README.md


Installation & Setup (Local Development)

Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/clothing-store.git
cd clothing-store
```


 Install Dependencies

```bash
npm install
```



Configure Environment Variables

Create a `.env` file in the root directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=clothing_store
PORT=3000
```


Start MySQL

Make sure your MySQL server is running.

Create your database and required tables before starting the app.


Run the Server

```bash
node server.js
```

or (if using nodemon):

```bash
nodemon server.js
```

 Open in Browser

```
http://localhost:3000
```

Note: GitHub Pages cannot run this project because it requires a backend server and database.


Future Improvements

Payment gateway integration
Admin dashboard
Order history
JWT authentication
Cloud database hosting
Product filtering and search
Responsive mobile improvements


Author

Built as a full-stack practice project to strengthen backend, database, and deployment skills.
