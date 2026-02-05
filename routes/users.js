
const router = require('express').Router();
const ordersController = require('../controllers/orders');

router.get('/',usersController.getAllUsers);
router.get('/:id', usersController.getSingleUser);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
