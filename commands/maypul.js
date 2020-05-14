const { prefix } = require('../config.json');
const CCLib = require('../colorcodelib.js');

const commandName = 'maypul';
const displayName = CCLib.commandName2DisplayName[commandName];

module.exports = {
	name: commandName,
	description: 'Generate random '+displayName+' skin.',
	aliases: CCLib.commandName2Aliases[commandName],
	usage: '',
	cooldown: 1,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;
		var filepath = undefined;

		if (!args.length) {
			var code = CCLib.generateColorCode4Char(commandName);
			data.push(displayName);
			data.push('`' + code + '`');
			filepath = CCLib.createPreview(commandName, code);
		} else {
			// TODO detect code or colors
			data.push('not implemented yet!');
		}

		if (filepath == undefined)
		{
			message.channel.send(data, { split: true});
		} else {
			message.channel.send(data, { split: true, files:[filepath]});
		}
	},
};