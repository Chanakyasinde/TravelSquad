import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AddExpenseScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { trips, addExpense } = useContext(TripContext);
  const currentTrip = trips.find(t => t.id === tripId);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentTrip.members[0].id);
  const [splitWith, setSplitWith] = useState(currentTrip.members.map(m => m.id));

  const toggleSplitMember = (memberId) => {
    if (splitWith.includes(memberId)) {
      setSplitWith(splitWith.filter(id => id !== memberId));
    } else {
      setSplitWith([...splitWith, memberId]);
    }
  };

  const handleAddExpense = () => {
    if (!description || !amount || isNaN(amount) || parseFloat(amount) <= 0 || splitWith.length === 0) {
      Alert.alert('Invalid Input', 'Please enter a valid description, amount, and select at least one person to split with.');
      return;
    }
    
    const newExpense = {
      id: Math.random().toString(),
      description,
      amount: parseFloat(amount),
      paidBy: paidBy,
      splitWith: splitWith,
    };
    
    addExpense(tripId, newExpense);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} placeholder="e.g., Museum Tickets" value={description} onChangeText={setDescription} />
      
      <Text style={styles.label}>Amount ($)</Text>
      <TextInput style={styles.input} placeholder="50.00" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      
      <Text style={styles.label}>Paid by</Text>
      <View style={styles.memberSelector}>
        {currentTrip.members.map(member => (
          <TouchableOpacity key={member.id} style={[styles.memberChip, paidBy === member.id && styles.memberChipSelected]} onPress={() => setPaidBy(member.id)}>
            <Text style={paidBy === member.id && styles.memberChipSelectedText}>{member.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Split Evenly Between</Text>
      <View style={styles.memberSelector}>
        {currentTrip.members.map(member => (
          <TouchableOpacity key={member.id} style={[styles.memberChip, splitWith.includes(member.id) && styles.memberChipSelected]} onPress={() => toggleSplitMember(member.id)}>
            <Ionicons name={splitWith.includes(member.id) ? "checkbox" : "square-outline"} size={20} color={splitWith.includes(member.id) ? "#fff" : "#007AFF"} />
            <Text style={[styles.memberChipText, splitWith.includes(member.id) && styles.memberChipSelectedText]}>{member.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Save Expense" onPress={handleAddExpense} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 16, fontWeight: '500', marginBottom: 8, marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
    memberSelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    memberChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: '#007AFF' },
    memberChipSelected: { backgroundColor: '#007AFF' },
    memberChipText: { marginLeft: 6 },
    memberChipSelectedText: { color: '#fff', marginLeft: 6 },
});