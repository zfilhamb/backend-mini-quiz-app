const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");
const { authentication } = require("../middlewares/auth.js");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.delete("/delete/:id", authentication,UserController.deleteUser);
// router.get("/",authentication , UserController.getAllUsers);
// router.patch("/profile-user", authentication,UserController.updateUser);
router.get("/me",authentication, UserController.getUserLogin);
router.get("/finalscore",authentication, UserController.getFinalScore)

module.exports = router;