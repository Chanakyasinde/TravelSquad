import React, { useContext, useMemo, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TripContext } from '../contexts/TripContext';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/ui/Screen';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Title, Subtitle, Body, Caption } from '../components/ui/Typography';
import { useTheme } from '../contexts/ThemeContext';

export default function TripExpensesScreen({ route }) {
  const { tripId } = route.params;
  const { trips } = useContext(TripContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  const currentTrip = trips.find(t => t.id === tripId);

  useEffect(() => {
    if (!currentTrip) {
      const parent = navigation.getParent?.();
      if (parent?.canGoBack?.()) parent.goBack();
      else if (parent) parent.navigate('MainTabs');
    }
  }, [currentTrip, navigation]);

  const memberList = currentTrip?.members || [];
  const expenseList = currentTrip?.expenses || [];

  const getMemberKey = (m) => m.member_email ?? m.email ?? m.id ?? m.uid;
  const getMemberName = (m) => m.member_name ?? m.name ?? m.email ?? 'Unknown';

  const balances = useMemo(() => {
    const memberBalances = {};
    memberList.forEach(member => {
      const key = getMemberKey(member);
      memberBalances[key] = { name: getMemberName(member), balance: 0 };
    });

    expenseList.forEach(expense => {
      const amount = parseFloat(expense.amount) || 0;
      const paidByKey = expense.paidBy ?? expense.paid_by;

      if (paidByKey && memberBalances[paidByKey]) {
        memberBalances[paidByKey].balance += amount;
      }

      if (Array.isArray(expense.splits) && expense.splits.length > 0) {
        expense.splits.forEach(s => {
          const splitKey = s.member_email ?? s.email ?? s.memberId;
          const splitAmount = parseFloat(s.amount) || 0;
          if (splitKey && memberBalances[splitKey]) {
            memberBalances[splitKey].balance -= splitAmount;
          }
        });
      } else {
        const splitWithKeys = Array.isArray(expense.splitWith)
          ? expense.splitWith
          : memberList.map(getMemberKey);

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
  }, [memberList, expenseList]);

  if (!currentTrip) {
    return (
      <Screen style={styles.container}>
        <Body style={[styles.emptyText, { color: theme.colors.text.secondary }]}>This trip was removed.</Body>
      </Screen>
    );
  }

  const renderExpense = ({ item }) => {
    const paidByVal = item.paidBy ?? item.paid_by;
    const paidByMember = memberList.find(m => getMemberKey(m) === paidByVal);
    return (
      <Card style={[styles.expenseItem, { marginBottom: theme.spacing.m }]}>
        <View style={styles.expenseInfo}>
          <Body style={styles.expenseDescription}>{item.description}</Body>
          <Caption style={styles.paidByText}>Paid by {paidByMember?.member_name ?? paidByMember?.name ?? 'Unknown'}</Caption>
        </View>
        <Subtitle style={[styles.expenseAmount, { color: theme.colors.primary }]}>₹{(parseFloat(item.amount) || 0).toFixed(2)}</Subtitle>
      </Card>
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={[
        styles.summaryContainer,
        {
          padding: theme.spacing.l,
          backgroundColor: theme.colors.surface,
          marginBottom: theme.spacing.m,
          borderBottomColor: theme.colors.border
        }
      ]}>
        <Title style={[styles.summaryTitle, { marginBottom: theme.spacing.m }]}>Debt Summary</Title>
        {balances.map((item, index) => (
          <View key={`${item.name}-${index}`} style={styles.balanceRow}>
            <Body style={[styles.balanceName, { color: theme.colors.text.primary }]}>{item.name}</Body>
            <Body style={[
              styles.balanceAmount,
              item.balance < 0 ? { color: theme.colors.error } : { color: theme.colors.success }
            ]}>
              {item.balance >= 0 ? `Is owed ₹${item.balance.toFixed(2)}` : `Owes ₹${(-item.balance).toFixed(2)}`}
            </Body>
          </View>
        ))}
      </View>

      <View style={[styles.listHeaderContainer, { paddingHorizontal: theme.spacing.l, marginBottom: theme.spacing.s }]}>
        <Subtitle style={styles.listHeader}>All Transactions</Subtitle>
        <Button
          title="+ Add"
          onPress={() => navigation.navigate('AddExpense', { tripId })}
          style={[styles.addButton, { paddingVertical: theme.spacing.s, paddingHorizontal: theme.spacing.m }]}
        />
      </View>

      <FlatList
        data={expenseList}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id ? String(item.id) : Math.random().toString()}
        ListEmptyComponent={<Body style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No expenses recorded yet.</Body>}
        contentContainerStyle={[styles.list, { padding: theme.spacing.m }]}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    borderBottomWidth: 1,
  },
  summaryTitle: {
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  balanceName: {
  },
  balanceAmount: {
    fontWeight: '600',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeader: {
    marginBottom: 0,
  },
  addButton: {
  },
  list: {
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontWeight: '600',
  },
  paidByText: {
    marginTop: 4,
  },
  expenseAmount: {
    marginBottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
  },
});