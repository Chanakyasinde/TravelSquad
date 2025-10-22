import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io } from 'socket.io-client';
import { auth } from '../firebaseConfig';

const SERVER_URL = 'http://10.254.201.116:3001';

export default function TripChatScreen({ route }) {
  const { trip } = route.params; 
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    socketRef.current = io(SERVER_URL);

    socketRef.current.emit('joinRoom', trip.id);

    socketRef.current.on('receiveMessage', (messageData) => {
      setMessages((prevMessages) => [messageData, ...prevMessages]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [trip.id]); 

  const handleSend = () => {
    if (message.trim() === '') return;

    const messageData = {
      roomId: trip.id, 
      id: Math.random().toString(),
      text: message,
      senderEmail: user?.email || 'Anonymous',
      createdAt: new Date(),
    };

    socketRef.current.emit('sendMessage', messageData);
    setMessage('');
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderEmail === user.email;
    return (
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {!isMyMessage && <Text style={styles.senderEmail}>{item.senderEmail}</Text>}
        <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
          {item.text}
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
          keyExtractor={(item) => item.id}
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