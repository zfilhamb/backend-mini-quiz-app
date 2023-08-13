const { Score, Choice, Question, Answer } = require('../../models')


class ScoreController {
    static findScore = async (req, res, next) => {
        try {
            const user_id = +req.loggedUser.id;
            const data = await Score.findAll({where: { user_id }});
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    };

    static findScoreById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await Score.findOne({ where: { id: +id } })
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    // static createScore = async (req, res, next) => {
    //     try {
    //         const { userAnswers } = req.body; // Anda perlu mengirimkan userId dan array userAnswers dari klien
    //         const userAnswerIds = userAnswers.map(userAnswer => userAnswer.id);

    //         const chosenCorrectAnswers = await Answer.findAll({
    //             attributes: ['id'],
    //             where: {
    //                 id: userAnswerIds,
    //             },
    //             include: {
    //                 model: Choice,
    //                 attributes: ['is_correct'],
    //             },
    //         });

    //         const totalScore = chosenCorrectAnswers.reduce((sum, userAnswer) => {
    //             return userAnswer.Choice.is_correct ? sum + 100 : sum;
    //         }, 0);

    //         const userScore = await Score.create({
    //             user_id: +req.loggedUser.id,
    //             score: totalScore,
    //         });

    //         res.status(200).json(userScore);
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    static createScore = async (req, res, next) => {
        try {
            const user_id = +req.loggedUser.id;
            
            const userAnswers = await Answer.findAll({
                where: {
                    user_id
                },
                include: {
                    model: Choice,
                    attributes: ['is_correct'],
                },
            });
            
            let totalScore = 0;
    
            // Menghitung total skor berdasarkan jawaban pengguna
            userAnswers.forEach(answer => {
                if (answer.Choice.is_correct) {
                    totalScore += answer.Choice.is_correct + 49;
                }
            });
            const findScore = await Score.findOne({ where: { user_id: user_id } });
            if(!findScore){
                const userScore = await Score.create({
                    user_id: user_id,
                    score: totalScore,
                });
    
                res.status(200).json(userScore);
            } else {
                throw ({name: "AlreadyExists"})
            }
        } catch (err) {
            next(err);
        }
    };

    static updateScore = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { Score_text, is_correct, question_id } = req.body;
            const Score = await Score.update(
                {
                    Score_text,
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

    static deleteScore = async (req, res, next) => {
        try {
            const { id } = req.params;
            const findScore = await Score.findOne({ where: { id: +id } });

            if (findScore) {
                const score = await Score.destroy({
                    where: { id: +id }
                });
                if (score) {
                    res.status(200).json({
                        message: "Score deleted successfully"
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

module.exports = ScoreController;
