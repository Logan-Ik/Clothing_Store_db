Clothing Store – Full Stack Web Application

A full-stack clothing store web application built using Node.js, Express, and MySQL, featuring authentication, product listings, and a shopping cart system.


Features

Product listing page
Shopping cart functionality
User authentication (Login / Signup)
Logout system
MySQL database integration
Clean frontend UI (HTML, CSS, JavaScript)

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

Database Setup
Prerequisites

Make sure you have:

Node.js installed
MySQL installed and running
Access to MySQL via terminal or MySQL Workbench

Create the Database
In Terminal (PowerShell / Command Prompt)

```bash
mysql -u root -p
```

Enter your MySQL password.

Then run:

```sql
CREATE DATABASE clothing_store;
USE clothing_store;
```

---

Create Tables

Run the following SQL inside MySQL:

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255)
);

-- Cart table
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

Insert Sample Products

```sql
INSERT INTO products (name, description, price, image) VALUES
```

Configure Database Connection

In your backend file (e.g., `db.js`), ensure your connection matches:

```js
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD",
  database: "clothing_store"
});

export default db;
```

Start the Server

From your project root:

```bash
node server.js
```

Or if using nodemon:

```bash
npx nodemon server.js
```

Then open:

```
http://localhost:3000
```

Note: GitHub Pages cannot run this project because it requires a backend server and database.

Future Improvements

Payment gateway integration
Admin dashboard
Order history
JWT authentication
Product filtering and search
Responsive mobile improvements

Author

Built as a full-stack practice project to strengthen backend, database, and deployment skills.
