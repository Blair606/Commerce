import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseNavMenu();
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo for larger screens */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              E-COMMERCE
            </Typography>

            {/* Mobile menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/products">
                  <Typography textAlign="center">Products</Typography>
                </MenuItem>
                {isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/profile">
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/login">
                      <Typography textAlign="center">Login</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/register">
                      <Typography textAlign="center">Register</Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>

            {/* Logo for mobile screens */}
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              E-COMMERCE
            </Typography>

            {/* Desktop menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                component={RouterLink}
                to="/products"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Products
              </Button>
            </Box>

            {/* Cart and Auth buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={RouterLink}
                to="/cart"
                size="large"
                color="inherit"
              >
                <Badge badgeContent={0} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Button
                      component={RouterLink}
                      to="/admin"
                      sx={{ color: 'white', ml: 2 }}
                    >
                      Admin
                    </Button>
                  )}
                  <Button
                    onClick={handleLogout}
                    sx={{ color: 'white', ml: 2 }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ color: 'white', ml: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    sx={{ color: 'white', ml: 2 }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Navbar; 