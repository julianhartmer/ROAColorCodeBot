const execSync = require('child_process').execSync;

var previewAppPath = './ImageEngine/build/preview';

var createPreview = exports.createPreview = function(name, code) {
	var exec = execSync(previewAppPath + ' ' + name + ' ' + code);
	console.log(previewAppPath + ' ' + name + ' ' + code +'\n');
	return skinPath(name, code);
};

exports.maxSkinsNum = 5;

var skinPath = exports.skinPath = function(charString, code) {
	return 'data/' + charString + '/skins/' + code + '.png';
};

var randomCharacter = exports.randomCharacter = function() {
	return CharID2FolderName[Math.round(Math.random() * Name2CharID['zetterburn'])];
}

var commandName2DisplayName = exports.commandName2DisplayName = {
	'absa': 'Absa',
	'clairen': 'Clairen',
	'elliana': 'Elliana',
	'etalus': 'Etalus',
	'forsburn': 'Forsburn',
	'kragg': 'Kragg',
	'maypul': 'Maypul',
	'orcane': 'Orcane',
	'ori': 'Ori',
	'ranno': 'Ranno',
	'shovelknight': 'Shovel Knight',
	'sylvanos': 'Sylvanos',
	'wrastor': 'Wrastor',
	'zetterburn': 'Zetterburn'
};

var commandName2Aliases = exports.commandName2Aliases = {
	'absa': [],
	'clairen': ['spacemarth'],
	'elliana': ['elli', 'eli'],
	'etalus': ['eta'],
	'forsburn': ['fors'],
	'kragg': ['Kragg'],
	'maypul': ['mayp, may'],
	'orcane': ['orc', 'orca', 'lofi'],
	'ori': [],
	'ranno': ['dima', 'epic', 'laban'],
	'shovelknight': ['sk'],
	'sylvanos': ['sylv'],
	'wrastor': [],
	'zetterburn': ['zetter', 'no']
};


var Name2CharID = exports.Name2CharID = {
	"Absa": 0,
	"absa": 0,
	"Clairen": 1,
	"clairen": 1,
	"Elliana": 2,
	"elliana": 2,
	"elli": 2,
	"eli": 2,
	"Etalus": 3,
	"etalus": 3,
	"eta": 3,
	"Forsburn": 4,
	"forsburn": 4,
	"fors": 4,
	"Kragg": 5,
	"kragg": 5,
	"Maypul": 6,
	"maypul": 6,
	"mayp": 6,
	"Orcane": 7,
	"orcane": 7,
	"orc": 7,
	"Ori": 8,
	"ori": 8,
	"Ranno": 9,
	"ranno": 9,
	"ShovelKnight": 10,
	"shovelknight": 10,
	"sk": 10,
	"SK": 10,
	"Sylvanos": 11,
	"sylvanos": 11,
	"sylv": 11,
	"Wrastor": 12,
	"wrastor": 12,
	"Zetterburn": 13,
	"zetterburn": 13,
	"zetter": 13,
	"random": "random"
};

var CharID2FolderName = exports.CharID2FolderName = [
	"absa",
	"clairen",
	"elliana",
	"etalus",
	"forsburn",
	"kragg",
	"maypul",
	"orcane",
	"ori",
	"ranno",
	"shovelknight",
	"sylvanos",
	"wrastor",
	"zetterburn"
];

var CharID2ColorNum = exports.CharID2ColorNum = [
	5,
	7,
	6,
	3,
	7,
	4,
	5,
	2,
	5,
	5,
	4,
	5,
	5,
	5
];



var helpMessage = exports.helpMessage = "Commands:\n\
		\t!skin [CharacterName] - random custom color code\n\
		\t!cc help                    - display this message\n\
		\t!cc server                  - get invite link to dev server";

        exports.inviteLink = "Join dev server: https://discord.gg/Fqw5G79";

var errorMessage = exports.errorMessage = "Error! Use '!cc help' for help";


var generateColorCode = exports.generateColorCode = function(colorNum) {
	var r = [...Array(colorNum)].map(() => Math.floor(Math.random() * 256));
	var g = [...Array(colorNum)].map(() => Math.floor(Math.random() * 256));
	var b = [...Array(colorNum)].map(() => Math.floor(Math.random() * 256));
	var checksum = 0;
	for (var i, i = 0; i < colorNum; i++)
	{
		checksum += (i + 101) * r[i];
		checksum += (i + 102) * g[i];
		checksum += (i + 103) * b[i];
	}

	checksum = checksum % 256;
	var code = "";
	for (var i, i = 0; i < colorNum; i++)
	{
		code += r[i].toString(16).toUpperCase().padStart(2, '0');
		code += g[i].toString(16).toUpperCase().padStart(2, '0');
		code += b[i].toString(16).toUpperCase().padStart(2, '0');
	}
	code += checksum.toString(16).toUpperCase().padStart(2, '0');
	if (i % 2 == 0)
	{
		code += "00";
	}
	return code.match(/.{1,4}/g).join("-");
}

var generateColorCode4Char = exports.generateColorCode4Char = function (character) {
	if (character in Name2CharID)
	{
		return generateColorCode(CharID2ColorNum[Name2CharID[character]]);
	} else {
		return undefined;
	}
}


var isValidCode = exports.isValidCode = function (code, charID) {
	var codeLen = CharID2ColorNum[charID]*4+Math.floor(CharID2ColorNum[charID]*4/2);
	if (code.length != codeLen) return false;

}
