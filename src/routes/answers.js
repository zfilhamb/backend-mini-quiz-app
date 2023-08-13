const express = require('express')
const router = express.Router();
const AnswerController = require("../controllers/answerController.js");
const { authentication } = require("../middlewares/auth.js");


router.get("/", AnswerController.findAnswer)
router.get("/:id", AnswerController.findAnswerById)
router.post("/", authentication,AnswerController.createAnswer)
router.put("/:id", authentication, AnswerController.updateAnswer)
router.delete("/:id", authentication, AnswerController.deleteAnswer)


module.exports = router;