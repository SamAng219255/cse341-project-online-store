
const router = require('express').Router();
const ordersController = require('../controllers/orders');

//const { isAuthenticated } = require('../middleware/authenticate');
//const { validate } = require('../middleware/validate');

//router.get("/{id}", controller.getExample);
router.get('/',usersController.getAllUsers);
router.get('/:id', usersController.getSingleUser);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

/*router.get('/',validate, usersController.getAllUsers);
router.get('/:id',validate, usersController.getSingleUser);
router.post('/', isAuthenticated, validate, usersController.createUser);
router.put('/:id', isAuthenticated, validate, usersController.updateUser);
router.delete('/:id', isAuthenticated, validate, usersController.deleteUser);
*/
module.exports = router;
