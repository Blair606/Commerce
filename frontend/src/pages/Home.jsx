import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Welcome to Our Store
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
          >
            Discover amazing products at great prices
          </Typography>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={4}>
          {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Box
                component={RouterLink}
                to={`/products?category=${category}`}
                sx={{
                  display: 'block',
                  p: 3,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="h6">{category}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={4}>
          {/* Product cards will be added here */}
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">
              Loading featured products...
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Shop?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Browse our complete collection of products and find exactly what you're looking for.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <RouterLink
              to="/products"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'inline-block',
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 4,
                  py: 2,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Shop Now
              </Typography>
            </RouterLink>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 