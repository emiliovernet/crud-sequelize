const db = require("../../database/models");

const controller = {
  list: async (req, res) => {
    try {
      const movies = await db.Movie.findAll();
      const response = {
        meta: {
          status: 200,
          total: movies.length,
          url: "api/movies",
        },
        data: movies,
      };
      res.send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getById: async (req, res) => {
    try {
      const movie = await db.Movie.findByPk(req.params.id);
      if (!movie) {
        return res.status(404).send({
          status: 404,
          error: "Genero no encontrado",
        });
      }
      const response = {
        meta: {
          status: 200,
          url: `api/movies/${movie.id}`,
        },
        data: movie,
      };
      res.send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  create: async (req, res) => {
    const newMovie = req.body;
    try {
      await db.Movie.create(newMovie);
    } catch (error) {
      res.status(500).send(error);
    }
    const response = {
      meta: {
        status: 200,
        url: `api/movies/create`,
      },
      data: newMovie,
    };
    return res.send(response);
  },

  delete: async (req, res) => {
    let movieToDelete;
    try {
      movieToDelete = await db.Movie.findByPk(req.params.id);
      await db.Movie.destroy({ where: { id: req.params.id } });
    } catch (error) {
      res.status(500).send(error);
    }
    const response = {
      meta: {
        status: 200,
        url: `api/movies/delete/${req.params.id}`,
      },
      deletedMovie: movieToDelete
    };
    return res.send(response);
  }
  
};

module.exports = controller;
