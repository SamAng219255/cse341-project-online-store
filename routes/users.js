const router = require("express").Router();
const usersController = require("../controllers/users");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, usersController.getAllUsers);
router.get("/:id", requireAuth, usersController.getSingleUser);
router.put("/:id", requireAuth, usersController.updateUser);
router.delete("/:id", requireAuth, usersController.deleteUser);

module.exports = router;
