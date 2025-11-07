import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import { auth } from '../firebaseConfig';
import axios from 'axios';

// Resolve backend host for emulator/simulator or env override
const HOST =
  (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_HOST) ||
  (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const SERVER_URL = `http://${HOST}:3001`;

export default function TripChatScreen({ route }) {
  const { tripId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/chat/${tripId}`, { timeout: 10000 });
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching message history:', err);
        setMessages([]);
      }
    };

    fetchMessageHistory();

    socketRef.current = io(SERVER_URL, {
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current.emit('joinRoom', tripId);

    socketRef.current.on('receiveMessage', (messageData) => {
      setMessages((prevMessages) => [messageData, ...prevMessages]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [tripId]);

  const handleSend = () => {
    if (message.trim() === '') return;
    const messageData = {
      roomId: tripId,
      id: Math.random().toString(), 
      text: message,
      senderEmail: user?.email || 'Anonymous',
      createdAt: new Date(),
    };
    
    // Add message to local state immediately for instant feedback
    setMessages(prevMessages => [messageData, ...prevMessages]);
    
    // Send to server
    socketRef.current.emit('sendMessage', messageData);
    setMessage('');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = user?.email && ((item.senderEmail || item.sender_email) === user.email);
    return (
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {!isMyMessage && <Text style={styles.senderEmail}>{item.senderEmail || item.sender_email}</Text>}
        <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
          {item.text || item.message_text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => {
            const key = item.id ?? item.message_id ?? item._id;
            if (key !== undefined && key !== null) return String(key);
            // fallback if backend didn't supply an id
            const created = item.createdAt || item.created_at;
            return `${item.senderEmail || item.sender_email || 'unknown'}-${created || Math.random().toString(36).slice(2)}`;
          }}
          style={styles.messageList}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Type a message..." />
          <Button title="Send" onPress={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingView: { flex: 1 },
  messageList: { flex: 1, padding: 10 },
  messageBubble: { padding: 12, borderRadius: 18, marginVertical: 4, maxWidth: '80%' },
  myMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#e5e5ea', alignSelf: 'flex-start' },
  myMessageText: { color: '#fff' },
  otherMessageText: { color: '#000' },
  senderEmail: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 2 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, backgroundColor: '#f9f9f9' },
});