const express = require("express");
const router = express.Router();
const {
  createOffer,
  getOffers,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");
const auth = require("../middleware/auth");

router.post("/offers",auth, createOffer);        
router.get("/offers",auth, getOffers);    
router.put("/offers/:id",auth, updateOffer);  
router.delete("/offers/:id",auth, deleteOffer);  

module.exports = router;
