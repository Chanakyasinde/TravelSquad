import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import { useNavigation } from '@react-navigation/native';

export default function TripExpensesScreen({ route }) {
  const { trip } = route.params;
  const { trips } = useContext(TripContext);
  const navigation = useNavigation();

  const currentTrip = trips.find(t => t.id === trip.id);

  // Use email if available (backend), else id (offline)
  const getMemberKey = (m) => m.member_email ?? m.email ?? m.id ?? m.uid;
  const getMemberName = (m) => m.member_name ?? m.name ?? m.email ?? 'Unknown';

  const balances = useMemo(() => {
    const memberBalances = {};
    (currentTrip.members || []).forEach(member => {
      const key = getMemberKey(member);
      memberBalances[key] = { name: getMemberName(member), balance: 0 };
    });

    (currentTrip.expenses || []).forEach(expense => {
      const amount = parseFloat(expense.amount) || 0;
      const paidByKey = expense.paidBy ?? expense.paid_by;

      // Credit the payer (only if we can resolve them)
      if (paidByKey && memberBalances[paidByKey]) {
        memberBalances[paidByKey].balance += amount;
      }

      // Backend format: explicit per-member splits
      if (Array.isArray(expense.splits) && expense.splits.length > 0) {
        expense.splits.forEach(s => {
          const splitKey = s.member_email ?? s.email ?? s.memberId;
          const splitAmount = parseFloat(s.amount) || 0;
          if (splitKey && memberBalances[splitKey]) {
            memberBalances[splitKey].balance -= splitAmount;
          }
        });
      } else {
        // Offline/equal split
        const splitWithKeys = Array.isArray(expense.splitWith)
          ? expense.splitWith
          : (currentTrip.members || []).map(getMemberKey);

        const n = splitWithKeys.length;
        const share = n > 0 ? amount / n : 0;

        splitWithKeys.forEach(memberKey => {
          if (memberBalances[memberKey]) {
            memberBalances[memberKey].balance -= share;
          }
        });
      }
    });

    return Object.values(memberBalances);
  }, [currentTrip.expenses, currentTrip.members]);

  const renderExpense = ({ item }) => {
    const paidByVal = item.paidBy ?? item.paid_by;
    const paidByMember = (currentTrip.members || []).find(m => getMemberKey(m) === paidByVal);
    return (
      <View style={styles.expenseItem}>
        <View>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.paidByText}>Paid by {paidByMember?.member_name ?? paidByMember?.name ?? 'Unknown'}</Text>
        </View>
        <Text style={styles.expenseAmount}>${(parseFloat(item.amount) || 0).toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Debt Summary</Text>
        {balances.map((item, index) => (
          <View key={`${item.name}-${index}`} style={styles.balanceRow}>
            <Text style={styles.balanceName}>{item.name}</Text>
            <Text style={[styles.balanceAmount, item.balance < 0 ? styles.owesMoney : styles.owedMoney]}>
              {item.balance >= 0 ? `Is owed ${item.balance.toFixed(2)}` : `Owes ${(-item.balance).toFixed(2)}`}
            </Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.listHeader}>All Transactions</Text>
      <FlatList
        data={currentTrip.expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
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