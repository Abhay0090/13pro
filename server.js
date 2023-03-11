const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const Telegraf = require('telegraf');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/sendImage', (req, res) => {
    const imgData = req.body.image;
    const bot = new Telegraf(process.env.BOT_TOKEN);
    bot.start((ctx) => ctx.reply('Sending image to celebrity look-alike detector...'));
    bot.on('photo', (ctx) => {
        const photo = ctx.message.photo[0];
        fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${photo.file_id}`)
            .then(res => res.json())
            .then(json => {
                const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${json.result.file_path}`;
                fetch(`https://celebrity-look-alike-detector.herokuapp.com/detect?url=${encodeURIComponent(fileUrl)}`)
                    .then(res => res.json())
                    .then(json => {
                        const result = json.result;
                        if (result) {
                            ctx.reply(`You look like ${result.name} with ${result.confidence.toFixed(2)}% confidence!`);
                        } else {
                            ctx.reply('Sorry, we could not find a match for your image.');
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        ctx.reply('An error occurred while processing your image. Please try again later.');
                    });
            })
            .catch(err => {
                console.error(err);
                ctx.reply('An error occurred while processing your image. Please try again later.');
            });
    });
    bot.launch();
    bot.handleUpdate({
        message: {
            photo: [
                {
                    data: imgData
                }
            ]
        }
    });
    res.sendStatus(200);
});

app.listen(port, ()
