import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ContactSelectorScreen } from '../screens/ContactSelectorScreen';
import { AddLoanScreen } from '../screens/AddLoanScreen';
import { LoanSummaryScreen } from '../screens/LoanSummaryScreen';
import { LoanDetailScreen } from '../screens/LoanDetailScreen';
import { AddRepaymentScreen } from '../screens/AddRepaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200EE',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'PayBack',
          }}
        />
        <Stack.Screen
          name="ContactSelector"
          component={ContactSelectorScreen}
          options={{
            title: 'Select Contact',
          }}
        />
        <Stack.Screen
          name="AddLoan"
          component={AddLoanScreen}
          options={{
            title: 'Add Loan',
          }}
        />
        <Stack.Screen
          name="LoanSummary"
          component={LoanSummaryScreen}
          options={{
            title: 'Loan Summary',
          }}
        />
        <Stack.Screen
          name="LoanDetail"
          component={LoanDetailScreen}
          options={{
            title: 'Loan Details',
          }}
        />
        <Stack.Screen
          name="AddRepayment"
          component={AddRepaymentScreen}
          options={{
            title: 'Add Repayment',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
