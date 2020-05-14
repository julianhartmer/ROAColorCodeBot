const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, CharID2ColorNum } = require('./config.json');
const CCLib = require('./colorcodelib.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);


// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// client.on('message', msg => {
// 	if (!message.content.startsWith(prefix) || message.author.bot) return;
// 	const args = message.content.slice(prefix.length).split(/ +/);
// 	const commandName = args.shift().toLowerCase();

//     if (msg.content.substring(0, 1) == '!') {
//         var args = msg.content.substring(1).split(' ');
// 		var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             // !ping
// 	    case 'cc':
// 	    	switch(args[0]) {
// 	    		case "help":
// 	    			msg.channel.send(CCLib.helpMessage);
// 	    			break;
// 	    		case "server":
// 	    			msg.channel.send(CCLib.inviteLink);
// 	    			break;
// 	    		default:
// 	    			msg.channel.send(CCLib.errorMessage);
// 	    	}
// 	   	break;
//             case 'skin':
// 				if (args[0] === "random")
// 				{
// 					var id = Math.round(Math.random() * CCLib.Name2CharID["zetter"]);
// 					console.log(id);
// 					args[0] = CCLib.CharID2FolderName[id];
// 				}
// 				var code = CCLib.generateColorCode4Char(args[0]);
// 				if (code == undefined)
// 				{
// 					msg.channel.send(CCLib.errorMessage);
// 					break;
				
// 				}
// 				var charName = args[0];
// 				var charID = CCLib.Name2CharID[charName];
// 				console.log('calling ' +'./ImageEngine/build/preview '+ CCLib.CharID2FolderName[charID] + ' ' + code);
// 				//var user = execSync('../preview '+ chara + ' ' + code);
// 				tmp = execSync('./ImageEngine/build/preview '+ CCLib.CharID2FolderName[charID] + ' ' + code);
// 				var charNameReply = CCLib.CharID2FolderName[charID].charAt(0).toUpperCase() + CCLib.CharID2FolderName[charID].slice(1);

// 				console.log('sending file: data/'+ CCLib.CharID2FolderName[charID] +"/skins/"+code+".png");
//                 msg.channel.send(charNameReply + "\n`"+code+"`", {files:["data/"+CCLib.CharID2FolderName[charID]+"/skins/"+code+".png"]});
// 				break;
// 			// case 'show':
// 			// 	console.log(args[0] + " "+ args[1]);
// 			// 	var charName = args[0];
// 			// 	var code = args[1];
// 			// 	var charID = Name2CharID[charName];
// 			// 	if (!isValidCode(code, charID))
// 			// 	{
// 			// 		msg.channel.send("Code invalid!");
// 			// 		break;
// 			// 	}
// 			// 	console.log('calling preview '+ CharID2FolderName[charID] + ' ' + code);
// 			// 	tmp = execSync('./preview '+ CharID2FolderName[charID] + ' ' + code);
// 			// 	console.log('sending file: ' + CharID2FolderName[charID] +"/"+code+".png");
// 			// 	msg.channel.send("`"+code+"`", {files:[CharID2FolderName[charID]+"/skins/"+code+".png"]});
// 			// 	break;

				

//          }
//      }
// });

// client.login(token);