const express = require('express');
const router = express.Router();
const {createCareeers, updateCareers, deleteCareers,getCareers,updateCareersstatus} = require("../controllers/careeersController");
const authMiddleware = require('../middleware/auth');

router.post("/careers",authMiddleware, createCareeers);
router.put("/careers/:id",authMiddleware, updateCareers);
router.delete("/careers/:id",authMiddleware, deleteCareers);
router.get("/careersget",authMiddleware, getCareers);
router.put("/careersstatus/:id/status",authMiddleware,updateCareersstatus);

module.exports = router;