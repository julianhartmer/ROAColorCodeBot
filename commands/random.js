const { prefix } = require('../config.json');
const CCLib = require('../colorcodelib.js');

module.exports = {
	name: 'random',
	description: 'Generate random skin.',
	aliases: ['rand'],
	usage: '',
	cooldown: 1,
	execute(message, args) {
		const data = [];
		const commandName = CCLib.randomCharacter();
		const displayName = CCLib.commandName2DisplayName[commandName];
		const { commands } = message.client;
		var filepath = undefined;

		if (!args.length) {
			var code = CCLib.generateColorCode4Char(commandName);
			data.push(displayName);
			data.push('`' + code + '`');
			filepath = CCLib.createPreview(commandName, code);
		} else {
			data.push('not implemented yet!');
			// block this feature because it gets the bot killed by discord servers

			// if (args.length == 1 && !isNaN(args[0])) {
			// 	var iterations = Math.min(CCLib.maxSkinsNum, Math.max(1, args[0]));
			// 	for (i = 0; i < iterations; ++i)
			// 	{
			// 		var code = CCLib.generateColorCode4Char(commandName);
			// 		filepath = CCLib.createPreview(commandName, code);
			// 		message.channel.send('`' + code + '`', { split: true, files:[filepath]});
					
			// 	}
			// 	return;
			// }
		}

		if (filepath == undefined)
		{
			message.channel.send(data, { split: true});
		} else {
			message.channel.send(data, { split: true, files:[filepath]});
		}
	},
};