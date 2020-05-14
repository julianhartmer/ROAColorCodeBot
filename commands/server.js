module.exports = {
	name: 'server',
	description: 'Get invite link to CustomColorBot development server.',
	execute(message) {
		message.channel.send(`Link available once the bot goes public :)`);
	},
};