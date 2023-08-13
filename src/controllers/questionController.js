const { Question, Choice } = require('../../models')
const fs = require('fs')


class QuestionController {
    static findQuestion = async (req, res, next) => {
        try {
            const data = await Question.findAll({
                include: {
                    model: Choice,
                },
            });

            res.status(200).json(data);
          } catch (err) {
            next(err);
          }
    };

    static findQuestionById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await Question.findOne({ where: { id: +id } })
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static createQuestion = async (req, res, next) => {
        try {
            const { question_text } = req.body;
            const data = await Question.create({
                question_text,
            });
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static updateQuestion = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, category_id } = req.body;
            let fileName = "";

            if (req.file === undefined) {
                const updatedQuestion = await Question.update(
                    {
                        title,
                        category_id,
                    },
                    {
                        where: { id: +id },
                    })
            } else {
                const image = req.file.path;
                fileName = `http://localhost:3001/${image}`;

                const post = await Question.findByPk(+id);
                if (post.image) {
                    const filePath = post.image.replace("http://localhost:3001/", "");
                    fs.unlinkSync(filePath);
                }
                const updatedQuestion = await Question.update(
                    {
                        title,
                        image: fileName,
                        category_id,
                    },
                    {
                        where: { id: +id },
                    })
            }
            res.status(200).json({ message: "Question updated successfully" });
        } catch (err) {
            next(err);
        }
    }

    static deleteQuestion = async (req, res, next) => {
        try {
            const { id } = req.params;
            const findtask = await Question.findOne({ where: { id: +id } });

            if (findtask) {
                const task = await Question.destroy({
                    where: { id: +id }
                });
                if (task) {
                    res.status(200).json({
                        message: "Question deleted successfully"
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

module.exports = QuestionController;