import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const Admin = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Access denied. Admin privileges required.
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Analytics" />
          <Tab label="Users" />
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6">Total Users</Typography>
                    <Typography variant="h4">150</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCartIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6">Total Orders</Typography>
                    <Typography variant="h4">45</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="h6">Products</Typography>
                    <Typography variant="h4">89</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
                  <Box>
                    <Typography variant="h6">Revenue</Typography>
                    <Typography variant="h4">$12,450</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardHeader title="User Management" />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((user) => (
                  <TableRow key={user}>
                    <TableCell>User {user}</TableCell>
                    <TableCell>user{user}@example.com</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('approve', user)}>
                        <CheckIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog('reject', user)}>
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardHeader 
            title="Product Management"
            action={
              <Button 
                variant="contained" 
                onClick={() => handleOpenDialog('addProduct')}
              >
                Add Product
              </Button>
            }
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((product) => (
                  <TableRow key={product}>
                    <TableCell>Product {product}</TableCell>
                    <TableCell>${(product * 10).toFixed(2)}</TableCell>
                    <TableCell>Category {product}</TableCell>
                    <TableCell>{product * 5}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('editProduct', product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog('deleteProduct', product)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardHeader title="Order Management" />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((order) => (
                  <TableRow key={order}>
                    <TableCell>#{order}</TableCell>
                    <TableCell>Customer {order}</TableCell>
                    <TableCell>${(order * 100).toFixed(2)}</TableCell>
                    <TableCell>Processing</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleOpenDialog('updateOrder', order)}
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'approve' && 'Approve User'}
          {dialogType === 'reject' && 'Reject User'}
          {dialogType === 'addProduct' && 'Add Product'}
          {dialogType === 'editProduct' && 'Edit Product'}
          {dialogType === 'updateOrder' && 'Update Order Status'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'approve' && (
            <Typography>Are you sure you want to approve this user?</Typography>
          )}
          {dialogType === 'reject' && (
            <Typography>Are you sure you want to reject this user?</Typography>
          )}
          {(dialogType === 'addProduct' || dialogType === 'editProduct') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField label="Product Name" fullWidth />
              <TextField label="Price" type="number" fullWidth />
              <TextField label="Description" multiline rows={4} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                  <MenuItem value="category1">Category 1</MenuItem>
                  <MenuItem value="category2">Category 2</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Stock" type="number" fullWidth />
            </Box>
          )}
          {dialogType === 'updateOrder' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status">
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color={
              dialogType === 'approve' ? 'success' :
              dialogType === 'reject' ? 'error' :
              'primary'
            }
            onClick={handleCloseDialog}
          >
            {dialogType === 'approve' && 'Approve'}
            {dialogType === 'reject' && 'Reject'}
            {dialogType === 'addProduct' && 'Add'}
            {dialogType === 'editProduct' && 'Save'}
            {dialogType === 'updateOrder' && 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin; 