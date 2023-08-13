const express = require('express')
const router = express.Router();
const QuestionController = require("../controllers/questionController.js");
const { authentication } = require("../middlewares/auth.js");


router.get("/", QuestionController.findQuestion)
router.get("/:id", QuestionController.findQuestionById)
router.post("/", authentication,QuestionController.createQuestion)
router.put("/:id", authentication, QuestionController.updateQuestion)
router.delete("/:id", authentication, QuestionController.deleteQuestion)


module.exports = router;