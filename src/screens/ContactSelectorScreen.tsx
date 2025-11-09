import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import { Searchbar, List, Button, ActivityIndicator, Text, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Contacts from 'expo-contacts';
import { useStore } from '../store';
import { RootStackParamList } from '../types';

type ContactSelectorNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactSelector'>;

interface PhoneContact {
  id: string;
  name: string;
  phoneNumbers?: string[];
}

export const ContactSelectorScreen: React.FC = () => {
  const navigation = useNavigation<ContactSelectorNavigationProp>();
  const { addContact, contacts: existingContacts } = useStore();

  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        loadContacts();
      } else {
        Alert.alert(
          'Permission Required',
          'Please grant contacts permission to select friends.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const formattedContacts = data
          .filter((contact) => contact.name)
          .map((contact) => ({
            id: contact.id,
            name: contact.name || 'Unknown',
            phoneNumbers: contact.phoneNumbers?.map((p) => p.number).filter((n): n is string => n !== undefined),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setPhoneContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSelect = async (contact: PhoneContact) => {
    try {
      // Check if contact already exists in our database
      const existingContact = existingContacts.find(
        (c) => c.name.toLowerCase() === contact.name.toLowerCase()
      );

      if (existingContact) {
        // Navigate to add loan for existing contact
        navigation.navigate('AddLoan', {
          contactId: existingContact.id,
          contactName: existingContact.name,
        });
      } else {
        // Add new contact to database
        await addContact({
          name: contact.name,
          phoneNumber: contact.phoneNumbers?.[0],
        });

        // Get the newly added contact
        const newContact = existingContacts.find(
          (c) => c.name.toLowerCase() === contact.name.toLowerCase()
        );

        if (newContact) {
          navigation.navigate('AddLoan', {
            contactId: newContact.id,
            contactName: newContact.name,
          });
        }
      }
    } catch (error) {
      console.error('Error selecting contact:', error);
      Alert.alert('Error', 'Failed to select contact');
    }
  };

  const filteredContacts = phoneContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyLarge" style={styles.permissionText}>
          Contacts permission required
        </Text>
        <Button
          mode="contained"
          onPress={requestContactsPermission}
          style={styles.permissionButton}
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search contacts..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No contacts found</Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            {searchQuery
              ? 'Try a different search term'
              : 'No contacts available in your phone'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <>
              <List.Item
                title={item.name}
                description={item.phoneNumbers?.[0] || 'No phone number'}
                left={(props) => <List.Icon {...props} icon="account" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handleContactSelect(item)}
              />
              <Divider />
            </>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  searchBar: {
    margin: 16,
  },
  loadingText: {
    marginTop: 16,
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
  permissionText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    marginTop: 8,
  },
});
