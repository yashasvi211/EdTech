import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("my");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    setIsRefreshing(true); // Set refreshing state to true
    try {
      const response = await fetch("http://192.168.29.144:3000/tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]); // Default to empty array on error
      Alert.alert("Error", "Unable to fetch tasks.");
    } finally {
      setIsRefreshing(false); // Reset refreshing state
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const markAsCompleted = async (id) => {
    try {
      const response = await fetch(`http://192.168.29.144:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: true } : task
          )
        );
        Alert.alert("Success", "Task marked as completed!");
      } else {
        Alert.alert("Error", "Failed to mark task as completed");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      Alert.alert("Error", "Unable to update task status.");
    }
  };

  const markAsUndone = async (id) => {
    try {
      const response = await fetch(`http://192.168.29.144:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: false }),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: false } : task
          )
        );
        Alert.alert("Success", "Task marked as undone!");
      } else {
        Alert.alert("Error", "Failed to mark task as undone");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      Alert.alert("Error", "Unable to update task status.");
    }
  };

  const renderTask = (task) => {
    const deadlineDate = new Date(task.deadline);
    const formattedDeadline = deadlineDate.toLocaleDateString("en-GB");

    let taskStyle = styles.pendingTask;
    if (task.completed) {
      taskStyle = styles.completedTask;
    } else if (new Date(task.deadline) < new Date()) {
      taskStyle = styles.dueTask;
    }

    return (
      <View style={[styles.taskCard, taskStyle]}>
        <Text style={styles.taskName}>{task.name}</Text>
        <Text style={styles.taskDeadline}>Deadline: {formattedDeadline}</Text>
        {!task.completed ? (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => markAsCompleted(task.id)}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => markAsUndone(task.id)}
          >
            <Text style={styles.completeButtonText}>Mark as Undone</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const myTasks = tasks.filter(
    (task) => !task.completed && new Date(task.deadline) >= new Date()
  );
  const pendingTasks = tasks.filter(
    (task) => !task.completed && new Date(task.deadline) < new Date()
  );
  const completedTasks = tasks.filter((task) => task.completed);

  const handleSectionToggle = (section) => {
    if (section === "pending" && activeSection === "pending") {
      setActiveSection("my");
    } else if (section === "completed" && activeSection === "completed") {
      setActiveSection("my");
    } else {
      setActiveSection(section);
    }
  };

  return (
    <View style={styles.container}>
      {/* Show My Tasks by default */}
      {activeSection === "my" && (
        <>
          <Text style={styles.sectionTitle}>My Tasks</Text>
          {myTasks.length > 0 ? (
            <FlatList
              data={myTasks}
              renderItem={({ item }) => renderTask(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchTasks}
                />
              }
            />
          ) : (
            <Text style={styles.noTasksText}>No tasks available.</Text>
          )}
        </>
      )}

      {/* Toggle for Pending Section */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => handleSectionToggle("pending")}
      >
        <Text style={styles.toggleButtonText}>
          {activeSection === "pending" ? "Hide" : "Show"} Pending Tasks
        </Text>
        <Ionicons
          name={activeSection === "pending" ? "chevron-up" : "chevron-down"}
          size={20}
        />
      </TouchableOpacity>

      {activeSection === "pending" && (
        <>
          <Text style={styles.sectionTitle}>Pending Tasks</Text>
          {pendingTasks.length > 0 ? (
            <FlatList
              data={pendingTasks}
              renderItem={({ item }) => renderTask(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchTasks}
                />
              }
            />
          ) : (
            <Text style={styles.noTasksText}>No pending tasks.</Text>
          )}
        </>
      )}

      {/* Toggle for Completed Section */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => handleSectionToggle("completed")}
      >
        <Text style={styles.toggleButtonText}>
          {activeSection === "completed" ? "Hide" : "Show"} Completed Tasks
        </Text>
        <Ionicons
          name={activeSection === "completed" ? "chevron-up" : "chevron-down"}
          size={20}
        />
      </TouchableOpacity>

      {activeSection === "completed" && (
        <>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
          {completedTasks.length > 0 ? (
            <FlatList
              data={completedTasks}
              renderItem={({ item }) => renderTask(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={fetchTasks}
                />
              }
            />
          ) : (
            <Text style={styles.noTasksText}>No completed tasks.</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  noTasksText: {
    fontSize: 16,
    color: "#828282",
    textAlign: "center",
  },
  taskCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pendingTask: {
    backgroundColor: "#ffb74d", // Orange for pending tasks
  },
  completedTask: {
    backgroundColor: "#81c784", // Green for completed tasks
  },
  dueTask: {
    backgroundColor: "#e57373", // Red for overdue tasks
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDeadline: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
