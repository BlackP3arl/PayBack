import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Dialog,
  TextField,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useLoanStore } from '../../stores/loanStore';
import { formatMVR } from '../../utils/currency';
import { formatISO } from 'date-fns';

const LoanDetail = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const loan = useLoanStore((state) => state.getLoan(loanId || ''));
  const deleteLoan = useLoanStore((state) => state.deleteLoan);
  const addRepayment = useLoanStore((state) => state.addRepayment);

  const [openRepaymentDialog, setOpenRepaymentDialog] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentNotes, setRepaymentNotes] = useState('');

  if (!loan) {
    return (
      <Container>
        <Typography variant="h6">Loan not found</Typography>
      </Container>
    );
  }

  const outstanding = loan.amount - loan.totalRepaid;

  const handleAddRepayment = () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const repayment = {
      id: `rep_${Date.now()}`,
      loanId: loan.id,
      amount: parseFloat(repaymentAmount),
      date: formatISO(new Date()),
      notes: repaymentNotes,
      createdAt: formatISO(new Date()),
    };

    addRepayment(loan.id, repayment);
    setRepaymentAmount('');
    setRepaymentNotes('');
    setOpenRepaymentDialog(false);
  };

  const handleDeleteLoan = () => {
    if (confirm('Are you sure you want to delete this loan?')) {
      deleteLoan(loan.id);
      navigate('/');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {loan.contactName}
          </Typography>
          <IconButton color="inherit" onClick={handleDeleteLoan}>
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
        {/* Loan Summary */}
        <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <CardContent>
            <Typography variant="body2">Outstanding Amount</Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
              {formatMVR(outstanding)}
            </Typography>
            <Typography variant="body2">
              Loan: {formatMVR(loan.amount)} | Repaid: {formatMVR(loan.totalRepaid)}
            </Typography>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Loan Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Loan Date
              </Typography>
              <Typography variant="body1">{new Date(loan.loanDate).toLocaleDateString()}</Typography>
            </Box>
            {loan.dueDate && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1">{new Date(loan.dueDate).toLocaleDateString()}</Typography>
              </Box>
            )}
            {loan.notes && (
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1">{loan.notes}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Repayments */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Repayments</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenRepaymentDialog(true)}
            >
              Add
            </Button>
          </Box>

          {loan.repayments && loan.repayments.length > 0 ? (
            <List>
              {loan.repayments.map((repayment) => (
                <Card key={repayment.id} sx={{ mb: 1 }}>
                  <ListItem>
                    <ListItemText
                      primary={formatMVR(repayment.amount)}
                      secondary={new Date(repayment.date).toLocaleDateString()}
                    />
                  </ListItem>
                </Card>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No repayments yet
            </Typography>
          )}
        </Box>
      </Container>

      {/* Add Repayment Dialog */}
      <Dialog open={openRepaymentDialog} onClose={() => setOpenRepaymentDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Add Repayment
          </Typography>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={repaymentAmount}
            onChange={(e) => setRepaymentAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={repaymentNotes}
            onChange={(e) => setRepaymentNotes(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button fullWidth onClick={() => setOpenRepaymentDialog(false)}>
              Cancel
            </Button>
            <Button fullWidth variant="contained" onClick={handleAddRepayment}>
              Save
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LoanDetail;
