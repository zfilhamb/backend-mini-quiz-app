const { User, Answer, Choice, Score } = require('../../models')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

class UserController {
    static registerUser = async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = await User.create({
                name,
                email,
                password: hashedPassword,
            });
            res
                .status(200)
                .json(data);
        } catch (err) {
            next({ name: "EmailAlreadyExists" });
        }
    };

    static loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next({ name: "WrongPassword" });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return next({ name: "WrongPassword" });
            }
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET
            );
            return res
                .status(200)
                .json({ token, email, name: user.name, id: user.id });
        } catch (err) {
            res.status(401).json({ message: "Invalid credentials" });
        }
    };

    static deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const findUser = await User.findOne({ where: { id: +id } });
            if (findUser) {
                const user = await User.destroy({
                    where: { id: +id },
                });
                if (user) {
                    res.status(200).json({
                        message: "User deleted successfully",
                    });
                }
            } else {
                next({ name: "ErrorNotFound" });
            }
        } catch (err) {
            res.status(400).json({ message: "Failed Delete User" });
        }
    };

    static getUserLogin = async (req, res, next) => {
        try {
            const { id } = req.loggedUser;
            const user = await User.findOne({
                where: { id: +id },
                include: {
                    model: Score, // Asumsi bahwa Answer terhubung dengan Choice
                    attributes: ['user_id',] // Asumsi bahwa Choice memiliki kolom 'is_correct' dan 'score'
                }
            });
            if (user) {
                res.status(200).json(user);
            } else {
                next({ name: "ErrorNotFound" });
            }
        } catch (err) {
            next(err);
        }
    };

    static getFinalScore = async (req, res, next) => {
        try {
            const user_id = +req.loggedUser.id;
        
            // Ambil semua jawaban pengguna dari basis data
            const userAnswers = await Answer.findAll({
                where: { user_id },
                include: {
                    model: Choice, // Asumsi bahwa Answer terhubung dengan Choice
                    attributes: ['is_correct',] // Asumsi bahwa Choice memiliki kolom 'is_correct' dan 'score'
                }
            });
            
            let totalScore = 0;
    
            // Menghitung total skor berdasarkan jawaban pengguna
            userAnswers.forEach(answer => {
                if (answer.Choice.is_correct) {
                    totalScore += answer.Choice.is_correct + 49;
                }
            });
    
            res.status(200).json({ totalScore });
        } catch (err) {
            next(err);
        }
    };

    //   static getAllUsers = async (req, res, next) => {
    //     try {
    //       const users = await prisma.users.findMany();
    //       res
    //         .status(200)
    //         .json({ message: "Users retrieved successfully", data: users });
    //     } catch (err) {
    //       next(err);
    //     }
    //   };

    //   static ChangePassword = async (req, res, next) => {
    //     try {
    //       const { userId, oldPassword, newPassword } = req.body;

    //       // Get the user from the database
    //       const user = await prisma.users.findUnique({ where: { id: userId } });

    //       // Check if the user exists
    //       if (!user) {
    //         return res.status(404).json({ message: "User not found" });
    //       }

    //       // Compare the old password with the hashed password stored in the database
    //       const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    //       if (!isPasswordValid) {
    //         return res.status(401).json({ message: "Invalid password" });
    //       }

    //       // Hash the new password
    //       const hashedPassword = await bcrypt.hash(newPassword, 10);

    //       // Update the user's password in the database
    //       const updatedUser = await prisma.users.update({
    //         where: { id: userId },
    //         data: { password: hashedPassword },
    //       });

    //       res
    //         .status(200)
    //         .json({ message: "Password changed successfully", data: updatedUser });
    //     } catch (err) {
    //       next(err);
    //     }
    //   };

    //   static changePassword = async (req, res, next) => {
    //     try {
    //       const { id } = req.params;
    //       const { password } = req.body;
    //       const hashedPassword = await bcrypt.hash(password, 10);
    //       const user = await prisma.users.update({
    //         where: { id: +id },
    //         data: {
    //           password: hashedPassword,
    //         },
    //       });
    //       return res.status(200).json({ message: "Successfully Change Password" });
    //     } catch (err) {
    //       next(err);
    //       return res.status(400).json({ message: "Failed Change Password" });
    //     }
    //   };



    //   static updateUser = async (req, res, next) => {
    //     try {
    //       const { id } = req.loggedUser;
    //       const { name, biography } = req.body;
    //       let fileName = "";

    //       if (req.file === undefined) {
    //         const updatedUser = await prisma.users.update({
    //           where: { id: +id },
    //           data: {
    //             name: name,
    //             biography: biography,
    //           },
    //         });
    //       } else {
    //         const avatar = req.file.path;
    //         fileName = `http://localhost:3001/${avatar}`

    //         if (req.loggedUser.avatar) {
    //           const filePath = req.loggedUser.avatar.replace("http://localhost:3001/", "");
    //           fs.unlinkSync(filePath);
    //         }
    //         const updatedUser = await prisma.users.update({
    //           where: { id: +id },
    //           data: {
    //             name: name,
    //             biography: biography,
    //             avatar: fileName,
    //           },
    //         });
    //       }
    //       res.status(200).json({
    //         message: "Successfully Updated User",
    //       });
    //     } catch (err) {
    //       next(err);
    //     }
    //   };

}
module.exports = UserController;