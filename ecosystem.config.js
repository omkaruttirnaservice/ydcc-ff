require("dotenv").config();
module.exports = {
	apps: [
		{
			name: `${process.env.PROCESS_NAME}`,
			script: "app.js",
			exec_mode: "cluster",
			instances: 10,
			autorestart: true,
			watch: false,
			max_memory_restart: "4G",
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
