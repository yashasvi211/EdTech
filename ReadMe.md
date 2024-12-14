# EdTech Platform Prototype

## Project Overview

This EdTech platform allows users to sign up, log in, and access dashboards for both students and teachers.

### Student Dashboard:

- View enrolled courses
- View assignments and syllabus
- Submit assignments
- View tasks and notifications

### Teacher Dashboard:

- View assignment submission statistics (in chart format)
- View student list and manage courses
- Add courses and assignments

## Technologies Used

- JavaScript (ES6)
- React Native
- Node.js
- Express
- MySQL
- AI/ML (for features like notifications)
- Render (for deployment)

[![My Skills](https://skillicons.dev/icons?i=js,reactnative,nodejs,express,mysql,aivel,render)](https://skillicons.dev)

## Installation

1. Clone the project repository.
2. Run `npm install` to install the necessary dependencies.
3. The server is hosted online, so you don't need to set up a local server. You can access the server at [https://edtech-server-3dnc.onrender.com](https://edtech-server-3dnc.onrender.com).

   If you want to use your own server, replace the URL `https://edtech-server-3dnc.onrender.com` with your server's URL in the following files:

   - `assignment.jsx`
   - `login.jsx`
   - `ManageCourse.jsx`
   - `ManageStudent.jsx`
   - `signup.jsx`
   - `studentdashboard.jsx`
   - `teacherdashboard.jsx`

   **Note**: The following files use mock data and do not require server integration:

   - `profile.jsx`
   - `task.jsx`

## Database Schema

### Users Table

```sql
mysql> describe Users;
+------------+---------------------------+------+-----+-------------------+-------------------+
| Field      | Type                      | Null | Key | Default           | Extra             |
+------------+---------------------------+------+-----+-------------------+-------------------+
| id         | int                       | NO   | PRI | NULL              | auto_increment    |
| name       | varchar(100)              | NO   |     | NULL              |                   |
| email      | varchar(100)              | NO   | UNI | NULL              |                   |
| password   | varchar(255)              | NO   |     | NULL              |                   |
| role       | enum('teacher','student') | NO   |     | NULL              |                   |
| created_at | timestamp                 | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+---------------------------+------+-----+-------------------+-------------------+
```
