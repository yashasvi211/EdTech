import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://edtech-server-3dnc.onrender.com/login",
        {
          email,
          password,
        }
      );
      const { id, role, name } = response.data; // Assuming user data comes with 'id', 'role', and 'name'

      // Save user session
      const userData = { id, name, role, email };
      await AsyncStorage.setItem("userSession", JSON.stringify(userData));

      // Navigate to the dashboard based on user role
      if (role === "teacher") {
        navigation.navigate("TeacherDashboard", { user: userData });
      } else {
        navigation.navigate("StudentDashboard", { user: userData });
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data || "Invalid login credentials");
    }
  };

  return (
    <View style={styles.container}>
      {/* App Name - EdTech */}
      <Text style={styles.appName}>EdTech</Text>

      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} color="#4CAF50" />
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: 30, // To create some space between app name and login form
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
  linkText: {
    textAlign: "center",
    color: "#007BFF",
    marginTop: 20,
  },
});
