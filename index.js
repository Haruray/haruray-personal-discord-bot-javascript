const Discord = require('discord.js');
const Canvas = require('canvas');
const {prefix, token, userID, guildID, channelID} = require('./config.json');
const client = new Discord.Client();

let spam = null; //for spam command
let upperTextOffset = 0; //buat gambar
let bottomTextOffset = -10; //buat gambar

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('your mom',{type : 'LISTENING'});
});

//FUNCTIONS
// Edit Gambar

function getGaris(something, isSplitted){
	//mencari lokasi karakter `|` di sebuah text
	if (isSplitted){
		let length = 0;
		for (i = 0 ; i < something.length ; i++){
			length += something[i].length + 1;
			if (something[i] == "|"){
				return length-1;
			}
		}
	}
	else{
		for (i = 0 ; i < something.length ; i++){
			if (something[i]=="|"){
				return i;
			}
		}
	}
	
}

const applyText = (canvas, text) => {
	//for resizing text
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = Number(canvas.height) / 5;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 5}px impact`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 100);

	// Return the result to use in the actual canvas
	return context.font;
};

const getFontSize = (canvas, text) => {
	//for resizing text, but to get the number only
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = Number(canvas.height) / 5;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		fontSize -= 5;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 100);

	// Return the result to use in the actual canvas
	return fontSize;
}


// Reminder
client.on('ready', () => {
	let guild = client.guilds.cache.get(guildID);
	let firstTime = true;
	if(guild && guild.channels.cache.get(channelID)) {
		// guild.channels.cache.get(channelID).send("I\'m here, fucko.");

		//Reminder how many days to get unbanned from valorant
		let interval = setInterval(function() {
			let today = new Date();
			let unbannedDay = new Date('06/21/2021');
			const diffTime = Math.abs(unbannedDay - today);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

			const reminderEmbed = new Discord.MessageEmbed()
			.setTitle(`${diffDays} DAYS TO GO!`)
			.setDescription(`<@${userID}>`)
			.attachFiles([`./random/valo.jpg`])
			.setImage(`attachment://valo.jpg`)
			.setColor('#dc3d4b');

			if (diffDays > 0 ){
				if (firstTime){
					guild.channels.cache.get(channelID).send(`<@${userID}> will be unbanned from valorant in ${diffDays} days`);
					guild.channels.cache.get(channelID).send(reminderEmbed);
					firstTime = false;
				}
				else if (today.getHours()>=8 && today.getHours <=10){
					guild.channels.cache.get(channelID).send(`<@${userID}> will be unbanned from valorant in ${diffDays} days`);
					guild.channels.cache.get(channelID).send(reminderEmbed);
				}
			}
			else{
				const doneEmbed = new Discord.MessageEmbed()
				.setTitle(`HE'S UNBANNED`)
				.setDescription(`<@${userID}>`)
				.attachFiles([`./random/yorunaika.jpg`])
				.setImage(`attachment://yorunaika.jpg`)
				.setColor('#dc3d4b');

				clearInterval(interval);

				guild.channels.cache.get(channelID).send(`<@${userID}> IS UNBANNED!!!`);
				guild.channels.cache.get(channelID).send(doneEmbed);
			}
		},1000 * 60 * 60) //call every hour
	}
})

