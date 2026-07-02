const express = require('express');
const { createOrder, getMyOrders, getFarmerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorize('buyer'), createOrder);
router.get('/myorders', protect, authorize('buyer'), getMyOrders);
router.get('/farmerorders', protect, authorize('farmer'), getFarmerOrders);

module.exports = router;
