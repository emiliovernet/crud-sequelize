const db = require("../database/models");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const fetch = require("node-fetch");
require("dotenv").config();
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
      const movie = await db.Movie.findByPk(req.params.id, {
        include: ["genre", "actors"],
      });
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

  add: async (req, res) => {
    try {
      const genres = await db.Genre.findAll();
      res.render("moviesAdd", { genre: genres });
    } catch (error) {
      res.send({ error });
    }
  },

  create: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      try {
        const genres = await db.Genre.findAll();
        return res.render("moviesAdd", {
          errors: errors.mapped(),
          oldData: req.body,
          genre: genres,
        });
      } catch (error) {
        res.send({ error });
      }
    }

    const newMovie = {
      title: req.body.title,
      rating: req.body.rating,
      awards: req.body.awards,
      release_date: req.body.release_date,
      length: req.body.length,
      genre_id: req.body.genre,
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
      const genres = await db.Genre.findAll();

      return res.render("moviesEdit", { movie, genres });
    } catch (error) {
      return res.send({ error });
    }
  },

  update: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      try {
        const movie = await db.Movie.findByPk(req.params.id);
        const genres = await db.Genre.findAll();
        return res.render("moviesEdit", {
          errors: errors.mapped(),
          movie: movie,
          genres: genres,
          oldData: req.body,
        });
      } catch (error) {
        return res.send({ error });
      }
    }
    try {
      const movie = {
        title: req.body.title,
        rating: req.body.rating,
        awards: req.body.awards,
        release_date: req.body.release_date,
        length: req.body.length,
        genre_id: req.body.genre,
      };
      await db.Movie.update(movie, { where: { id: req.params.id } });
      res.redirect("/movies");
    } catch (error) {
      return res.send({ error });
    }
  },

  delete: async (req, res) => {
    try {
      const movie = await db.Movie.findByPk(req.params.id);
      res.render("moviesDelete", { Movie: movie });
    } catch (error) {
      return res.send({ error });
    }
  },

  destroy: async (req, res) => {
    try {
      await db.Movie.destroy({ where: { id: req.params.id } });
      res.redirect("/movies");
    } catch (error) {
      return res.send(error);
    }
  },

  search: async (req, res) => {
    try {
        const { q } = req.query;
        const movies = await db.Movie.findAll({
            where: {
                title: { [Op.like]: `%${q}%` }
            }
        });
        if (movies.length === 0) {
            const url = `http://www.omdbapi.com/?s=${q}&type=movie&apikey=${process.env.OMDB_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.Error) {
                return res.status(404).send({
                    status: 404,
                    message:'Pelicula no encontrada!'
                });
            }
            const moviesToStore = data.Search?.map(element => ({
                title: element.Title,
                rating: 1,
                awards: 1,
                release_date: `${element.Year}-01-01`
            }));
            const moviesCreated = await db.Movie.bulkCreate(moviesToStore);
            return res.send(moviesCreated);
        }
        return res.send(movies);
    } catch (error) {
        return res.json({error});
    }
}
}

module.exports = controller;