// Hi!
client.on('message', async message => 
{
	if (message.author.bot) return;

    else if(message.content.toLowerCase() === `hello bot` || message.content.toLowerCase() === `hi bot`) 
    {
		message.channel.send("suck a cock")
    }

	//HELP COMMAND
	else if (message.content.startsWith(`${prefix}help`)) {
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle(`Command List (prefix : ${prefix})`)
			.setAuthor(client.user.username, client.user.avatarURL())
			.setColor('#569187')
			.setDescription('\u200B')
			.addFields(
				{name: "there is no command", value: "take off your clothes"},
				{name: "jk uwu", value : ":D" },
				{name: "ping", value:"just pinging, y'know?"},
				{name: "caption [upper text] | [bottom text]", value: "captioning an image"},
				{name: "setUpperOffset [number]", value:"actually to set top margin for upper text. Idk 'offset' seems more cool."},
				{name: "setBottomOffset [number]", value:"same with previous command but with bottom text."},
				{name: "resetOffset", value:"reset offset to default value"},
				{name: "spam [second] [something]", value:"spam [something] every [second]."},
				{name: "fuckoff", value:"stop spam"},
				{name: "say", value:"say something."}
			);
		
		client.users.fetch(userID).then(user => {
			helpEmbed.setFooter('It\'s haruray\'s now, bitch', `${user.avatarURL()}`);
			message.channel.send(helpEmbed);
		});
		
	}

	//PING COMMAND
	else if (message.content.startsWith(`${prefix}ping`)) {
		message.channel.send('Pinging...').then (async (msg) =>{
			msg.edit(`This cunt is as slow as ${msg.createdTimestamp - message.createdTimestamp}ms. Better than alekha i guess`);
		  })
	}

	//SPAM COMMAND
	else if (message.content.startsWith(`${prefix}spam`)) {
		const author = message.author.id;
		const splittedMessage = message.content.split(' ');
		if (splittedMessage.length < 2){
			message.channel.send("Invalid arguments, cunt");
			return;
		}
		//Mau berapa detik spamnya
		try{
			const everyWhatSecond = Number(splittedMessage[1]);
			if (everyWhatSecond < 1){
				message.channel.send("no.");
				return;
			}
			else if (everyWhatSecond > 3600){
				everyWhatSecond = 3599;
			}
			const msg = message.content.slice(splittedMessage[0].length + splittedMessage[1].length + 2);
			spam = setInterval(function(){
				message.channel.send(msg);
			},1000*everyWhatSecond);
		}catch(e){
			message.channel.send("Invalid arguments, cunt");
			return;
		}
	}
	else if (message.content.startsWith(`${prefix}fuckoff`)){
		if (spam!=null){
			clearInterval(spam);
			message.channel.send("ok. whatever");
		}
		else{
			message.channel.send("ok? weird?");
		}
		
	}

	else if (message.content.startsWith(`${prefix}uwu`)) {
        message.channel.send(`fucking disgusting.`);
    }


	//EDIT GAMBAR COMMAND
	else if (message.content.startsWith(`${prefix}caption`)) {
		// format command : [prefix stuff] uppertext | bottomtext
		//doesn't support multiline caption
		let stringOffsetUpper = 0;
		let stringOffsetBottom = 1;
		let upperText = "";
		let bottomText = "";

		//split content
		const split = message.content.split(' ');
		if (split.length <= 1){
			message.channel.send("No caption? Ok? Weird?");
			return;
		}
		//CEK : Apakah disebelum dan setelah garis dikasih spasi atau engga
		if (message.content[getGaris(Array.from(message.content),false)-1]==" "){
			stringOffsetUpper = -2;
			stringOffsetBottom = 1;
			upperText = message.content.slice(split[0].length +1 , getGaris(split,true) + stringOffsetUpper);
			bottomText = message.content.slice(getGaris(split,true) + stringOffsetBottom);
		}
		else{
			upperText = message.content.slice(split[0].length +1 , getGaris(Array.from(message.content),false) + stringOffsetUpper);
			bottomText = message.content.slice(getGaris(Array.from(message.content),false) + stringOffsetBottom);
		}
		
		//Cek apakah pake bottom text atau tidak
		if (upperText == ""){
			upperText = bottomText.slice(split[0].length+1);
			bottomText = "";
		}
        
		//load canvas and image
		let image = null;
		try{
			image= await Canvas.loadImage(message.attachments.array()[0].url);
		} catch(e){
			message.channel.send("No image? Dumbarse?");
			return;
		}
		
		if (image.width > 100 && image.height > 100){
			let canvas = Canvas.createCanvas(image.width, image.height);
			let ctx = canvas.getContext('2d');
			
			//draw some titties

			//uppertext
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			ctx.font = applyText(canvas, upperText);
			ctx.fillStyle = '#ffffff';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = getFontSize(canvas,upperText)/90;
			ctx.fillText(upperText, canvas.width/2 - ctx.measureText(upperText).width / 2, getFontSize(canvas, upperText)+ upperTextOffset); //text fill
			ctx.strokeText(upperText, canvas.width/2 - ctx.measureText(upperText).width / 2, getFontSize(canvas, upperText)+ upperTextOffset); //text stroke
			//bottomtext
			ctx.font = applyText(canvas, bottomText);
			ctx.fillStyle = '#ffffff';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = getFontSize(canvas,bottomText)/90;
			ctx.fillText(bottomText, canvas.width/2 - ctx.measureText(bottomText).width / 2, canvas.height + bottomTextOffset); //text fill
			ctx.strokeText(bottomText, canvas.width/2 - ctx.measureText(bottomText).width / 2, canvas.height + bottomTextOffset); //text stroke


			let attach = new Discord.MessageAttachment(canvas.toBuffer(),'captioned-image.png');
			message.delete();
			message.channel.send(message.author, attach);
		}
		else{
			message.channel.send("Get a fucking better picture. I can't even see that shit");
		}
    }

	else if (message.content.startsWith(`${prefix}setUpperOffset`)){
		let arg = message.content.split(" ");
		if (arg.length == 2){
			try{
				let newOffset = Number(arg[1]);
				upperTextOffset = newOffset;
				message.channel.send(`Upper text offset is changed to ${newOffset}`);
			}
			catch(e){
				message.channel.send("Give me a number, you cunt.");
			}
		}
		else{
			message.channel.send("Ok? Invalid arguments?");
		}
	}

	else if (message.content.startsWith(`${prefix}setBottomOffset`)){
		let arg = message.content.split(" ");
		if (arg.length == 2){
			try{
				let newOffset = Number(arg[1]);
				bottomTextOffset = newOffset;
				message.channel.send(`Bottom text offset is changed to ${newOffset}`);
			}
			catch(e){
				message.channel.send("Give me a number, you cunt.");
			}
		}
		else{
			message.channel.send("Ok? Invalid arguments?");
		}
	}

	else if (message.content.startsWith(`${prefix}resetOffset`)){
		upperTextOffset = 7;
		bottomTextOffset = -10
		message.channel.send("Offset reseted. Upper offset = 0, Bottom offset = -10");
	}

	else if (message.content.startsWith(`${prefix}say`)){
		let arg = message.content.split(" ");
		if (arg.length >=1){
			message.delete();
			message.channel.send(message.content.slice(arg[0].length+1));
		}
		else{
			message.channel.send("?");
		}
			
	}

})

client.login(token);
