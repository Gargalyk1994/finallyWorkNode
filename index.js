const express = require("express");
const app = express();
const joi = require('joi');
const fs = require('fs');
const path = require('path');

const users = [];
let uniqId = 0;

const userSchema = joi.object({
    firstname: joi.string().min(1).required,
    lastname: joi.string().min(1).required,
    work: joi.string().min(1).required,
    city: joi.string().min(1),
    gender: joi.string().min(1).required,
    age: joi.number().min(1).max(100).required,
});

app.use(express.json());//чтобы express использовал формат данных JSon

/*
** получение всех пользователей
*/
app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "./users.json")));
    res.send ({ users });
});

/*
** получение одного пользователя
*/
app.get('/users/:id', (req, res) => { 
    const dataUser = JSON.parse(fs.readFileSync(path.join(__dirname, "./users.json")));
    const userId = req.params.id;
    const user = users.find(user => dataUser.id === Number(userId));
    if (user) {
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
})

/*
** добавить пользователя 
*/
app.post('/users', (req, res) => {
    // const result = userSchema.validate(req.body);
    // if (result.error) {
    //     return res.status(404).send({error: result.error.details});
    // }
    uniqId += 1;
    users.push({
        id: uniqId,
        ...req.body//разложить данные из body которые указаны в Postmane
    });
    fs.readFileSync(path.join(__dirname, "./users.json"));
    fs.writeFileSync(path.join(__dirname, "./users.json"), JSON.stringify(users));
    res.send({id: uniqId});
})

/*
** обновить пользователя
*/
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    // const result = userSchema.validate(req.body);
    // if (result.error) {
    //     return res.status(404).send({error: result.error.details});
    // }
    const user = users.find(user => user.id === Number(userId));
    if (user) {
        const {firstname, lastname, work, city, gender, age} = req.body;
        user.firstname = firstname;
        user.lastname = lastname;
        user.work = work;
        user.city = city;
        user.gender = gender;
        user.age = age;
        fs.readFileSync(path.join(__dirname, "./users.json"));
        fs.writeFileSync(path.join(__dirname, "./users.json"), user);
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null})
    }
})

/*
** удалить пользователя
*/
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === Number(userId));
    if (user){
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        fs.readFileSync(path.join(__dirname, "./users.json"));
        fs.writeFileSync(path.join(__dirname, "./users.json"), user); 
        res.send ({ user });
    }else{
        res.status(404);
        res.send({user: null});
    }
})

app.listen(3000);