import express, { Router } from "express";
const router: Router = express.Router();
const { getMessage, addMessage } = require("../controller/message");
const auth = require("../middleware/auth");

router.use(auth);

router.post("/getmsg", getMessage);
router.post("/addmsg", addMessage);

module.exports = router;
