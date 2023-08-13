const express = require('express')
const router = express.Router();
const ScoreController = require("../controllers/scoreController.js");
const { authentication } = require("../middlewares/auth.js");


router.get("/", authentication,ScoreController.findScore)
router.get("/:id", ScoreController.findScoreById)
router.post("/", authentication,ScoreController.createScore)
router.put("/:id", authentication, ScoreController.updateScore)
router.delete("/:id", authentication, ScoreController.deleteScore)


module.exports = router;