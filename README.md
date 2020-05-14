# ROAColorCodeBot
A discord bot to create random Rivals of Aether Custom Color codes with preview. After invoking a bot argument, it replies with a randomly generated valid Rivals of Aether Color Code and a in-game preview image of the generated code.


# Requirements:
- Node.js with discord.js (https://discord.js.org/#/)
- cmake
- Opencv C++ (only 4.2 tested!)

# Installation:
1. Add config.json:
```json
{
	"prefix": "!skin ",
	"token": "YOUR_DISCORD_BOT_TOKEN"
}
```
2. Install discrod.js `npm install discord.js`
3. Build *preview* executable:
```console
    $ mkdir BuildEngine/build
    $ cd BuildEngine/build
    $ cmake -DCMAKE_BUILD_TYPE=Release ..
    $ make
    $ cd ../..
```
4. Start yout bot: `node bot.js`

# Project Structure:
```
├── commands                # files for each command
├── data                    # has a subfolder for each character, skins are stored in "CHAR/skins"
├── ImageEngine
│   ├── CMakeList.txt
│   └── src
│       ├── parser.cpp      # Parse character screenshot. Outdated at the moment.
│       └── preview.cpp
├── bot.js                  # Discord bot
├── colorcodelib.js         # Color Code library used by bot.js
└── README.md
└── .gitignore
```