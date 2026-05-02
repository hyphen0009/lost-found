const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  submitClaim, 
  getClaimsForItem, 
  updateClaimStatus, 
  getMyClaims 
} = require('../controllers/claimController');

router.post('/', auth, submitClaim);
router.get('/my-claims', auth, getMyClaims);
router.get('/item/:itemId', auth, getClaimsForItem);
router.patch('/:claimId', auth, updateClaimStatus);

module.exports = router;
