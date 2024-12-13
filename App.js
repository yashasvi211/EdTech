import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";

// Import your screens
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import StudentDashboard from "./screens/StudentDashboard";
import TeacherDashboard from "./screens/TeacherDashboard";
import Profile from "./screens/Profile"; // Import the Profile screen
import Notifications from "./screens/Notifications"; // Import the Notifications screen
import Tasks from "./screens/Tasks"; // Import the Tasks screen

// Import icons
import { Ionicons } from "react-native-vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="StudentDashboard"
          component={StudentTabs} // Use Tab navigation for student dashboard
          options={{
            headerShown: false, // Hide header completely
          }}
        />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
