import React from 'react';
import { View, ScrollView, StyleSheet, Image, Linking, Alert } from 'react-native';
import { Card, Text, FAB, Divider, Chip, List, Button, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../store';
import { RootStackParamList, Repayment } from '../types';
import { formatCurrency, formatDate, isOverdue, isImageFile, isPdfFile, getFileName } from '../utils/format';

type LoanDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoanDetail'>;
type LoanDetailRouteProp = RouteProp<RootStackParamList, 'LoanDetail'>;

export const LoanDetailScreen: React.FC = () => {
  const navigation = useNavigation<LoanDetailNavigationProp>();
  const route = useRoute<LoanDetailRouteProp>();
  const { loanId } = route.params;

  const { getLoanWithDetails } = useStore();

  const loan = getLoanWithDetails(loanId);

  if (!loan) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium">Loan not found</Text>
      </View>
    );
  }

  const overdue = isOverdue(loan.dueDate) && loan.balanceDue > 0;

  const openAttachment = async (uri: string) => {
    try {
      await Linking.openURL(uri);
    } catch (error) {
      Alert.alert('Error', 'Could not open document');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Loan Information Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Loan Information
            </Text>

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
              <Text variant="bodyLarge" style={[styles.value, styles.boldValue]}>
                {formatCurrency(loan.amount)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.label}>
                Date Issued:
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {formatDate(loan.dateIssued)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.label}>
                Due Date:
              </Text>
              <Text
                variant="bodyLarge"
                style={[styles.value, overdue && styles.overdueText]}
              >
                {formatDate(loan.dueDate)}
                {overdue && ' (Overdue)'}
              </Text>
            </View>

            {loan.notes && (
              <>
                <Divider style={styles.divider} />
                <Text variant="bodyLarge" style={styles.label}>
                  Notes:
                </Text>
                <Text variant="bodyMedium" style={styles.notesText}>
                  {loan.notes}
                </Text>
              </>
            )}

            {loan.attachmentUri && (
              <>
                <Divider style={styles.divider} />
                <Text variant="bodyLarge" style={styles.label}>
                  {isPdfFile(loan.attachmentUri) ? 'Document:' : 'Receipt:'}
                </Text>
                {isImageFile(loan.attachmentUri) ? (
                  <Image
                    source={{ uri: loan.attachmentUri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : isPdfFile(loan.attachmentUri) ? (
                  <Card style={styles.pdfCard}>
                    <Card.Content style={styles.pdfContent}>
                      <IconButton
                        icon="file-pdf-box"
                        size={40}
                        iconColor="#B00020"
                      />
                      <View style={styles.pdfInfo}>
                        <Text variant="bodyMedium" style={styles.pdfName}>
                          {getFileName(loan.attachmentUri)}
                        </Text>
                        <Button
                          mode="text"
                          onPress={() => openAttachment(loan.attachmentUri!)}
                          compact
                        >
                          View PDF
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                ) : null}
              </>
            )}
          </Card.Content>
        </Card>

        {/* Payment Summary Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Payment Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Total Paid:</Text>
              <Text variant="bodyLarge" style={styles.paidAmount}>
                {formatCurrency(loan.totalPaid)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text variant="bodyLarge" style={styles.boldLabel}>
                Balance Due:
              </Text>
              <Text
                variant="titleMedium"
                style={[
                  styles.balanceAmount,
                  loan.balanceDue === 0 && styles.paidText,
                  overdue && styles.overdueText,
                ]}
              >
                {formatCurrency(loan.balanceDue)}
              </Text>
            </View>

            <View style={styles.chipContainer}>
              {loan.balanceDue === 0 && (
                <Chip icon="check-circle" style={styles.paidChip}>
                  Fully Paid
                </Chip>
              )}
              {loan.balanceDue > 0 && loan.totalPaid > 0 && (
                <Chip icon="progress-check" style={styles.partialChip}>
                  Partially Paid
                </Chip>
              )}
              {overdue && (
                <Chip icon="alert" style={styles.overdueChip}>
                  Overdue
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Repayment History */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Repayment History ({loan.repayments.length})
            </Text>

            {loan.repayments.length === 0 ? (
              <Text variant="bodyMedium" style={styles.emptyText}>
                No repayments yet
              </Text>
            ) : (
              <View>
                {loan.repayments.map((repayment, index) => (
                  <View key={repayment.id}>
                    {index > 0 && <Divider style={styles.repaymentDivider} />}
                    <View style={styles.repaymentItem}>
                      <View style={styles.repaymentHeader}>
                        <Text variant="titleMedium">
                          {formatCurrency(repayment.amount)}
                        </Text>
                        <Text variant="bodyMedium" style={styles.repaymentDate}>
                          {formatDate(repayment.repaymentDate)}
                        </Text>
                      </View>

                      {repayment.notes && (
                        <Text variant="bodySmall" style={styles.repaymentNotes}>
                          {repayment.notes}
                        </Text>
                      )}

                      {repayment.attachmentUri && (
                        <>
                          {isImageFile(repayment.attachmentUri) ? (
                            <Image
                              source={{ uri: repayment.attachmentUri }}
                              style={styles.repaymentImage}
                              resizeMode="cover"
                            />
                          ) : isPdfFile(repayment.attachmentUri) ? (
                            <Card style={styles.repaymentPdfCard}>
                              <Card.Content style={styles.pdfContent}>
                                <IconButton
                                  icon="file-pdf-box"
                                  size={32}
                                  iconColor="#B00020"
                                />
                                <View style={styles.pdfInfo}>
                                  <Text variant="bodySmall" style={styles.pdfName}>
                                    {getFileName(repayment.attachmentUri)}
                                  </Text>
                                  <Button
                                    mode="text"
                                    onPress={() => openAttachment(repayment.attachmentUri!)}
                                    compact
                                  >
                                    View PDF
                                  </Button>
                                </View>
                              </Card.Content>
                            </Card>
                          ) : null}
                        </>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {loan.balanceDue > 0 && (
        <FAB
          icon="cash-plus"
          style={styles.fab}
          onPress={() =>
            navigation.navigate('AddRepayment', {
              loanId: loan.id,
              contactId: loan.contactId,
            })
          }
          label="Add Repayment"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#666',
  },
  value: {
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  boldValue: {
    fontWeight: 'bold',
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  notesText: {
    marginTop: 8,
    color: '#444',
  },
  divider: {
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  pdfCard: {
    backgroundColor: '#f8f8f8',
    marginTop: 8,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paidAmount: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  balanceAmount: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  paidText: {
    color: '#4CAF50',
  },
  overdueText: {
    color: '#B00020',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  paidChip: {
    backgroundColor: '#E8F5E9',
  },
  partialChip: {
    backgroundColor: '#FFF3E0',
  },
  overdueChip: {
    backgroundColor: '#FFEBEE',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  repaymentItem: {
    paddingVertical: 12,
  },
  repaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repaymentDate: {
    color: '#666',
  },
  repaymentNotes: {
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  repaymentImage: {
    width: '100%',
    height: 150,
    marginTop: 8,
    borderRadius: 8,
  },
  repaymentPdfCard: {
    backgroundColor: '#f8f8f8',
    marginTop: 8,
  },
  repaymentDivider: {
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
