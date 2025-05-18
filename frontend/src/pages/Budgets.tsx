import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceDot
} from 'recharts';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Chip,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Define interfaces
interface BudgetItem {
  id: number;
  name: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery: string | null;
  unitCost: number;
  quantity: number;
  total: number;
  status: 'Ordered' | 'Received' | 'Cancelled';
  notes?: string;
}

const Budgets: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Add Item Modal State
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    supplier: '',
    unitCost: '',
    orderDate: '',
    quantity: '',
    expectedDelivery: '',
    notes: ''
  });
  const [addError, setAddError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setAddError(null);
    setNewItem({
      name: '',
      supplier: '',
      unitCost: '',
      orderDate: '',
      quantity: '',
      expectedDelivery: '',
      notes: ''
    });
    setAddOpen(true);
  };
  const handleCloseAdd = () => setAddOpen(false);
  const handleChangeAdd = (field: string, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmitAdd = () => {
    // Validate
    if (!newItem.name || !newItem.supplier || !newItem.unitCost || !newItem.orderDate || !newItem.quantity || !newItem.expectedDelivery) {
      setAddError('All fields except notes are required.');
      return;
    }
    // Add to local state (simulate DB)
    setBudgetData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: prev.items.length > 0 ? Math.max(...prev.items.map(i => i.id)) + 1 : 1,
          name: newItem.name,
          supplier: newItem.supplier,
          orderDate: newItem.orderDate,
          expectedDelivery: newItem.expectedDelivery,
          actualDelivery: null,
          unitCost: Number(newItem.unitCost),
          quantity: Number(newItem.quantity),
          total: Number(newItem.unitCost) * Number(newItem.quantity),
          status: 'Ordered',
          notes: newItem.notes
        }
      ],
      allocated: prev.allocated + Number(newItem.unitCost) * Number(newItem.quantity),
      remaining: prev.remaining - Number(newItem.unitCost) * Number(newItem.quantity)
    }));
    setAddOpen(false);
  };
  
  // Budget data
  const [budgetData, setBudgetData] = useState({
    totalBudget: 75000,
    allocated: 14400,
    remaining: 60600,
    items: [] as BudgetItem[]
  });

  useEffect(() => {
    // Simulate API call to fetch budget data
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setBudgetData({
            totalBudget: 75000,
            allocated: 14400,
            remaining: 60600,
            items: [
              {
                id: 1,
                name: 'Server Infrastructure',
                supplier: 'Cloud Services Inc.',
                orderDate: '2025-10-04',
                expectedDelivery: '2025-10-14',
                actualDelivery: '2025-10-13',
                unitCost: 5000,
                quantity: 1,
                total: 5000,
                status: 'Received',
                notes: 'Annual subscription'
              },
              {
                id: 2,
                name: 'Development Workstations',
                supplier: 'Tech Hardware Ltd.',
                orderDate: '2025-10-02',
                expectedDelivery: '2025-10-20',
                actualDelivery: null,
                unitCost: 1800,
                quantity: 3,
                total: 5400,
                status: 'Ordered'
              },
              {
                id: 3,
                name: 'Software Licenses',
                supplier: 'Software Solutions Co.',
                orderDate: '2025-09-28',
                expectedDelivery: '2025-10-05',
                actualDelivery: '2025-10-04',
                unitCost: 400,
                quantity: 10,
                total: 4000,
                status: 'Received',
                notes: 'Developer IDE licenses'
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to load budget data');
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleViewModeChange = (mode: 'list' | 'grid') => {
    setViewMode(mode);
  };

  // Filter budget items based on active filter, search query, and category
  const filteredItems = budgetData.items.filter(item => {
    // Filter by status
    if (activeFilter !== 'All' && item.status !== activeFilter) {
      return false;
    }
    // Filter by category
    if (activeCategory !== 'All' && item.supplier !== activeCategory) {
      return false;
    }
    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Prepare chart data: group by expectedDelivery date, sum totals (if multiple items have same date)
  const chartDataMap: { [date: string]: { date: string; total: number; items: BudgetItem[] } } = {};
  budgetData.items.forEach(item => {
    const date = item.expectedDelivery;
    if (!chartDataMap[date]) {
      chartDataMap[date] = { date, total: 0, items: [] };
    }
    chartDataMap[date].total += item.total;
    chartDataMap[date].items.push(item);
  });
  const chartData = Object.values(chartDataMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Find peaks (simple: any date with total > 80% of max)
  const maxTotal = Math.max(...chartData.map(d => d.total), 0);
  const peakThreshold = maxTotal * 0.8;

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>Budget</Typography>

        {/* Budget Timeline Chart */}
        <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>Upcoming Budget Timeline</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                label={{ value: 'Expected Delivery', position: 'insideBottom', offset: -4 }}
              />
              <YAxis
                label={{ value: 'Total ($)', angle: -90, position: 'insideLeft', offset: 8 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    // Type assertion for Recharts payload
                    const d = payload[0].payload as { date: string; total: number; items: BudgetItem[] };
                    return (
                      <Paper sx={{ p: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                        {d.items.map((item: BudgetItem) => (
                          <Box key={item.id} mb={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${item.total.toLocaleString()} • Qty: {item.quantity}
                            </Typography>
                          </Box>
                        ))}
                        <Divider sx={{ my: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Total: ${d.total.toLocaleString()}</Typography>
                      </Paper>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="total" fill="#1976d2">
                {/* Highlight peaks */}
                {chartData.map((entry, idx) => (
                  <ReferenceDot
                    key={entry.date}
                    x={entry.date}
                    y={entry.total}
                    r={entry.total >= peakThreshold ? 10 : 0}
                    fill="#ff9800"
                    stroke="#fff"
                    ifOverflow="visible"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Peaks (orange dots) indicate high budget outflows—consider rescheduling to smooth cash flow.
          </Typography>
        </Paper>
        {/* Budget Overview */}
        <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <CardHeader title="Budget Overview" />
          <CardContent>
            {/* Wrap all content in a single parent Box */}
            <Box>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box width="100%">
                    <Box display="flex" mb={0.5}>
                      <Box width="19%" bgcolor="#1976d2" height={20} borderRadius="4px 0 0 4px" />
                      <Box width="81%" bgcolor="#e3f2fd" height={20} borderRadius="0 4px 4px 0" />
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, bgcolor: '#1976d2', mr: 1, borderRadius: 1 }} />
                        Allocated: ${budgetData.allocated.toLocaleString()} ({Math.round((budgetData.allocated / budgetData.totalBudget) * 100)}%)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, bgcolor: '#e3f2fd', mr: 1, borderRadius: 1 }} />
                        Remaining: ${budgetData.remaining.toLocaleString()} ({Math.round((budgetData.remaining / budgetData.totalBudget) * 100)}%)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Search, Filters, View Mode, and List all wrapped in a single Box */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Button
    variant="contained"
    color="primary"
    startIcon={<AddIcon />}
    onClick={handleOpenAdd}
    sx={{ mr: 2 }}
  >
    Add Item
  </Button>
  <TextField
    select
    label="Category"
    value={activeCategory}
    onChange={e => setActiveCategory(e.target.value)}
    size="small"
    sx={{ width: 150, mr: 2 }}
  >
    <MenuItem value="All">All</MenuItem>
    {Array.from(new Set(budgetData.items.map(item => item.supplier))).map(supplier => (
      <MenuItem key={supplier} value={supplier}>{supplier}</MenuItem>
    ))}
  </TextField>
                  <TextField
                    placeholder="Search budget items..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 250 }}
                  />
                  <Box display="flex" alignItems="center">
                    <Box mr={2}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewModeChange('list')}
                        color={viewMode === 'list' ? 'primary' : 'default'}
                      >
                        <ViewListIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewModeChange('grid')}
                        color={viewMode === 'grid' ? 'primary' : 'default'}
                      >
                        <ViewModuleIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                {/* Budget Items List */}
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {filteredItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
                        <Box width="100%">
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" component="div">
                              {item.name}
                              <Chip 
                                label={item.status} 
                                size="small" 
                                color={
                                  item.status === 'Received' ? 'success' : 
                                  item.status === 'Ordered' ? 'primary' : 'default'
                                }
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${item.total.toLocaleString()}
                            </Typography>
                          </Box>
                          <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Supplier:
                              </Typography>
                              <Typography variant="body2">
                                {item.supplier}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Order Date:
                              </Typography>
                              <Typography variant="body2">
                                {new Date(item.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Expected Delivery:
                              </Typography>
                              <Typography variant="body2">
                                {new Date(item.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Actual Delivery:
                              </Typography>
                              <Typography variant="body2">
                                {item.actualDelivery ? new Date(item.actualDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Unit Cost:
                              </Typography>
                              <Typography variant="body2">
                                ${item.unitCost.toLocaleString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Quantity:
                              </Typography>
                              <Typography variant="body2">
                                {item.quantity}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Notes:
                              </Typography>
                              <Typography variant="body2">
                                {item.notes || '-'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </ListItem>
                      {index < filteredItems.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                  {filteredItems.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No budget items found" />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modal (Dialog) */}
      <Dialog
        open={addOpen}
        onClose={handleCloseAdd}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Budget Item</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Title"
              value={newItem.name}
              onChange={e => handleChangeAdd('name', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Supplier"
              value={newItem.supplier}
              onChange={e => handleChangeAdd('supplier', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Unit Cost"
              type="number"
              value={newItem.unitCost}
              onChange={e => handleChangeAdd('unitCost', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Order Date"
              type="date"
              value={newItem.orderDate}
              onChange={e => handleChangeAdd('orderDate', e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={newItem.quantity}
              onChange={e => handleChangeAdd('quantity', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Expected Delivery Date"
              type="date"
              value={newItem.expectedDelivery}
              onChange={e => handleChangeAdd('expectedDelivery', e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              value={newItem.notes}
              onChange={e => handleChangeAdd('notes', e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            {addError && <Typography color="error">{addError}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button onClick={handleSubmitAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};
export default Budgets;
