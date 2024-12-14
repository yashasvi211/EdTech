# EdTech Platform Prototype

## Project Overview

The EdTech platform is a react-native application designed to enhance the interaction between students and teachers, providing an efficient, user-friendly interface for managing courses, assignments, and submissions.

### **Features Summary**:

#### **Student Dashboard**:

- **Courses**: Students can view their enrolled courses.
- **Assignments & Syllabus**: Students can view assignments and their respective syllabi.
- **Task Submission**: They can submit their assignments through the platform.
- **Notifications**: Students can view important updates and tasks.

#### **Teacher Dashboard**:

- **Submission Statistics**: Teachers can track assignment submissions through charts.
- **Course & Student Management**: Teachers can manage courses, assign tasks, and view the list of students.
- **Course & Assignment Creation**: Teachers can create new courses and assignments.

## Technologies Used

 - **Frontend**: JavaScript (ES6), React Native
- **Backend**: Node.js, Express
- **Database**: MySQL (hosted on Aivel)
- **Deployment**: Render
[![My Skills](https://skillicons.dev/icons?i=js,react,nodejs,express,mysql)](https://skillicons.dev)

## Installation Guide

### **Installation Steps**

1. **Clone the Repository**:  
   Clone the project repository to your local system using the command:
   ```bash
   git clone https://github.com/yashasvi211/EdTech.git
   ```

2. **Install Dependencies**:  
   Navigate to the project directory and run:
   ```bash
   npm install
   ```

3. **Start the Project**:  
   Launch the project using Expo by running:
   ```bash
   npx expo start
   ```

4. **Download Expo Go**:  
   Install the **Expo Go** app on your mobile device. Scan the QR code displayed in the terminal to open the application on your device.

5. **Login Credentials**:  
   - **Student Dashboard**:  
     Email: `student`  
     Password: `student`  
   - **Teacher Dashboard**:  
     Email: `teacher`  
     Password: `teacher`

6. **Server Access**:  
   The server is already hosted online at:  
   [https://edtech-server-3dnc.onrender.com](https://edtech-server-3dnc.onrender.com)  

   For those who want to explore or modify the backend:
   - The server code and MySQL setup are available in the `backend` directory.
   - Add your MySQL credentials in the appropriate configuration files to set up a local server.
# EdTech Platform Installation Guide

## **Installation Steps**

1. **Clone the Repository**:  
   Clone the project repository to your local system using the command:
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**:  
   Navigate to the project directory and run:
   ```bash
   npm install
   ```

3. **Start the Project**:  
   Launch the project using Expo by running:
   ```bash
   npx expo start
   ```

4. **Download Expo Go**:  
   Install the **Expo Go** app on your mobile device. Scan the QR code displayed in the terminal to open the application on your device.

5. **Login Credentials**:  
   - **Student Dashboard**:  
     Email: `student`  
     Password: `student`  
   - **Teacher Dashboard**:  
     Email: `teacher`  
     Password: `teacher`

6. **Server Access**:  
   The server is already hosted online at:  
   [https://edtech-server-3dnc.onrender.com](https://edtech-server-3dnc.onrender.com)  

   For those who want to explore or modify the backend:
   - The server code and MySQL setup are available in the `backend` directory.
   - Add your MySQL credentials in the appropriate configuration files to set up a local server.

## **Files Requiring Server Integration**

- `assignment.jsx`
- `login.jsx`
- `ManageCourse.jsx`
- `ManageStudent.jsx`
- `signup.jsx`
- `studentdashboard.jsx`
- `teacherdashboard.jsx`

## **Mock Data**

- `profile.jsx`
- `task.jsx`
## **Database Schema**:

The project includes an **ER Diagram** (Entity-Relationship Diagram) outlining the core entities and their relationships, such as:

- **Users** (students/teachers)
- **Assignments**
- **Submissions**
- **Courses**
[ER Diagram.pdf](https://github.com/user-attachments/files/18136480/ER.Diagram.pdf)

## Application Screenshot:
### 1. **Sign-In Screen**
![Screenshot_20241214-205214](https://github.com/user-attachments/assets/da5d7140-7fff-445f-a06e-925e2456e59c)

### 2. **Sign-Up Screen**
![Screenshot_20241214-205217](https://github.com/user-attachments/assets/52178458-a4c1-4ecc-a444-aecd8cc0fa2d)

 

 

