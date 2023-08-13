const express = require('express');
const router = express.Router();
const ChoiceController = require('../controllers/choiceController.js');


router.get("/", ChoiceController.findChoice)
router.get("/:id", ChoiceController.findChoiceById)
router.post("/", ChoiceController.createChoice)
router.put("/:id", ChoiceController.updateChoice) 
router.delete("/:id", ChoiceController.deleteChoice)

module.exports = router;