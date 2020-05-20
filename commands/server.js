const CCLib = require('../colorcodelib.js');

module.exports = {
	name: 'server',
	description: 'Get invite link to CustomColorBot development server.',
	execute(message) {
		message.channel.send(CCLib.inviteLink);
	},
};