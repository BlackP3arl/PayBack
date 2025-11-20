import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, Chip, Divider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store';
import { RootStackParamList, LoanWithDetails } from '../types';
import { formatCurrency, formatDate, isOverdue } from '../utils/format';

type LoanSummaryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoanSummary'>;
type LoanSummaryRouteProp = RouteProp<RootStackParamList, 'LoanSummary'>;

export const LoanSummaryScreen: React.FC = () => {
  const navigation = useNavigation<LoanSummaryNavigationProp>();
  const route = useRoute<LoanSummaryRouteProp>();
  const { contactId, contactName } = route.params;

  const { getContactWithLoans } = useStore();

  const contactWithLoans = getContactWithLoans(contactId);

  if (!contactWithLoans) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium">Contact not found</Text>
      </View>
    );
  }

  const renderLoanItem = ({ item }: { item: LoanWithDetails }) => {
    const overdue = isOverdue(item.dueDate) && item.balanceDue > 0;

    return (
      <Card
        style={[styles.card, overdue && styles.overdueCard]}
        onPress={() => navigation.navigate('LoanDetail', { loanId: item.id })}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text variant="titleMedium">
                {formatCurrency(item.amount)}
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                Issued: {formatDate(item.dateIssued)}
              </Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text
                variant="titleMedium"
                style={[
                  styles.balanceText,
                  item.balanceDue === 0 && styles.paidText,
                  overdue && styles.overdueText,
                ]}
              >
                {formatCurrency(item.balanceDue)}
              </Text>
              <Text variant="bodySmall" style={styles.balanceLabel}>
                Balance Due
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.cardFooter}>
            <View style={styles.chipContainer}>
              <Chip
                icon="calendar"
                compact
                style={[styles.chip, overdue && styles.overdueChip]}
              >
                Due: {formatDate(item.dueDate)}
              </Chip>

              {item.balanceDue === 0 && (
                <Chip icon="check-circle" compact style={styles.paidChip}>
                  Fully Paid
                </Chip>
              )}

              {item.totalPaid > 0 && item.balanceDue > 0 && (
                <Chip icon="progress-check" compact style={styles.partialChip}>
                  Paid: {formatCurrency(item.totalPaid)}
                </Chip>
              )}
            </View>

            {item.notes && (
              <Text variant="bodySmall" style={styles.notes} numberOfLines={2}>
                {item.notes}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {contactName}
        </Text>
        <Text variant="displaySmall" style={styles.totalAmount}>
          {formatCurrency(contactWithLoans.totalDue)}
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Total Outstanding
        </Text>
      </View>

      {contactWithLoans.loans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No loans yet</Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Tap + to add a new loan
          </Text>
        </View>
      ) : (
        <FlatList
          data={contactWithLoans.loans}
          renderItem={renderLoanItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddLoan', {
            contactId,
            contactName,
          })
        }
        label="New Loan"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    marginBottom: 8,
  },
  totalAmount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#B00020',
    backgroundColor: '#FFEBEE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  dateText: {
    color: '#666',
    marginTop: 4,
  },
  balanceText: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  paidText: {
    color: '#4CAF50',
  },
  overdueText: {
    color: '#B00020',
  },
  balanceLabel: {
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  cardFooter: {
    gap: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 4,
  },
  overdueChip: {
    backgroundColor: '#FFEBEE',
  },
  paidChip: {
    backgroundColor: '#E8F5E9',
  },
  partialChip: {
    backgroundColor: '#FFF3E0',
  },
  notes: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptySubtext: {
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
