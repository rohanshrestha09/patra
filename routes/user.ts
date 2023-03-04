import { Router } from "express";
const {
  register,
  login,
  users,
  setAvatar,
  user,
  deleteUser,
} = require("../controller/user");

const auth = require("../middleware/auth");

const router = Router();

router.post("/signup", register);

router.post("/login", login);

router.use(auth);

router.get("/user", users);

router.get("/user/:user", user);

router.put("/avatar", setAvatar);

router.delete("/delete/:user", deleteUser);

module.exports = router;
