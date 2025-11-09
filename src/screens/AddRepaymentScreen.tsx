import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  IconButton,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store';
import { RootStackParamList } from '../types';
import { isValidAmount, parseCurrencyInput, formatCurrency } from '../utils/format';

type AddRepaymentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddRepayment'>;
type AddRepaymentRouteProp = RouteProp<RootStackParamList, 'AddRepayment'>;

export const AddRepaymentScreen: React.FC = () => {
  const navigation = useNavigation<AddRepaymentNavigationProp>();
  const route = useRoute<AddRepaymentRouteProp>();
  const { loanId, contactId } = route.params;

  const { addRepayment, getLoanWithDetails } = useStore();

  const loan = getLoanWithDetails(loanId);

  const [amount, setAmount] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [attachmentUri, setAttachmentUri] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loan) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium">Loan not found</Text>
      </View>
    );
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library permission');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachmentUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permission');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachmentUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeAttachment = () => {
    setAttachmentUri(undefined);
  };

  const handleSubmit = async () => {
    // Validation
    const parsedAmount = parseCurrencyInput(amount);
    if (!isValidAmount(parsedAmount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    if (parsedAmount > loan.balanceDue) {
      Alert.alert(
        'Amount Exceeds Balance',
        `The repayment amount (${formatCurrency(parsedAmount)}) exceeds the remaining balance (${formatCurrency(loan.balanceDue)}). Do you want to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => submitRepayment(parsedAmount) },
        ]
      );
      return;
    }

    submitRepayment(parsedAmount);
  };

  const submitRepayment = async (parsedAmount: number) => {
    setIsSubmitting(true);

    try {
      await addRepayment({
        loanId,
        amount: parsedAmount,
        repaymentDate: repaymentDate.toISOString(),
        notes: notes.trim() || undefined,
        attachmentUri,
      });

      Alert.alert('Success', 'Repayment added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('LoanDetail', { loanId }),
        },
      ]);
    } catch (error) {
      console.error('Error adding repayment:', error);
      Alert.alert('Error', 'Failed to add repayment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Add Receipt', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Add Repayment
          </Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.label}>
                Contact:
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {loan.contactName}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.label}>
                Loan Amount:
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {formatCurrency(loan.amount)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.label}>
                Total Paid:
              </Text>
              <Text variant="bodyLarge" style={[styles.value, styles.paidText]}>
                {formatCurrency(loan.totalPaid)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={[styles.label, styles.boldLabel]}>
                Balance Due:
              </Text>
              <Text variant="titleMedium" style={[styles.value, styles.balanceText]}>
                {formatCurrency(loan.balanceDue)}
              </Text>
            </View>
          </View>

          <TextInput
            label="Repayment Amount (MVR)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="currency-usd" />}
          />

          <View style={styles.dateContainer}>
            <Text variant="labelLarge">Repayment Date</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              {repaymentDate.toLocaleDateString()}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={repaymentDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setRepaymentDate(selectedDate);
                }
              }}
            />
          )}

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.attachmentSection}>
            <Text variant="labelLarge" style={styles.attachmentLabel}>
              Attach Receipt (Optional)
            </Text>

            {attachmentUri ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: attachmentUri }} style={styles.image} />
                <IconButton
                  icon="close-circle"
                  size={24}
                  onPress={removeAttachment}
                  style={styles.removeButton}
                />
              </View>
            ) : (
              <Button
                mode="outlined"
                icon="camera"
                onPress={showImageOptions}
                style={styles.attachButton}
              >
                Add Receipt
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          Add Repayment
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
  },
  boldLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  paidText: {
    color: '#4CAF50',
  },
  balanceText: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  input: {
    marginBottom: 16,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateButton: {
    marginTop: 8,
  },
  attachmentSection: {
    marginTop: 8,
  },
  attachmentLabel: {
    marginBottom: 8,
  },
  attachButton: {
    marginTop: 8,
  },
  imagePreview: {
    marginTop: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  submitButton: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
