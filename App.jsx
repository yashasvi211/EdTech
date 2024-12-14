import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "react-native-vector-icons";

// Import screens
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import StudentDashboard from "./screens/StudentDashboard";
import TeacherDashboard from "./screens/TeacherDashboard";
import Profile from "./screens/Profile";
import Notifications from "./screens/Notifications";
import Tasks from "./screens/Tasks";
import Assignments from "./screens/Assignments";
import ManageStudents from "./screens/ManageStudents"; // Import the ManageStudents screen
import ManageCourses from "./screens/ManageCourses"; // Import the ManageCourses screen
import ManageAssignments from "./screens/ManageAssignment";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define StudentTabs for the student dashboard
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#f4f4f9", // Custom background color for tabs
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={StudentDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Define TeacherTabs for the teacher dashboard
function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#f4f4f9", // Custom background color for tabs
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={TeacherDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        {/* SignIn Screen */}
        <Stack.Screen name="SignIn" component={Login} />

        {/* SignUp Screen */}
        <Stack.Screen name="SignUp" component={SignUp} />

        {/* StudentDashboard Screen with Tab navigation */}
        <Stack.Screen
          name="StudentDashboard"
          component={StudentTabs} // Use Tab navigation for student dashboard
          options={{
            headerShown: false, // Hide header completely for StudentDashboard
          }}
        />

        {/* TeacherDashboard Screen with Tab navigation */}
        <Stack.Screen
          name="TeacherDashboard"
          component={TeacherTabs} // Use Tab navigation for teacher dashboard
          options={{
            headerShown: false, // Show the header for TeacherDashboard
            headerBackVisible: false, // Remove back button from the header
          }}
        />

        {/* Manage Students Screen */}
        <Stack.Screen
          name="ManageStudents"
          component={ManageStudents} // Manage Students screen for teachers
        />

        {/* Manage Courses Screen */}
        <Stack.Screen
          name="ManageCourses"
          component={ManageCourses} // Manage Courses screen for teachers
          options={{
            title: "Manage Courses", // Set the header title for this screen
          }}
        />
        <Tab.Screen
          name="ManageAssignments"
          component={ManageAssignments}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" color={color} size={size} />
            ),
            title: "Assignments", // Tab title
          }}
        />
        {/* Assignments Screen */}
        <Stack.Screen name="Assignments" component={Assignments} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
