import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Platform,
  Linking,
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
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store';
import { RootStackParamList } from '../types';
import { isValidAmount, parseCurrencyInput, isImageFile, isPdfFile, getFileName } from '../utils/format';

type AddLoanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddLoan'>;
type AddLoanScreenRouteProp = RouteProp<RootStackParamList, 'AddLoan'>;

export const AddLoanScreen: React.FC = () => {
  const navigation = useNavigation<AddLoanScreenNavigationProp>();
  const route = useRoute<AddLoanScreenRouteProp>();
  const { contactId, contactName } = route.params;

  const { addLoan } = useStore();

  const [amount, setAmount] = useState('');
  const [dateIssued, setDateIssued] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [attachmentUri, setAttachmentUri] = useState<string | undefined>();
  const [showDateIssuedPicker, setShowDateIssuedPicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setAttachmentUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
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

    if (dueDate < dateIssued) {
      Alert.alert('Invalid Date', 'Due date cannot be before the issue date');
      return;
    }

    setIsSubmitting(true);

    try {
      await addLoan({
        contactId,
        amount: parsedAmount,
        dateIssued: dateIssued.toISOString(),
        dueDate: dueDate.toISOString(),
        notes: notes.trim() || undefined,
        attachmentUri,
      });

      Alert.alert('Success', 'Loan added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      console.error('Error adding loan:', error);
      Alert.alert('Error', 'Failed to add loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAttachmentOptions = () => {
    Alert.alert('Add Receipt/Document', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose Photo', onPress: pickImage },
      { text: 'Choose PDF', onPress: pickDocument },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openAttachment = async () => {
    if (attachmentUri) {
      try {
        await Linking.openURL(attachmentUri);
      } catch (error) {
        Alert.alert('Error', 'Could not open document');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            New Loan for {contactName}
          </Text>

          <TextInput
            label="Loan Amount (MVR)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="currency-usd" />}
          />

          <View style={styles.dateContainer}>
            <Text variant="labelLarge">Date Issued</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDateIssuedPicker(true)}
              style={styles.dateButton}
            >
              {dateIssued.toLocaleDateString()}
            </Button>
          </View>

          {showDateIssuedPicker && (
            <DateTimePicker
              value={dateIssued}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDateIssuedPicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDateIssued(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.dateContainer}>
            <Text variant="labelLarge">Due Date</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDueDatePicker(true)}
              style={styles.dateButton}
            >
              {dueDate.toLocaleDateString()}
            </Button>
          </View>

          {showDueDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              minimumDate={dateIssued}
              onChange={(event, selectedDate) => {
                setShowDueDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDueDate(selectedDate);
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
              Attach Receipt/Document (Optional)
            </Text>

            {attachmentUri ? (
              <View style={styles.attachmentPreview}>
                {isImageFile(attachmentUri) ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: attachmentUri }} style={styles.image} />
                    <IconButton
                      icon="close-circle"
                      size={24}
                      onPress={removeAttachment}
                      style={styles.removeButton}
                    />
                  </View>
                ) : isPdfFile(attachmentUri) ? (
                  <View style={styles.pdfPreview}>
                    <Card style={styles.pdfCard}>
                      <Card.Content style={styles.pdfContent}>
                        <IconButton
                          icon="file-pdf-box"
                          size={40}
                          iconColor="#B00020"
                        />
                        <View style={styles.pdfInfo}>
                          <Text variant="bodyMedium" style={styles.pdfName}>
                            {getFileName(attachmentUri)}
                          </Text>
                          <Button
                            mode="text"
                            onPress={openAttachment}
                            compact
                          >
                            View PDF
                          </Button>
                        </View>
                      </Card.Content>
                    </Card>
                    <IconButton
                      icon="close-circle"
                      size={24}
                      onPress={removeAttachment}
                      style={styles.removeButton}
                    />
                  </View>
                ) : null}
              </View>
            ) : (
              <Button
                mode="outlined"
                icon="attachment"
                onPress={showAttachmentOptions}
                style={styles.attachButton}
              >
                Add Receipt/Document
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
          Add Loan
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
    marginBottom: 24,
    fontWeight: 'bold',
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
  attachmentPreview: {
    marginTop: 8,
  },
  imagePreview: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  pdfPreview: {
    position: 'relative',
  },
  pdfCard: {
    backgroundColor: '#f8f8f8',
  },
  pdfContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pdfInfo: {
    flex: 1,
    marginLeft: 8,
  },
  pdfName: {
    fontWeight: '500',
    marginBottom: 4,
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
});
