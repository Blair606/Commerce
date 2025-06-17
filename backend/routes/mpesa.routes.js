const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesa.controller');
const { authenticateToken } = require('../middleware/auth');

// M-Pesa callback endpoint
router.post('/callback', mpesaController.handleCallback);

// M-Pesa payment query endpoint
router.post('/query', authenticateToken, mpesaController.queryPayment);

module.exports = router; 