const execSync = require('child_process').execSync;

var previewAppPath = './ImageEngine/build/preview';
exports.MIN_SKIN_NUM = 1;
exports.MAX_SKIN_NUM = 4; // limited by fileNameSize


var createPreview = exports.createPreview = function(name, codes) {
	var previewAppArgs = "";
	for (i in codes)
	{
		console.log(`adding code ${codes[i]}`);
		previewAppArgs += codes[i] + " ";
	}
	console.log(previewAppPath + ' ' + name + ' ' + previewAppArgs +'\n');
	var exec = execSync(previewAppPath + ' ' + name + ' ' + previewAppArgs);
	return skinPath(name, codes);
};

exports.maxSkinsNum = 5;

var skinPath = exports.skinPath = function(charString, codes) {
	var filePath = 'data/' + charString + '/skins/';
	for (var i = 0; i < codes.length - 1; i++)
	{
		filePath  += codes[i] + '+';
	}
	return filePath + codes[codes.length - 1] + '.png';
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

        exports.inviteLink = "Join my server: https://discord.gg/qNWckWq";

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

var colorCode2ColorArray = exports.colorCode2ColorArray = function a(code, charID) {
	const checksumCharsNum = 2
	var hexCharNum = CharID2ColorNum[charID] * 6; // number of hexChars for r g and b
	var paddingNum = 2 * (((hexCharNum + checksumCharsNum) / 2) % 2);        // odd hexCharNum -> 00 padding at the end
	var dashNum    = Math.floor((hexCharNum + paddingNum) / 4);  // number of '-'

	console.log('expected length ' + (hexCharNum + dashNum + paddingNum + checksumCharsNum) + ' but got ' + code.length);
	console.log(`hexCharNum = ${hexCharNum}`);
	console.log(`dashNum = ${dashNum}`);
	console.log(`paddingNum = ${paddingNum}`);
	console.log(`checksumCharNum = ${checksumCharsNum}`);
	if (code.length < (hexCharNum + dashNum + paddingNum + checksumCharsNum)) return false;
	if (code.length > (hexCharNum + dashNum + paddingNum + checksumCharsNum))
	{
		console.log("HHHERE " +code.substr(0, hexCharNum + dashNum + paddingNum + checksumCharsNum));
		code = code.substr(0, hexCharNum + dashNum + paddingNum + checksumCharsNum);
	}

	var hexCharList = [];

	var i = 0;
	// check for paddding 00:
	if (paddingNum != 0 && code.substr(code.length - 2, 2) !== "00")
		return false;
	while (i < hexCharNum + dashNum + checksumCharsNum)	// omit padding 00
	{
		if (0 === ((i+1) % 5) && i != 0) // every 5ft charcter is a dash
		{
			if (code[i] !== '-') {
				console.log(`expected - at position ${i}`);
				return false;
			}
			
			i++;
		}
		// next two hex chars are  r, g or b
		if (i+1 >= code.length) {

			console.log(`expected 2 hex chars at position ${i}!`);
			return false;
		}

		var hexVal = parseInt(code.substr(i, 2), 16);
		console.log(`code: ${code}`);
		console.log(`substr: ${code.substr(i, 2)}`);
		console.log("hexVal: "+hexVal.toString(10));
		if (isNaN(hexVal)) {
			console.log('couldnt parse ' + code.substr(i, i+2) + ' to hex');
			return false;
		}

		hexCharList.push(parseInt(hexVal));
		i += 2;
	}

	var colorArray = [];
	for (i = 0; i < CharID2ColorNum[charID]; ++i)
	{
		var tmp = hexCharList.splice(0, 3);
		console.log(`spliced ${tmp}`);
		colorArray.push(tmp); // add one rgb array  to colorArray
	}
	var givenCheckSum = hexCharList.splice(0, 3);
	
	console.log(colorArray);
	// checksum is still in hexCharList
	// TODO
	var sum = 0;
	for (var i = 0; i < colorArray.length; i++)
	{
		console.log(`i = ${i}`);
		console.log(`colorArray[i][0] (red) = ${colorArray[i][0]}`);
		console.log(`colorArray[i][1] (green) = ${colorArray[i][1]}`);
		console.log(`colorArray[i][2] (blue) = ${colorArray[i][2]}`);
		sum += (i + 101) * colorArray[i][0];
		sum += (i + 102) * colorArray[i][1];
		sum += (i + 103) * colorArray[i][2];
	}
	var checksum = sum % 256;
	console.log(`sum = ${sum}`);
	console.log(`checksum = ${checksum}`);

	if (givenCheckSum != checksum)
	{
		console.log(`expected checksum ${checksum} but got ${givenCheckSum}`);
		return false;
	}


	return [colorArray, code];

}
