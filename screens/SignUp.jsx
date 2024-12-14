import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
} from "react-native";
import axios from "axios";

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [loading, setLoading] = useState(false); // State to track loading

  const handleSignUp = async () => {
    setLoading(true); // Set loading to true when sign-up starts
    try {
      const response = await axios.post(
        "https://edtech-server-3dnc.onrender.com/signup",
        {
          name,
          email,
          password,
          role,
        }
      );
      Alert.alert("Success", response.data);
      navigation.navigate("SignIn");
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert("Error", "Email is already taken");
      } else {
        console.error("Error in signup: ", error); // Log full error for debugging
        Alert.alert("Error", error.response?.data || "Something went wrong");
      }
    } finally {
      setLoading(false); // Set loading to false once the request is finished
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleButton, role === "student" && styles.activeRole]}
          onPress={() => setRole("student")}
        >
          <Text style={styles.roleText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === "teacher" && styles.activeRole]}
          onPress={() => setRole("teacher")}
        >
          <Text style={styles.roleText}>Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render button or loading spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Button
          title="Sign Up"
          onPress={handleSignUp}
          color="#4CAF50"
          disabled={loading}
        />
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  activeRole: {
    backgroundColor: "#4CAF50",
  },
  roleText: {
    fontSize: 18,
    color: "#333",
  },
  linkText: {
    textAlign: "center",
    color: "#007BFF",
    marginTop: 20,
  },
});
