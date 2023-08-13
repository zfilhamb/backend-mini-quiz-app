const jwt = require("jsonwebtoken");
const  {User} = require('../../models')
require("dotenv").config();

async function authentication(req, res, next) {
	const { access_token } = req.headers;

	if (access_token) {
		try {
			const decode = jwt.verify(access_token, process.env.JWT_SECRET);
			const { id, email } = decode;
			const user = await User.findOne({ where: { id: +id } });
			if (!user) {
				next({ name: "ErrorNotFound" });
			} else {
				req.loggedUser = {
					id: user.id,
					email: user.email,
					role: user.role,
				};
				next();
			}
		} catch (err) {
            // console.log(err);
			next({ name: "JWTerror" });
		}
	} else {
		next({ name: "Unauthenticated" });
	}
}

// async function authorization(req, res, next) {
// 	const { role, email, id } = req.loggedUser;
// 	const campaignId = req.params.id;

// 	const campaign = await prisma.campaign.findUnique({ where: { id: +campaignId } });
// 	if (campaign) {
// 		if (id === campaign.userId) {
// 			next();
// 		} else {
// 			next({ name: "Unauthorized" });
// 		}
// 	} else {
// 		next({ name: "ErrorNotFound" });
// 	}
// }

module.exports = {
	authentication,
	// authorization,
	
};