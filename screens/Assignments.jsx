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

const loadSession = async () => {
  try {
    const sessionData = await AsyncStorage.getItem("userSession");
    console.log("Retrieved session data:", sessionData); // Debug log
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      setUser(parsedData); // Set user data if found
      await AsyncStorage.setItem("studentId", JSON.stringify(parsedData.id)); // Save studentId
    } else {
      navigation.navigate("SignIn"); // Navigate to SignIn if no session
    }
  } catch (error) {
    console.error("Error loading session:", error); // Log error
    Alert.alert("Error", "Failed to load session data.");
  }
};

export default function Assignments({ route }) {
  const { courseId } = route.params;
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");

  // Function to open the PDF link
  const openPdfLink = (pdfLink) => {
    Linking.openURL(pdfLink).catch((err) =>
      console.error("Failed to open PDF link:", err)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student ID from AsyncStorage
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

      // Update the assignments state to mark this specific assignment as submitted
      const updatedAssignments = assignments.map((assignment) =>
        assignment.id === selectedAssignment.id
          ? { ...assignment, submitted: true }
          : assignment
      );

      setAssignments(updatedAssignments);

      Alert.alert("Success", "Assignment submitted successfully");
      setSelectedAssignment(null);
      setSubmissionLink("");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      Alert.alert(
        "Submission Error",
        error.response?.data || "Failed to submit assignment"
      );
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
        <Text style={styles.noAssignmentsText}>No assignments found</Text>
      )}

      {renderSubmissionModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  assignmentCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f4f4f9",
    borderRadius: 10,
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
    marginLeft: 5,
    color: "#007bff",
  },
  assignmentDescription: {
    marginTop: 10,
    color: "#666",
  },
  assignmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  assignmentDate: {
    color: "#666",
  },
  submitAssignmentButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  submitAssignmentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  linkInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
  },
  submittedText: {
    color: "green",
    fontWeight: "bold",
  },

  noAssignmentsText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
  },
});
