import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Searchbar, Card, Text, FAB, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store';
import { RootStackParamList, ContactWithLoans } from '../types';
import { formatCurrency } from '../utils/format';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { loadData, getAllContactsWithLoans, getTotalOutstanding, isLoading } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const contactsWithLoans = getAllContactsWithLoans();
  const totalOutstanding = getTotalOutstanding();

  // Filter contacts based on search query
  const filteredContacts = contactsWithLoans.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by total due amount (highest first)
  const sortedContacts = filteredContacts.sort((a, b) => b.totalDue - a.totalDue);

  const renderContactItem = ({ item }: { item: ContactWithLoans }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('LoanSummary', {
        contactId: item.id,
        contactName: item.name,
      })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.contactName}>
            {item.name}
          </Text>
          <Text variant="titleMedium" style={styles.amount}>
            {formatCurrency(item.totalDue)}
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <Chip icon="file-document-outline" compact>
            {item.loans.length} {item.loans.length === 1 ? 'loan' : 'loans'}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading && contactsWithLoans.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Total Outstanding
        </Text>
        <Text variant="displaySmall" style={styles.totalAmount}>
          {formatCurrency(totalOutstanding)}
        </Text>
      </View>

      <Searchbar
        placeholder="Search contacts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {sortedContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            {searchQuery ? 'No contacts found' : 'No loans yet'}
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search term' : 'Tap + to add a new loan'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('ContactSelector')}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 24,
    paddingTop: 48,
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
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactName: {
    flex: 1,
    fontWeight: 'bold',
  },
  amount: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
