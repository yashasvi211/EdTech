import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import {
  TextInput as PaperInput,
  Button as PaperButton,
  Card,
} from "react-native-paper";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);

  // Fetch assignments and courses from the API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://192.168.29.144:3000/assignments");
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://192.168.29.144:3000/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchAssignments();
    fetchCourses();
  }, []);

  const handleAddAssignment = async () => {
    if (!title || !description || !pdfLink || !courseId) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const newAssignment = {
      title,
      description,
      pdf_link: pdfLink,
      course_id: courseId,
    };

    try {
      const response = await fetch("http://192.168.29.144:3000/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        const addedAssignment = await response.json();
        setAssignments((prevAssignments) => [
          ...prevAssignments,
          addedAssignment,
        ]);
        setIsAddingAssignment(false); // Exit add assignment mode
        setTitle("");
        setDescription("");
        setPdfLink("");
        setCourseId("");
        Alert.alert("Success", "Assignment added successfully!");
      } else {
        Alert.alert("Error", "Failed to add assignment.");
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
      Alert.alert("Error", "Failed to add assignment.");
    }
  };

  const renderAssignmentItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.assignmentTitle}>{item.title}</Text>
      <Text style={styles.assignmentDescription}>{item.description}</Text>
      <Text style={styles.assignmentLink}>PDF: {item.pdf_link}</Text>
      <Text style={styles.assignmentCourse}>Course: {item.course_name}</Text>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Manage Assignments</Text>

        {isAddingAssignment ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.formContainer}>
              <PaperInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <PaperInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
              <PaperInput
                label="PDF Link"
                value={pdfLink}
                onChangeText={setPdfLink}
                style={styles.input}
              />
              {/* Picker for selecting a course */}
              <Picker
                selectedValue={courseId}
                onValueChange={setCourseId}
                style={styles.picker}
              >
                <Picker.Item label="Select Course" value="" />
                {courses.map((course) => (
                  <Picker.Item
                    key={course.id}
                    label={course.name}
                    value={course.id}
                  />
                ))}
              </Picker>

              <View style={styles.buttonContainer}>
                <PaperButton mode="contained" onPress={handleAddAssignment}>
                  Add Assignment
                </PaperButton>
                <PaperButton
                  mode="outlined"
                  onPress={() => setIsAddingAssignment(false)}
                >
                  Cancel
                </PaperButton>
              </View>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            nestedScrollEnabled
            data={assignments}
            keyExtractor={(item) =>
              item.assignment_id?.toString() ||
              item.id?.toString() ||
              Math.random().toString()
            }
            renderItem={renderAssignmentItem}
          />
        )}

        {!isAddingAssignment && (
          <PaperButton
            mode="contained"
            onPress={() => setIsAddingAssignment(true)}
            style={styles.addButton}
          >
            Add New Assignment
          </PaperButton>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  picker: {
    marginBottom: 15,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  assignmentDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  assignmentLink: {
    fontSize: 14,
    color: "#555",
  },
  assignmentCourse: {
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
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ManageAssignments;
