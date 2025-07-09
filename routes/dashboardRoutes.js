const express = require('express');
const router = express.Router();
const { getDashboardCounts } = require('../controllers/dashboardController');
const auth = require('../middleware/auth'); // if you want it protected

router.get('/dashboard-counts', auth, getDashboardCounts);

module.exports = router;
