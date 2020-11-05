const express = require('express');
const userController = require('../controllers/user');
const userAuth = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/register',userController.registerUser);
router.get('/',userController.getUsers);
router.post('/login',userController.loginUsers);
router.delete('/:id',userAuth.protect,userController.deleteUser);
router.get('/profile',userAuth.protect,userController.getUserProfile);
module.exports = router;