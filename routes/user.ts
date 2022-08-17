import express, { Router } from "express";
const {
  register,
  login,
  getAllUsers,
  setAvatar,
  deleteUser,
  getSingleUser,
} = require("../controller/user");
const auth = require("../middleware/auth");

const router: Router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/users/:id", auth, getAllUsers);
router.get("/user/:id", auth, getSingleUser);
router.put("/setavatar/:id", auth, setAvatar);
router.delete("/delete/:id", auth, deleteUser);

module.exports = router;
