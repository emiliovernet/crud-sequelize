const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const session = require("express-session")

const indexRouter = require('./routes/index');

const moviesRoutes = require('./routes/moviesRoutes');
const genresRoutes = require('./routes/genresRoutes');
const actorsRoutes = require('./routes/actorsRoutes');
const app = express();

app.use(session({
    secret:"Esto es un secreto",
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// view engine setup
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(methodOverride('_method'));
app.use('/', indexRouter);
app.use(moviesRoutes);
app.use(genresRoutes);
app.use(actorsRoutes);

app.listen('3001', () => console.log('Servidor corriendo en http://localhost:3001/'));
