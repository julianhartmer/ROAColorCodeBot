const { prefix } = require('../config.json');
const CCLib = require('../colorcodelib.js');

module.exports = {
	name: 'present',
	description: 'Show off your cool skin, give it a name! You can even tag the creator!',
	aliases: ['show'],
	usage: '[character name] [color code] [Optional Skin Description] (Optional: "by" [creator of skin])',
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
		var author = `${message.author}`;
		var description = "";
		
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
			CCLib.createPreview(charName, [code]);
			filepath = CCLib.skinPath(charName, [code]);
			for (i of args.slice(2))
			{
				
				description += i + " ";
			}
			description = description.split("*").join("");
			description = description.split("\n").join("");
			description = description.split("`").join("");
			
			// parse creator:
			var tmp = description.split(' ');
			console.log(`tmp = ${tmp}`);
			console.log(`tmp.length = ${tmp.length}`);
			if (tmp.length >= 3 && tmp[tmp.length - 3] == 'by' && tmp[tmp.length - 2] != "")
			{
				console.log(`tmp[tmp.length - 3] = ${tmp[tmp.length - 3]}`);
				console.log(`tmp[tmp.length - 2] = ${tmp[tmp.length - 2]}`);
				author = tmp[tmp.length - 2];
				console.log(`tmp = ${tmp}`);
				tmp = tmp.slice(0, tmp.length - 3);
				console.log(`tmp = ${tmp}`);
				description = tmp.join(' ');
			}
		}

		if (filepath == undefined)
		{
			message.channel.send(data, { split: true});
		} else {

			const displayName = CCLib.commandName2DisplayName[CCLib.CharID2FolderName[CCLib.Name2CharID[charName]]];
			if (description.length > 0)
			{
				data.push("**" + description + " " + displayName + "**" +" by " + author)
			}
			else
			{
				data.push("**" + displayName + "**" +" by " + author)
			}
			data.push("``" + code.toUpperCase() + "``");
			message.channel.send(data, { split: true, files:[filepath]});
		}
	},
};