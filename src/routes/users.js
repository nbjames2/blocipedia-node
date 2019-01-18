const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUp);
router.post("/users", validation.validateSignUp, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateSignIn, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/payment", userController.payment);
router.post("/users/:id/payed", userController.payed);
router.get("/users/:id/downgrade", userController.downgrade);

module.exports = router;