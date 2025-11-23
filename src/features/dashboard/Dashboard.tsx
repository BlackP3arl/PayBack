import { useMemo, useState } from 'react';
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
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useLoanStore } from '../../stores/loanStore';
import { formatMVR } from '../../utils/currency';
import type { Loan } from '../../types/loan';

const Dashboard = () => {
  const loans = useLoanStore((state) => state.loans);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBorrowers, setExpandedBorrowers] = useState<Record<string, boolean>>({});

  const totalOutstanding = loans.reduce((sum, loan) => sum + (loan.amount - loan.totalRepaid), 0);
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.totalRepaid, 0);

  const filteredLoans = loans.filter(
    (loan) =>
      loan.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.contactPhone?.includes(searchTerm)
  );

  const borrowerGroups = useMemo(() => {
    const borrowerMap = filteredLoans.reduce<
      Map<
        string,
        {
          key: string;
          name: string;
          phone?: string;
          loans: Loan[];
          loansCount: number;
          totalOutstanding: number;
          totalLoaned: number;
        }
      >
    >((map, loan) => {
      const key = loan.contactName.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: loan.contactName,
          phone: loan.contactPhone,
          loans: [],
          loansCount: 0,
          totalOutstanding: 0,
          totalLoaned: 0,
        });
      }

      const borrower = map.get(key)!;
      borrower.loans.push(loan);
      borrower.loansCount += 1;
      borrower.totalLoaned += loan.amount;
      borrower.totalOutstanding += loan.amount - loan.totalRepaid;

      return map;
    }, new Map());

    return Array.from(borrowerMap.values());
  }, [filteredLoans]);

  const toggleBorrower = (key: string) => {
    setExpandedBorrowers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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

        {/* Add Loan Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/loans/new"
          fullWidth
          sx={{ mb: 3 }}
        >
          Add Loan
        </Button>

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
            {borrowerGroups.map((borrower) => (
              <Card key={borrower.key} sx={{ mb: 2 }}>
                <ListItemButton onClick={() => toggleBorrower(borrower.key)}>
                  <ListItemText
                    primary={borrower.name}
                    secondary={`${borrower.loansCount} ${
                      borrower.loansCount > 1 ? 'loans' : 'loan'
                    } • ${formatMVR(borrower.totalOutstanding)} outstanding`}
                  />
                  {expandedBorrowers[borrower.key] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={!!expandedBorrowers[borrower.key]} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {borrower.loans.map((loan) => (
                      <ListItemButton
                        key={loan.id}
                        component={RouterLink}
                        to={`/loans/${loan.id}`}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText
                          primary={`${formatMVR(loan.amount)} loaned`}
                          secondary={`${formatMVR(loan.amount - loan.totalRepaid)} outstanding`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
