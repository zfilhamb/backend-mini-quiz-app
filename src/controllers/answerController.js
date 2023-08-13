const { Answer } = require('../../models')


class AnswerController {
    static findAnswer = async (req, res, next) => {
        try {
            const data = await Answer.findAll();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static findAnswerById = async (req, res, next) => {
        try{
            const {id} = req.params;
            const data = await Answer.findOne({where: {id: +id}})
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static createAnswer = async (req, res, next) => {
        try {
            const { choice_id, question_id} = req.body;
            const data = await Answer.create({
                user_id: +req.loggedUser.id,
                choice_id: +choice_id,
                question_id: +question_id,
            });
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static updateAnswer = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { Answer_text, is_correct, question_id} = req.body;
            const Answer = await Answer.update(
                {
                    Answer_text,
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

    static deleteAnswer = async (req, res, next) => {
        try {
            const { id } = req.params;
            const findAnswer = await Answer.findOne({ where: { id: +id } });

            if (findAnswer) {
                const answer = await Answer.destroy({
                    where: { id: +id }
                });
                if (answer) {
                    res.status(200).json({
                        message: "Answer deleted successfully"
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

module.exports = AnswerController;
