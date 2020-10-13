const _ = require("lodash");
const dotenv = require("dotenv");

dotenv.config();

const baseConfig = {
	env: process.env.NODE_ENV || "development",
	port: Number(process.env.PORT),
	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: "100d",
	},
	dbUrl: process.env.DB_URL,
};

let envConfig = {};
switch (baseConfig.env) {
	case "dev":
	case "development":
		envConfig = require("./dev");
		break;
	case "test":
	case "testing":
		envConfig = require("./testing");
		break;
	case "prod":
	case "production":
		break;
	default:
		envConfig = require("./dev");
}

module.exports = _.merge(baseConfig, envConfig);
