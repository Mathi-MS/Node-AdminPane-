const express = require("express");
const router = express.Router();
const {
  createOffer,
  getOffers,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

router.post("/offers", createOffer);        
router.get("/offers", getOffers);    
router.put("/offers/:id", updateOffer);  
router.delete("/offers/:id", deleteOffer);  

module.exports = router;
