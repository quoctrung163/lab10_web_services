const express = require('express');
const chalk = require('chalk');
const { parse } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const categoryModel = require('./Category');
const app = express();

app.get('/', async (req, res) => {
    const { write } = req.query;
    if (write === 'true') {
        fs.readFile(path.resolve(__dirname, './data.xml'), { encoding: 'utf8' }, (err, data) => {
            const dataJson = parse(data);
            const categoryArray = dataJson?.categories?.category;
            categoryArray.forEach((category, index) => {
                let model = new categoryModel({
                    no: Number(index),
                    categoryName: category
                });
                model.save({ new: true });
            });
        })
    }
    res.send('Hello World!');
})

mongoose.connect('mongodb://localhost:27017/lab10', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => console.log('DB connected'))
    .catch(err => { throw new Error(err.reason) });

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(`App is running: http://localhost:${process.env.PORT || 5000}`)
    );
});