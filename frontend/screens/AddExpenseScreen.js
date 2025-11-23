import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import Screen from '../components/ui/Screen';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Title, Body, Caption } from '../components/ui/Typography';
import { theme } from '../theme/theme';

export default function AddExpenseScreen({ route, navigation }) {
  const { tripId } = route.params;
  const { trips, addExpense } = useContext(TripContext);
  const currentTrip = trips.find(t => t.id === tripId);

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
      paidBy: paidByValue,
      splitWith: splitWith,
      splitBetween,
    };

    addExpense(tripId, newExpense);
    navigation.goBack();
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Title style={styles.title}>Add Expense</Title>

        <Input
          label="Description"
          placeholder="e.g., Museum Tickets"
          value={description}
          onChangeText={setDescription}
        />

        <Input
          label="Amount (₹)"
          placeholder="50.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Body style={styles.label}>Paid by</Body>
        <View style={styles.memberSelector}>
          {membersList.map(m => {
            const key = getMemberKey(m);
            const name = getMemberName(m);
            const selected = paidBy === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.memberChip, selected && styles.memberChipSelected]}
                onPress={() => setPaidBy(key)}
              >
                <Caption style={[styles.memberChipText, selected && styles.memberChipSelectedText]}>{name}</Caption>
              </TouchableOpacity>
            );
          })}
        </View>

        <Body style={styles.label}>Split Evenly Between</Body>
        <View style={styles.memberSelector}>
          {membersList.map(m => {
            const key = getMemberKey(m);
            const name = getMemberName(m);
            const selected = splitWith.includes(key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.memberChip, selected && styles.memberChipSelected]}
                onPress={() => toggleSplitMember(key)}
              >
                <Ionicons name={selected ? "checkbox" : "square-outline"} size={16} color={selected ? "#fff" : theme.colors.primary} />
                <Caption style={[styles.memberChipText, selected && styles.memberChipSelectedText, { marginLeft: 6 }]}>{name}</Caption>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Save Expense" onPress={handleAddExpense} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.l,
  },
  title: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    marginBottom: theme.spacing.s,
    marginTop: theme.spacing.s,
    fontWeight: '600',
  },
  memberSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.m,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  memberChipSelected: {
    backgroundColor: theme.colors.primary,
  },
  memberChipText: {
    color: theme.colors.primary,
  },
  memberChipSelectedText: {
    color: theme.colors.text.inverse,
  },
  buttonContainer: {
    marginTop: theme.spacing.l,
  },
});