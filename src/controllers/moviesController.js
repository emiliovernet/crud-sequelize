const db = require("../database/models");
const { validationResult } = require("express-validator");
const controller = {
  list: async (req, res) => {
    try {
      const movies = await db.Movie.findAll();
      res.render("moviesList", { movies });
    } catch (error) {
      res.send(error);
    }
  },

  detail: async (req, res) => {
    try {
      const movie = await db.Movie.findByPk(req.params.id);
      res.render("moviesDetail", { movie });
    } catch (error) {
      res.send(error);
    }
  },

  new: async (req, res) => {
    try {
      const newestMovies = await db.Movie.findAll({
        order: [["release_date", "DESC"]],
      });
      res.render("newestMovies", { newestMovies });
    } catch (error) {
      res.send(error);
    }
  },

  recomended: async (req, res) => {
    try {
      const recommendedMovies = await db.Movie.findAll({
        order: [["rating", "DESC"]],
      });
      res.render("recommendedMovies", { recommendedMovies });
    } catch (error) {
      res.send(error);
    }
  },

  add: function (req, res) {
    res.render("moviesAdd");
  },

  create: async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("moviesAdd", {
        errors: errors.mapped(),
        oldData: req.body,
      });
    }

    const newMovie = {
      title: req.body.title,
      rating: req.body.rating,
      awards: req.body.awards,
      release_date: req.body.release_date,
      length: req.body.length,
    };

    try {
      await db.Movie.create(newMovie);
      res.redirect("/movies");
    } catch (error) {
      res.send({ error });
    }
  },

  edit: async (req, res) => {
    try {
      const movie = await db.Movie.findByPk(req.params.id);
      res.render("moviesEdit", { movie: movie });
    } catch (error) {
      return res.send({ error });
    }
  },

  update: async (req, res) => {

    const errors = validationResult(req);
    
    const movie = {
      title: req.body.title,
      rating: req.body.rating,
      awards: req.body.awards,
      release_date: req.body.release_date,
      length: req.body.length,
    };

    if (!errors.isEmpty()) {
      return res.render('moviesEdit',{
        errors: errors.mapped(),
        movie: movie
      });
    };

    try {
      await db.Movie.update(movie, { where: { id: req.params.id } });
      res.redirect("/movies");
    } catch (error) {
      return res.send({ error });
    }
  },
  
  delete: function (req, res) {
    // TODO
  },

  destroy: function (req, res) {
    // TODO
  },
};

module.exports = controller;
