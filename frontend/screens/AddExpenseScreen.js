import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AddExpenseScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { trips, addExpense } = useContext(TripContext);
  const currentTrip = trips.find(t => t.id === tripId);

  // Canonical key: email (backend) else id (offline)
  const getMemberKey = (m) => m.member_email ?? m.email ?? m.id ?? m.uid;
  const getMemberName = (m) => m.member_name ?? m.name ?? m.email ?? 'Member';

  const membersList = (currentTrip.members || []);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(membersList.length ? getMemberKey(membersList[0]) : '');
  const [splitWith, setSplitWith] = useState(membersList.map(getMemberKey));

  const toggleSplitMember = (memberKey) => {
    if (splitWith.includes(memberKey)) {
      setSplitWith(splitWith.filter(k => k !== memberKey));
    } else {
      setSplitWith([...splitWith, memberKey]);
    }
  };

  const handleAddExpense = () => {
    if (!description || !amount || isNaN(amount) || parseFloat(amount) <= 0 || splitWith.length === 0) {
      Alert.alert('Invalid Input', 'Please enter a valid description, amount, and select at least one person to split with.');
      return;
    }

    const selectedMembers = membersList.filter(m => splitWith.includes(getMemberKey(m)));
    const evenShare = selectedMembers.length > 0 ? parseFloat(amount) / selectedMembers.length : 0;

    const paidByMember = membersList.find(m => getMemberKey(m) === paidBy);
    const paidByValue = paidByMember?.member_email || paidByMember?.email || getMemberKey(paidByMember) || paidBy;

    const splitBetween = selectedMembers.map(m => ({
      email: m.member_email || m.email || getMemberKey(m),
      amount: evenShare
    }));

    const newExpense = {
      id: Math.random().toString(),
      description,
      amount: parseFloat(amount),
      paidBy: paidByValue,     // Email for backend, key for offline fallback
      splitWith: splitWith,    // Offline-friendly equal split keys
      splitBetween,            // Backend-friendly per-member splits
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
        {membersList.map(m => {
          const key = getMemberKey(m);
          const name = getMemberName(m);
          const selected = paidBy === key;
          return (
            <TouchableOpacity key={key} style={[styles.memberChip, selected && styles.memberChipSelected]} onPress={() => setPaidBy(key)}>
              <Text style={selected && styles.memberChipSelectedText}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Split Evenly Between</Text>
      <View style={styles.memberSelector}>
        {membersList.map(m => {
          const key = getMemberKey(m);
          const name = getMemberName(m);
          const selected = splitWith.includes(key);
          return (
            <TouchableOpacity key={key} style={[styles.memberChip, selected && styles.memberChipSelected]} onPress={() => toggleSplitMember(key)}>
              <Ionicons name={selected ? "checkbox" : "square-outline"} size={20} color={selected ? "#fff" : "#007AFF"} />
              <Text style={[styles.memberChipText, selected && styles.memberChipSelectedText]}>{name}</Text>
            </TouchableOpacity>
          );
        })}
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