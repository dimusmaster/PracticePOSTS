const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Cookies = require("cookies");
const User = require("./models/user-login");
const Post = require("./models/post");
const { error } = require("console");

const app = express();

const PORT = 3000;

mongoose
  .connect(
    "mongodb+srv://dimusmaster:qwerty228@mycluster.c4i15e3.mongodb.net/practicedb?retryWrites=true&w=majority"
  )
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));

//Авторизация
app.post("/api/auth/login", (req, res) => {
  const cookies = Cookies(req, res);
  if (cookies.get("username")) {
    return res.status(400).json({ message: "Вы уже залогинены!" });
  }
  const { username, password } = req.body;
  User.findOne({ username })
    .then((result) => {
      if (result.username === username && result.password === password) {
        cookies.set("username", username);
        return res.status(200).json({ message: "Успешная авторизация!" });
      }
      return res.status(400).json({ message: "Неверный логин или пароль!" });
    })
    .catch(() => {
      return res.status(400).json({ message: "Неверный логин или пароль!" });
    });
});

//Регистрация
app.post("/api/auth/register", (req, res) => {
  const { username, password, second_pass } = req.body;
  if (password === second_pass) {
    User.findOne({ username }).then((result) => {
      if (result) {
        return res
          .status(400)
          .json({ message: "Пользователь уже существует!" });
      }
      const user = new User({ username, password, role: "USER" });
      user
        .save()
        .then(() => {return res.status(200).json({ message: "Успешная регистрация!" });})
        .catch((error) => {
          return res.json({ message: error });
        });
    });
  } else {
    return res.status(400).json({ message: "Пароли не совпадают!" });
  }
});

//Поиск статей
app.get("/api/search", (req, res) => {
  try {
    const { filter } = req.body;
    Post.find({ category: filter })
      .then((result) => {
        if (result[0]) {
          return res.status(200).json({ message: result });
        }
        return res.status(400).json({ message: "Записей не найдено!" });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({ message: "Ошибка при поиске записей!" });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Ошибка фильтрации!" });
  }
});

//Проверка профиля
app.get("/api/profile", (req, res) => {
  const cookies = Cookies(req, res);
  if (cookies.get("username")) {
    return res
      .status(200)
      .json({ message: `Добро пожаловать, ${cookies.get("username")}!` });
  }
  return res.status(400).json({ message: "Вы не авторизованы!" });
});

//Изменение данных пользователя
app.patch("/api/profile", (req, res) => {
  const cookies = Cookies(req, res);
  if (!cookies.get("username") || req.body.username.length < 2 ||req.body.password.length < 3) {
    return res.status(400).json({
      message: "Вы не авторизованы или неверный формат записи!",
    });
  }
  User.findOneAndUpdate(
    { username: cookies.get("username") },
    { username: req.body.username, password: req.body.password }
  )
    .orFail()
    .then(() => {
      cookies.set("username", req.body.username);
      return res.status(200).json({ message: "Успешно изменено!" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "Ошибка при выполнении запроса!" });
    });
});

//Просмотр статьи
app.get("/api/content/:post", (req, res) => {
  Post.findById(new ObjectId(req.params.post))
    .orFail()
    .then((result) => {
      return res.status(200).json({
        status: `Success for id: ${req.params.post}`,
        message: result,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "Записей не найдено!" });
    });
});

//Создание статьи
app.post("/api/create-post", (req, res) => {
  const cookies = Cookies(req, res);
  if (!cookies) {
    return res.status(400).json({ message: "Вы не авторизованы!" });
  }
  User.findOne({ username: cookies.get("username") })
    .orFail()
    .then((result) => {
      Post.create({
        title: req.body.title,
        text: req.body.text,
        author: result._id,
        category: req.body.category,
      })
        .then((result) => {
          return res.status(200).json({ message: result });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "Ошибка при обработке запроса!" });
    });
});

//Удаление поста    
app.delete("/api/post-delete", (req, res) => {
    const {post_id} = req.body;
    Post.findByIdAndDelete(new ObjectId(post_id))
    .orFail()
    .then(() => {res.status(200).json({message: `Успешно удалено в ${new Date()}!`})})
    .catch((error) => {console.log(error); res.status(400).json({message: "Пост не найден или неверный формат запроса!"})})
}); 

//Ошибка
app.use((req, res) => {
  return res.status(400).json({
    message: "Ошибка!",
  });
});