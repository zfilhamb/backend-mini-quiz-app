const express = require("express");
const router = express.Router();
const questionRouter = require("./questions.js");
const userRouter = require("./user.js");
const choiceRouter = require("./choices.js");
const answerRouter = require("./answers.js");
const scoreRouter = require("./scores.js");

router.use("/questions", questionRouter);
router.use("/scores", scoreRouter);
router.use("/answers", answerRouter);
router.use("/users", userRouter);
router.use("/choices", choiceRouter);

module.exports = router;