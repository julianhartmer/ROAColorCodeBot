const { prefix } = require('../config.json');
const CCLib = require('../colorcodelib.js');

const commandName = 'forsburn';
const displayName = CCLib.commandName2DisplayName[commandName];

module.exports = {
	name: commandName,
	description: 'Generate random '+displayName+' skin.',
	aliases: CCLib.commandName2Aliases[commandName],
	usage: `[Optional: Number of color codes (${CCLib.MIN_SKIN_NUM} - ${CCLib.MAX_SKIN_NUM})`,
	cooldown: 1,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;
		var filepath = undefined;

		if (!args.length) {
			var code = CCLib.generateColorCode4Char(commandName);
			data.push(displayName);
			data.push('`' + code + '`');
			filepath = CCLib.createPreview(commandName, [code]);
		} else {

			var codeNum = parseInt(args[0]);
			if (isNaN(codeNum))
			{
				data.push(`Specify a number from ${CCLib.MIN_SKIN_NUM} to ${CCLib.MAX_SKIN_NUM}!`);
			}
			else
			{
				data.push(displayName);
				if (codeNum > CCLib.MAX_SKIN_NUM)
				{
					codeNum = CCLib.MAX_SKIN_NUM;
					data.push(`You want too many skins! Here are ${codeNum}, take it or leave it :)`);
				}
				if (codeNum < CCLib.MIN_SKIN_NUM)
				{
					codeNum = CCLib.MIN_SKIN_NUM;
					data.push(`You want too few skins! Here is ${codeNum}, take it or leave it :)`);
				}
				var codes = [];
				
				for (var i = 0; i < codeNum; ++i)
				{
					codes.push(CCLib.generateColorCode4Char(commandName));
					console.log(`code ${i} is ${codes[i]}`);
					data.push('`' + codes[i] + '`');
				}
				console.log(`codes are ${codes}`);
				CCLib.createPreview(commandName, codes);
				filepath = CCLib.skinPath(commandName, codes);
			}
			
			
		}

		if (filepath == undefined)
		{
			message.channel.send(data, { split: true});
		} else {
			message.channel.send(data, { split: true, files:[filepath]});
		}
	},
};