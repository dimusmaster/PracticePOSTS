# Инструкция по работе с API


## Разбор файлов
* `server.js` - Все роуты в API.
* `models` - Папка с моделями для БД.
* `API.postman_collection.json` - Файл для взаимодействия с API.

## Работа с API
Для работы с API нужно запустить файл `server.js`. В консоли должно появиться сообщение об успешном подключении к серверу и БД. Далее необходимо импортировать файл `API.postman_collection.json` в Postman и начинать работу.


## Документация по запросам

<table>
    <thead>
        <tr>
            <th>Название запроса</th>
            <th>Тип запроса</th>
            <th>Параметры</th>
            <th>Нужна авторизация</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Authorization</td>
            <td>POST</td>
            <td>username, password</td>
            <td style="text-align:center">-</td>
        </tr>
        <tr>
            <td>Registration</td>
            <td>POST</td>
            <td>username, password, second_pass</td>
            <td style="text-align:center">-</td>
        </tr>
        <tr>
            <td>Create Post</td>
            <td>POST</td>
            <td>title, text, category</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Delete Post</td>
            <td>DELETE</td>
            <td>post_id</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Update User</td>
            <td>PATCH</td>
            <td>username, password</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Check Profile</td>
            <td>GET</td>
            <td>-</td>
            <td style="text-align:center">+</td>
        </tr>
        <tr>
            <td>Search</td>
            <td>GET</td>
            <td>filter</td>
            <td style="text-align:center">-</td>
        </tr>
        <tr>
            <td>Post Navigation</td>
            <td>GET</td>
            <td>/api/content/<em>указанный id поста</em></td>
            <td style="text-align:center">-</td>
        </tr>
        
</table>
