import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";
import {
  TextInput as PaperInput,
  Button as PaperButton,
  Card,
} from "react-native-paper";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // Fetch the courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://192.168.29.144:3000/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!name || !description || !syllabus) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const newCourse = {
      name,
      description,
      syllabus,
    };

    try {
      const response = await fetch("http://192.168.29.144:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        const addedCourse = await response.json();
        setCourses((prevCourses) => [...prevCourses, addedCourse]);
        setIsAddingCourse(false); // Exit add course mode
        setName("");
        setDescription("");
        setSyllabus("");
        Alert.alert("Success", "Course added successfully!");
      } else {
        Alert.alert("Error", "Failed to add course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      Alert.alert("Error", "Failed to add course.");
    }
  };

  const renderCourseItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.courseName}>Name: {item.name}</Text>
      <Text style={styles.courseDescription}>
        Description: {item.description}
      </Text>
      <Text style={styles.courseSyllabus}>Syllabus URL: {item.syllabus}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Courses</Text>

      {isAddingCourse ? (
        <View style={styles.formContainer}>
          <PaperInput
            label="Course Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <PaperInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <PaperInput
            label="Syllabus URL"
            value={syllabus}
            onChangeText={setSyllabus}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <PaperButton mode="contained" onPress={handleAddCourse}>
              Add Course
            </PaperButton>
            <PaperButton
              mode="outlined"
              onPress={() => setIsAddingCourse(false)}
            >
              Cancel
            </PaperButton>
          </View>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCourseItem}
        />
      )}

      {!isAddingCourse && (
        <PaperButton
          mode="contained"
          onPress={() => setIsAddingCourse(true)}
          style={styles.addButton}
        >
          Add New Course
        </PaperButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  courseDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  courseSyllabus: {
    fontSize: 14,
    color: "#555",
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    marginTop: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10, // Add space between buttons
    flexDirection: "row", // To align buttons horizontally
    justifyContent: "space-between", // To give space between buttons
  },
});
