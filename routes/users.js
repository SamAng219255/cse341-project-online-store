const router = require("express").Router();
const usersController = require("../controllers/users");
const { requireAuth, authorizeUserAccess } = require("../middleware/auth");

router.get("/", requireAuth, authorizeUserAccess, usersController.getAllUsers);
router.get("/:userId", requireAuth, authorizeUserAccess, usersController.getSingleUser);
router.post("/", usersController.createUser);
router.put("/:userId", requireAuth, authorizeUserAccess, usersController.updateUser);
router.delete("/:userId", requireAuth, authorizeUserAccess, usersController.deleteUser);

module.exports = router;
