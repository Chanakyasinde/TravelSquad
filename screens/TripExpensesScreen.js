import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import { useNavigation } from '@react-navigation/native';

export default function TripExpensesScreen({ route }) {
  const { trip } = route.params;
  const { trips } = useContext(TripContext);
  const navigation = useNavigation();

  const currentTrip = trips.find(t => t.id === trip.id);

  const balances = useMemo(() => {
    const memberBalances = {};
    currentTrip.members.forEach(member => {
      memberBalances[member.id] = { name: member.name, balance: 0 };
    });

    currentTrip.expenses.forEach(expense => {
      const amount = expense.amount;
      const paidById = expense.paidBy;
      const splitWithIds = expense.splitWith;
      const share = amount / splitWithIds.length;

      memberBalances[paidById].balance += amount;
      splitWithIds.forEach(memberId => {
        memberBalances[memberId].balance -= share;
      });
    });

    return Object.values(memberBalances);
  }, [currentTrip.expenses, currentTrip.members]);

  const renderExpense = ({ item }) => {
    const paidByMember = currentTrip.members.find(m => m.id === item.paidBy);
    return (
      <View style={styles.expenseItem}>
        <View>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.paidByText}>Paid by {paidByMember?.name || 'Unknown'}</Text>
        </View>
        <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Debt Summary</Text>
        {balances.map(item => (
          <View key={item.name} style={styles.balanceRow}>
            <Text style={styles.balanceName}>{item.name}</Text>
            <Text style={[styles.balanceAmount, item.balance < 0 ? styles.owesMoney : styles.owedMoney]}>
              {item.balance >= 0 ? `Is owed $${item.balance.toFixed(2)}` : `Owes $${(-item.balance).toFixed(2)}`}
            </Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.listHeader}>All Transactions</Text>
      <FlatList
        data={currentTrip.expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses recorded yet.</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="+ Add Expense" 
          onPress={() => navigation.navigate('AddExpense', { tripId: trip.id })} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    summaryContainer: { padding: 20, backgroundColor: '#fff', marginBottom: 10 },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    balanceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    balanceName: { fontSize: 16 },
    balanceAmount: { fontSize: 16, fontWeight: '500' },
    owesMoney: { color: '#dc3545' },
    owedMoney: { color: '#28a745' },
    listHeader: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, paddingBottom: 10 },
    expenseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
    expenseDescription: { fontSize: 16 },
    paidByText: { fontSize: 12, color: 'gray', marginTop: 4 },
    expenseAmount: { fontSize: 16, fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: 'gray' },
    buttonContainer: { padding: 20, backgroundColor: '#f0f2f5' },
});