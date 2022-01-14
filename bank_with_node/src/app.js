const express = require('express');
const hbs = require('hbs');
const path = require('path');
const appRouters = require('../app/routes/app.routes')

const app = express()

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../frontEnd/views'));
app.use(express.static(path.join(__dirname, '../frontEnd/public')))
hbs.registerPartials(path.join(__dirname, '../frontEnd/layouts'))


app.use(express.urlencoded({ extended: true }))
app.use(appRouters)



module.exports = app