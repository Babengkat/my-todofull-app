import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Switch, TouchableOpacity, Modal, Pressable } from "react-native";
import axios from "axios";

const API_URL = 'https://my-todofull-app.onrender.com/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  const addTask = async () => {
    if (title.trim() === "") return;
    try {
      const res = await axios.post(API_URL, { title, completed: false });
      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Error adding task:", err.message);
    }
  };

  const toggleComplete = async (id, currentStatus, title) => {
    try {
      await axios.put(`${API_URL}/${id}`, { title, completed: !currentStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const submitEdit = async () => {
    try {
      await axios.put(`${API_URL}/${editingTask.id}`, { title: editTitle, completed: editingTask.completed });
      setEditingTask(null);
      setEditTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error editing task:", err.message);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, darkMode && styles.darkText]}>📝 My Tasks</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} thumbColor={darkMode ? "#f5a" : "#f0f0f0"} />
      </View>

      <View style={styles.filterContainer}>
        {['all', 'completed', 'incomplete'].map((f) => (
          <Pressable
            key={f}
            style={[styles.filterButton, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}>
            <Text style={styles.filterText}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity style={styles.taskBubble} onPress={() => toggleComplete(item.id, item.completed, item.title)}>
              <Text style={[styles.taskText, item.completed && styles.taskCompleted]}>{item.title}</Text>
            </TouchableOpacity>
            <View style={styles.taskActions}>
              <Text onPress={() => startEditing(item)} style={styles.icon}>✏️</Text>
              <Text onPress={() => deleteTask(item.id)} style={styles.icon}>🗑️</Text>
            </View>
          </View>
        )}
      />

      <TextInput
        style={[styles.input, darkMode && styles.darkInput]}
        value={title}
        onChangeText={setTitle}
        placeholder="Add a cute task 💕"
        placeholderTextColor={darkMode ? "#aaa" : "#999"}
      />
      <Pressable style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>＋ Add Task</Text>
      </Pressable>

      <Modal visible={editingTask !== null} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, darkMode && styles.darkContainer]}>
            <TextInput
              style={[styles.input, darkMode && styles.darkInput]}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <Pressable style={styles.saveButton} onPress={submitEdit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setEditingTask(null)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#1c1c1e",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#e91e63",
  },
  darkText: {
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#f8bbd0",
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#ec407a",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#fce4ec",
    borderRadius: 12,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  taskBubble: {
    flex: 1,
  },
  taskActions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  icon: {
    fontSize: 18,
    marginHorizontal: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  darkInput: {
    backgroundColor: "#333",
    color: "#fff",
    borderColor: "#555",
  },
  addButton: {
    backgroundColor: "#ec407a",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    margin: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  saveButton: {
    backgroundColor: "#ba68c8",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#e57373",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
