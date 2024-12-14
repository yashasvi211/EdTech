// Assignments.js (React Native)

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Assignments = ({ route }) => {
  const { courseId } = route.params;
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");

  // Function to open PDF link
  const openPdfLink = (pdfLink) => {
    Linking.openURL(pdfLink).catch((err) =>
      console.error("Failed to open PDF link:", err)
    );
  };

  // Load student session and assignments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedStudentId = await AsyncStorage.getItem("studentId");
        if (storedStudentId) {
          const parsedStudentId = JSON.parse(storedStudentId);
          setStudentId(parsedStudentId);

          setIsLoading(true);
          const response = await axios.get(
            `http://192.168.29.144:3000/assignments/${courseId}`,
            {
              params: { studentId: parsedStudentId },
            }
          );

          console.log("Assignments fetched:", response.data);
          setAssignments(response.data);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setError(error.message || "Failed to fetch assignments");
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Handle assignment submission
  const submitAssignment = async () => {
    if (!submissionLink.trim()) {
      Alert.alert("Error", "Please enter a valid submission link");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.29.144:3000/submit-assignment",
        {
          assignment_id: selectedAssignment.id,
          student_id: studentId,
          file_link: submissionLink.trim(),
        }
      );

      const updatedAssignments = assignments.map((assignment) =>
        assignment.id === selectedAssignment.id
          ? { ...assignment, submitted: true }
          : assignment
      );

      setAssignments(updatedAssignments);

      Alert.alert("Success", response.data.message); // Use the response message here
      setSelectedAssignment(null);
      setSubmissionLink("");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit assignment";
      Alert.alert("Submission Error", errorMessage); // Show a user-friendly error message
    }
  };

  const renderSubmissionModal = () => (
    <Modal
      visible={!!selectedAssignment}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSelectedAssignment(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Submit Assignment: {selectedAssignment?.title}
          </Text>

          <TextInput
            style={styles.linkInput}
            placeholder="Enter submission link (Google Drive, Dropbox, etc.)"
            value={submissionLink}
            onChangeText={setSubmissionLink}
          />

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedAssignment(null)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitAssignment}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAssignmentCard = ({ item }) => (
    <View style={styles.assignmentCard}>
      <View style={styles.assignmentHeader}>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.pdfButton}
          onPress={() => openPdfLink(item.pdf_link)}
        >
          <Ionicons name="document-text" size={24} color="#007bff" />
          <Text style={styles.pdfButtonText}>Open PDF</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.assignmentDescription}>{item.description}</Text>

      <View style={styles.assignmentFooter}>
        <Text style={styles.assignmentDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
        {item.submitted ? (
          <Text style={styles.submittedText}>Submitted</Text>
        ) : (
          <TouchableOpacity
            style={styles.submitAssignmentButton}
            onPress={() => setSelectedAssignment(item)}
          >
            <Text style={styles.submitAssignmentButtonText}>
              Submit Assignment
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading assignments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Assignments for Course {courseId}</Text>
      {assignments.length > 0 ? (
        <FlatList
          data={assignments}
          renderItem={renderAssignmentCard}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noAssignmentsText}>No assignments available</Text>
      )}

      {renderSubmissionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  // Your styles here
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noAssignmentsText: {
    fontSize: 16,
    color: "gray",
  },
  assignmentCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pdfButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  pdfButtonText: {
    color: "#007bff",
    marginLeft: 8,
  },
  assignmentDescription: {
    marginVertical: 8,
    color: "gray",
  },
  assignmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentDate: {
    color: "gray",
  },
  submittedText: {
    color: "green",
    fontWeight: "bold",
  },
  submitAssignmentButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 4,
  },
  submitAssignmentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#007bff",
    padding: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
    flex: 1,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Assignments;
