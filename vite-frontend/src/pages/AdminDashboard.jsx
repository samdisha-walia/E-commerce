import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Stack,
} from '@mui/material';
import axios from 'axios';

const formatCurrency = (value = 0) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', isActive: true });
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    categoryId: '',
    image: '',
    quantity: '',
    productId: '',
  });
  const [feedback, setFeedback] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
    return base || 'http://localhost:5000';
  }, []);

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const [catRes, prodRes, orderRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/admin/categories`, axiosConfig),
        axios.get(`${apiBaseUrl}/api/admin/products`, axiosConfig),
        axios.get(`${apiBaseUrl}/api/admin/orders`, axiosConfig),
      ]);
      setCategories(catRes.data.categories || []);
      setProducts(prodRes.data.products || []);
      setOrders(orderRes.data.orders || []);
    } catch (error) {
      console.error('Failed to load admin data', error);
      setFeedback(error.response?.data?.message || 'Failed to load data');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/admin/orders/${orderId}`,
        { paymentStatus: newStatus },
        axiosConfig
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: newStatus } : order
        )
      );
      setFeedback('Order status updated.');
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Failed to update order status');
    }
  };

  useEffect(() => {
    if (!token) {
      setFeedback('Please log in as admin to access this page.');
      return;
    }
    fetchData();
  }, [apiBaseUrl, token]);

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${apiBaseUrl}/api/admin/categories/${editingCategory.id}`, categoryForm, axiosConfig);
        setFeedback('Category updated successfully.');
      } else {
        await axios.post(`${apiBaseUrl}/api/admin/categories`, categoryForm, axiosConfig);
        setFeedback('Category created successfully.');
      }
      setCategoryForm({ name: '', slug: '', description: '', isActive: true });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Failed to create category');
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive,
    });
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/admin/categories/${id}`, axiosConfig);
      setFeedback('Category deleted successfully.');
      if (editingCategory?.id === id) {
        setEditingCategory(null);
        setCategoryForm({ name: '', slug: '', description: '', isActive: true });
      }
      fetchData();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity) || 0,
      };
      if (editingProduct) {
        await axios.put(`${apiBaseUrl}/api/admin/products/${editingProduct.id}`, payload, axiosConfig);
        setFeedback('Product updated successfully.');
      } else {
        await axios.post(`${apiBaseUrl}/api/admin/products`, payload, axiosConfig);
        setFeedback('Product created successfully.');
      }
      setProductForm({
        name: '',
        price: '',
        categoryId: '',
        image: '',
        quantity: '',
        productId: '',
      });
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      categoryId: product.category?._id || product.category?.id || product.category,
      image: product.image || '',
      quantity: product.quantity ?? '',
      productId: product.productId,
    });
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/admin/products/${id}`, axiosConfig);
      setFeedback('Product deleted successfully.');
      if (editingProduct?.id === id) {
        setEditingProduct(null);
        setProductForm({
          name: '',
          price: '',
          categoryId: '',
          image: '',
          quantity: '',
          productId: '',
        });
      }
      fetchData();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const activeCategories = categories.filter((category) => category.isActive).length;
  const pendingOrders = orders.filter((order) => (order.paymentStatus || 'Pending') === 'Pending').length;

  const statCards = [
    {
      label: 'Categories',
      value: categories.length,
      helper: `${activeCategories} active`,
    },
    {
      label: 'Products',
      value: products.length,
      helper: `${products.reduce((sum, product) => sum + Number(product.quantity || 0), 0)} units in stock`,
    },
    {
      label: 'Orders',
      value: orders.length,
      helper: `${pendingOrders} pending`,
    },
    {
      label: 'Revenue',
      value: formatCurrency(totalRevenue),
      helper: 'All-time gross',
    },
  ];

  const sectionPaperSx = {
    p: 3,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
    border: '1px solid rgba(15,23,42,0.05)',
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f6fb', py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" fontWeight={700} color="#0f172a">
            Admin Command Center
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Keep your catalog, categories, and orders in sync with the storefront experience.
          </Typography>
        </Box>
        {feedback && (
          <Typography textAlign="center" color="text.secondary" mb={3}>
            {feedback}
          </Typography>
        )}

        <Grid container spacing={3} mb={4}>
          {statCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.label}>
              <Paper sx={{ ...sectionPaperSx, p: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.helper}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Categories */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={sectionPaperSx}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Typography>
              <Box component="form" onSubmit={handleCategorySubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <TextField
                  label="Slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
                <TextField
                  label="Description"
                  multiline
                  minRows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Active"
                />
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained">
                    {editingCategory ? 'Update' : 'Save'}
                  </Button>
                  {editingCategory && (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({ name: '', slug: '', description: '', isActive: true });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ ...sectionPaperSx, maxHeight: 320, overflowY: 'auto' }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Categories
              </Typography>
              {categories.length === 0 ? (
                <Typography color="text.secondary">No categories yet.</Typography>
              ) : (
                <Stack spacing={2}>
                  {categories.map((category) => (
                    <Box key={category.id} sx={{ p: 2, borderRadius: 2, bgcolor: '#f9fafb' }}>
                      <Typography fontWeight={600}>{category.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Slug: {category.slug}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description || 'No description'}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          label={category.isActive ? 'Active' : 'Inactive'}
                          color={category.isActive ? 'success' : 'default'}
                          size="small"
                        />
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleCategoryEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="text"
                          onClick={() => handleCategoryDelete(category.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Products */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={sectionPaperSx}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </Typography>
              <Box component="form" onSubmit={handleProductSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <TextField
                  label="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={productForm.quantity}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, quantity: e.target.value }))}
                />
                <TextField
                  label="Image URL"
                  value={productForm.image}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                />
                <TextField
                  label="Product ID"
                  value={productForm.productId}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, productId: e.target.value }))}
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={productForm.categoryId}
                    label="Category"
                    onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained">
                    {editingProduct ? 'Update' : 'Save'}
                  </Button>
                  {editingProduct && (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          name: '',
                          price: '',
                          categoryId: '',
                          image: '',
                          quantity: '',
                          productId: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ ...sectionPaperSx, maxHeight: 340, overflowY: 'auto' }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Products
              </Typography>
              {products.length === 0 ? (
                <Typography color="text.secondary">No products yet.</Typography>
              ) : (
                <Stack spacing={2}>
                  {products.map((product) => (
                    <Box key={product.id} sx={{ p: 2, borderRadius: 2, bgcolor: '#f9fafb' }}>
                      <Typography fontWeight={600}>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.category?.name || 'Uncategorized'} • {formatCurrency(product.price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Qty: {product.quantity} • Product ID: {product.productId}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleProductEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="text"
                          onClick={() => handleProductDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Orders (read-only) */}
        <Paper elevation={0} sx={{ ...sectionPaperSx, p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Orders
          </Typography>
          {orders.length === 0 ? (
            <Typography color="text.secondary">No orders yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {orders.map((order) => (
                <Grid item xs={12} md={6} key={order._id}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f9fafb' }}>
                    <Typography fontWeight={600}>Order #{order._id.slice(-6)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: {formatCurrency(order.totalAmount)} • {new Date(order.createdAt).toLocaleString('en-IN')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Items: {order.items.length}
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id={`status-${order._id}`}>Status</InputLabel>
                        <Select
                          labelId={`status-${order._id}`}
                          value={order.paymentStatus || 'Pending'}
                          label="Status"
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Paid">Paid</MenuItem>
                          <MenuItem value="Failed">Failed</MenuItem>
                          <MenuItem value="Refunded">Refunded</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      {order.items.slice(0, 3).map((item, idx) => (
                        <Typography key={idx} variant="body2" color="text.secondary">
                          - {item.name} × {item.quantity}
                        </Typography>
                      ))}
                      {order.items.length > 3 && (
                        <Typography variant="body2" color="text.secondary">
                          + {order.items.length - 3} more
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
