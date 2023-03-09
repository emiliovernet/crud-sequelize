const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const moviesController = require("../controllers/moviesController");

const createMovieValidator = [
  body("title")
  .isString().withMessage("El campo título debe ser un string")
    .notEmpty().withMessage("El campo título es requerido"),
  body("rating")
    .notEmpty().withMessage("El campo rating es requerido")
    .isNumeric().withMessage("El campo rating debe ser un numero entero"),
  body("awards")
    .notEmpty().withMessage("El campo awards es requerido")
    .isNumeric().withMessage("El campo awards debe ser un numero entero"),
  body("release_date")
    .notEmpty().withMessage("El campo date es requerido")
    .isDate({ delimiters: ["/", "-"] }).withMessage("El campo date debe ser una fecha"),
  body("length")
    .notEmpty().withMessage("El campo length es requerido")
    .isNumeric().withMessage("El campo length debe ser un numero entero"),
];

router.get("/movies", moviesController.list);
router.get("/movies/new", moviesController.new);
router.get("/movies/recommended", moviesController.recomended);
router.get("/movies/detail/:id", moviesController.detail);
router.get("/movies/add", moviesController.add);
router.post('/movies', createMovieValidator, moviesController.create);
router.get('/movies/edit/:id', moviesController.edit);
router.put('/movies/:id', createMovieValidator, moviesController.update);
router.get('/movies/delete/:id', moviesController.delete);
router.delete('/movies/delete/:id', moviesController.destroy);

module.exports = router;
