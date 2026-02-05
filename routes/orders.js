
const router = require('express').Router();
const ordersController = require('../controllers/orders');

//const { isAuthenticated } = require('../middleware/authenticate');
//const { validate } = require('../middleware/validate');

router.get("/{id}", controller.getExample);
router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getSingleOrder);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);

/*router.get('/',validate, ordersController.getAllOrders);
router.get('/:id',validate, ordersController.getSingleOrder);
router.post('/', isAuthenticated, validate, ordersController.createOrder);
router.put('/:id', isAuthenticated, validate, ordersController.updateOrder);
router.delete('/:id', isAuthenticated, validate, ordersController.deleteOrder);
*/
module.exports = router;
