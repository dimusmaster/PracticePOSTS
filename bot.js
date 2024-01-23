const TelegramBot = require('node-telegram-bot-api');
const User = require('./API/models/user-login');

const token = '6528528600:AAHZd1LQVV3fdLH8hn5Kn0U2CKoPz0td4Us';

const bot = new TelegramBot(token, {polling: true});



function getPosts(chatId, value) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("filter", value);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded
  };

  fetch("http://localhost:3000/api/search", requestOptions)
    .then(response => response.text())
    .then(result => {
      const posts = JSON.parse(result).message;
      posts.forEach(element => {
        const sendText = `⚡️ *${element.title}*\n\n${element.text}\n\nКатегория: ${element.category}\n_Создана: ${element.createdAt}_`
        bot.sendMessage(chatId, sendText, navigation)
      });
    })
    .catch(error => console.log('error', error));
}

function postNavigation(chatId, postId) {
var requestOptions = {
    method: 'GET'
  };

  fetch(`http://localhost:3000/api/content/${postId}`, requestOptions)
    .then(response => response.text(response))
    .then(result => {
      const sendText = `⚡️ *${JSON.parse(result).message.title}*\n\n${JSON.parse(result).message.text}\n\nКатегория: ${JSON.parse(result).message.category}\n_Создана: ${JSON.parse(result).message.createdAt}_`
      bot.sendMessage(chatId, sendText, navigation)
    })
    .catch(error => console.log('error', error));
}




const commands = [
    {
        command: "start",
        description: "Перезапустить бота"

    },
    {
        command: "posts",
        description: "Посмотреть посты"
    }
    ,
    {
        command: "search",
        description: "Поиск постов"
    }
]

bot.setMyCommands(commands);

const navigation = {
    parse_mode: "markdown",
  };
  
const filters = {
  reply_markup: {
    inline_keyboard: [
        [{ text: 'POST', callback_data: 'post'}]
    ]
  }
};


bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'post') {
    getPosts(opts.chat_id, action);
    bot.editMessageText('Посты с фильтром POST:', opts);
  }

});
  

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  switch (msg.text){
    case '/start':
      bot.sendMessage(chatId, `Добро пожаловать, ${msg.chat.first_name}!`, navigation);
      break;
    case '/posts':
      bot.sendMessage(chatId, "Укажите фильтр:", filters);
      break;
    case '/search':
      bot.sendMessage(chatId, "Введите id поста:");
      bot.on('message', async (msg) => {
        if (msg.text.length === 24){
          return postNavigation(chatId, msg.text);
        }
      })
      break;
  }
});
