const { Choice, Question } = require('../../models')


class ChoiceController {
    static findChoice = async (req, res, next) => {
        try {
            let {  question_id } = req.query;
          
            const queryFilter = {
              include: [
                {
                  model: Question,
                  where: question_id ? { id: question_id } : {},
                  attributes: [] // To exclude category attributes from the result
                }
              ]
            };
            const  data = await Choice.findAll(queryFilter);
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static findChoiceById = async (req, res, next) => {
        try{
            const {id} = req.params;
            const data = await Choice.findOne({where: {id: +id}})
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static createChoice = async (req, res, next) => {
        try {
            const { choice_text, is_correct, question_id} = req.body;
            const data = await Choice.create({
                choice_text,
                is_correct,
                question_id,
            });
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static updateChoice = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { choice_text, is_correct, question_id} = req.body;
            const choice = await Choice.update(
                {
                    choice_text,
                    is_correct,
                    question_id,
                },
                {
                    where: { id: +id },
                }
            );
            res.status(200).json({ message: "Title updated successfully" });
        } catch (err) {
            next(err);
        }
    };

    static deleteChoice = async (req, res, next) => {
        try {
            const { id } = req.params;
            const findChoice = await Choice.findOne({ where: { id: +id } });

            if (findChoice) {
                const choice = await Choice.destroy({
                    where: { id: +id }
                });
                if (choice) {
                    res.status(200).json({
                        message: "Choice deleted successfully"
                    });
                }
            } else {
                next({ name: "ErrorNotFound" });
            }
        } catch (err) {
            next(err);
        }
    };
}

module.exports = ChoiceController;
