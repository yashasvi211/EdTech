import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import axios from "axios"; // Import axios

export default function StudentDashboard({ route, navigation }) {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]); // State to hold courses data

  useEffect(() => {
    // Load session data
    const loadSession = async () => {
      try {
        const sessionData = await AsyncStorage.getItem("userSession");
        console.log("Retrieved session data:", sessionData); // Debug log
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          setUser(parsedData); // Set user data if found
          await AsyncStorage.setItem(
            "studentId",
            JSON.stringify(parsedData.id)
          ); // Save studentId
        } else {
          navigation.navigate("SignIn"); // Navigate to SignIn if no session
        }
      } catch (error) {
        console.error("Error loading session:", error); // Log error
        Alert.alert("Error", "Failed to load session data.");
      }
    };

    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://192.168.29.144:3000/courses"); // Replace with your API URL
        setCourses(response.data); // Update courses state
      } catch (error) {
        console.error("Error fetching courses:", error); // Log error
        Alert.alert("Error", "Failed to load courses.");
      }
    };

    // Back handler for Android hardware back press
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    loadSession(); // Load session on component mount
    fetchCourses(); // Fetch courses on component mount

    return () => backHandler.remove(); // Cleanup back handler on unmount
  }, [navigation]);

  // Handle logout and clear session
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userSession"); // Remove session data
      navigation.replace("SignIn"); // Replace stack to prevent back navigation
    } catch (error) {
      console.error("Error during logout:", error); // Log error
      Alert.alert("Error", "Failed to log out.");
    }
  };

  // Handle syllabus link opening
  const viewSyllabus = (syllabus) => {
    // Open the syllabus link (PDF or URL)
    Linking.openURL(syllabus);
  };

  // Navigate to the Assignments screen
  const viewAssignments = (courseId) => {
    // Navigate to the Assignments screen and pass courseId
    navigation.navigate("Assignments", { courseId });
  };

  // If user is not found, display a message
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome, {user.name}!</Text>
        <Text style={styles.subtitle}>Your Enrolled Courses</Text>
        {courses.map((course, index) => (
          <Card key={index} style={styles.courseCard}>
            <Card.Content>
              <Title>{course.name}</Title>
              <Paragraph>{course.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => viewAssignments(course.id)} // Pass course ID to the next screen
              >
                View Assignments
              </Button>
              <Button
                mode="outlined"
                onPress={() => viewSyllabus(course.syllabus)}
                style={styles.syllabusButton}
              >
                View Syllabus
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  courseCard: {
    marginBottom: 20,
  },
  syllabusButton: {
    marginLeft: 10,
  },
});
