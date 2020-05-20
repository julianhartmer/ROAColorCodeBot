const { prefix } = require('../config.json');
const CCLib = require('../colorcodelib.js');

module.exports = {
	name: 'present',
	description: 'Let the bot present your color code with a name!',
	aliases: ['check'],
	usage: '[character name] [color] [Optional Skin Description]',
	cooldown: 0,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;
		var filepath = undefined;

		if (args.length < 2) {
			return message.channel.send('Specify character and color code!');
		}
		// check and remove all dashes

		// check if 
		var name = args[0].toLowerCase();
		var code = args[1].toLowerCase();
		
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		if (!command) return message.channel.send('that\'s not a valid character name');
		var charName = command.name;

		var colorArrayAndCode = CCLib.colorCode2ColorArray(code, CCLib.Name2CharID[charName]);
		console.log(charName);
		if (!colorArrayAndCode || colorArrayAndCode[0].length != CCLib.CharID2ColorNum[CCLib.Name2CharID[charName]])
		{
			data.push(`${message.author}, your code is not valid!`);
		}
		else
		{
			code = colorArrayAndCode[1];
			var colorArray = colorArrayAndCode[0];
			data.push(`Skin by ${message.author} `);
			CCLib.createPreview(charName, [code]);
			filepath = CCLib.skinPath(charName, [code]);
			var description = "";
			for (i of args.slice(2))
			{
				
				description += i + " ";
			}
			description = description.split("*").join("");
			description = description.split("\n").join("");
			description = description.split("@").join("");
			description = description.split("`").join("");
			if (description.length > 0)
			{
				data.push("**" + description + "**")
			}
			data.push("``" + code.toUpperCase() + "``");
		}

		if (filepath == undefined)
		{
			message.channel.send(data, { split: true});
		} else {
			message.channel.send(data, { split: true, files:[filepath]});
		}
	},
};