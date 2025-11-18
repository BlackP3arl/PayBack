import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { formatISO } from 'date-fns';
import { useLoanStore } from '../../stores/loanStore';
import type { Loan } from '../../types/loan';

interface FormData {
  contactName: string;
  contactPhone: string;
  amount: number;
  loanDate: string;
  dueDate: string;
  notes: string;
}

const NewLoan = () => {
  const navigate = useNavigate();
  const addLoan = useLoanStore((state) => state.addLoan);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const loan: Loan = {
        id: `loan_${Date.now()}`,
        contactId: `contact_${Date.now()}`,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        amount: parseFloat(data.amount.toString()),
        currency: 'MVR',
        loanDate: data.loanDate,
        dueDate: data.dueDate || undefined,
        notes: data.notes,
        totalRepaid: 0,
        status: 'pending',
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
      };

      await addLoan(loan);

      navigate('/');
    } catch (error) {
      alert('Failed to create loan');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Add Loan</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth
                label="Contact Name"
                margin="normal"
                {...register('contactName', { required: 'Contact name is required' })}
                error={!!errors.contactName}
                helperText={errors.contactName?.message}
              />

              <TextField
                fullWidth
                label="Phone Number (Optional)"
                margin="normal"
                type="tel"
                {...register('contactPhone')}
              />

              <TextField
                fullWidth
                label="Amount"
                margin="normal"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0, message: 'Amount must be greater than 0' }
                })}
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />

              <TextField
                fullWidth
                label="Loan Date"
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('loanDate', { required: 'Loan date is required' })}
                error={!!errors.loanDate}
                helperText={errors.loanDate?.message}
              />

              <TextField
                fullWidth
                label="Due Date (Optional)"
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('dueDate')}
              />

              <TextField
                fullWidth
                label="Notes (Optional)"
                margin="normal"
                multiline
                rows={3}
                {...register('notes')}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{ mt: 3 }}
              >
                {isSubmitting ? 'Creating...' : 'Create Loan'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default NewLoan;
