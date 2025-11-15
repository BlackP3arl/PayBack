import { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useLoanStore } from '../../stores/loanStore';
import { formatMVR } from '../../utils/currency';

const Dashboard = () => {
  const loans = useLoanStore((state) => state.loans);
  const [searchTerm, setSearchTerm] = useState('');

  const totalOutstanding = loans.reduce((sum, loan) => sum + (loan.amount - loan.totalRepaid), 0);
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.totalRepaid, 0);

  const filteredLoans = loans.filter(
    (loan) =>
      loan.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.contactPhone?.includes(searchTerm)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">PayBack</Typography>
          <Button color="inherit" startIcon={<SettingsIcon />}>
            Settings
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" variant="body2">
                Total Outstanding
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {formatMVR(totalOutstanding)}
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Total Loaned
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {formatMVR(totalLoaned)}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography color="textSecondary" variant="body2">
                  Total Repaid
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {formatMVR(totalRepaid)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Loans List */}
        {filteredLoans.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              No loans yet. Start by adding your first loan.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/loans/new">
              Add Loan
            </Button>
          </Box>
        ) : (
          <List>
            {filteredLoans.map((loan) => (
              <Card key={loan.id} sx={{ mb: 2 }}>
                <ListItemButton component={RouterLink} to={`/loans/${loan.id}`}>
                  <ListItemText
                    primary={loan.contactName}
                    secondary={`${formatMVR(loan.amount - loan.totalRepaid)} outstanding`}
                  />
                </ListItemButton>
              </Card>
            ))}
          </List>
        )}
      </Container>

      {/* Floating Action Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/loans/new"
          sx={{ borderRadius: '50px' }}
        >
          Add Loan
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
