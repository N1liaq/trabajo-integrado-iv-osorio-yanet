import { Movie } from "../models/movie.models.js";
import { Op } from "sequelize";

// ─── GET /api/movies ───────────────────────────────────────────────────────────
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll(); // 🔧 FIX: era "movie" (minúscula), debe ser "Movie"
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener las películas." });
  }
};

// ─── GET /api/movies/:id ───────────────────────────────────────────────────────
export const getMoviesId = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res
        .status(404)
        .json({ error: `No se encontró una película con el id ${id}.` });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener la película." });
  }
};

// ─── Función auxiliar de validación ───────────────────────────────────────────
// 🔧 FIX: el "}" de cierre estaba después de "const currentYear",
//         por eso todos los "if" y el "return null" quedaban fuera de la función.
//         Ahora el cierre "}" está al final, después del return null.
const validateMovieFields = (body) => {
  const { title, genre, duration, year, synopsis } = body;
  const currentYear = new Date().getFullYear();

  if (!title || !genre || duration === undefined || year === undefined) {
    return "Los campos title, genre, duration y year son obligatorios.";
  }

  if (typeof title !== "string" || title.trim() === "") {
    return "El campo title debe ser una cadena de texto no vacía.";
  }

  if (typeof genre !== "string" || genre.trim() === "") {
    return "El campo genre debe ser una cadena de texto no vacía.";
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    return "El campo duration debe ser un número entero positivo mayor a cero. No se aceptan decimales, strings ni valores negativos.";
  }

  if (!Number.isInteger(year) || year < 1888 || year > currentYear) {
    return `El campo year debe ser un número entero entre 1888 y ${currentYear}. No se aceptan strings ni valores fuera de ese rango.`;
  }

  if (synopsis !== undefined && typeof synopsis !== "string") {
    return "El campo synopsis debe ser una cadena de texto.";
  }

  return null;
}; // ← el cierre de validateMovieFields va acá, después del return null

// ─── POST /api/movies ──────────────────────────────────────────────────────────
export const createMovie = async (req, res) => {
  try {
    const { title, genre, duration, year, synopsis } = req.body;

    const validationError = validateMovieFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existingMovie = await Movie.findOne({
      where: { title: title.trim() },
    });
    if (existingMovie) {
      return res.status(400).json({
        error: `Ya existe una película registrada con el título "${title.trim()}".`,
      });
    }

    const newMovie = await Movie.create({
      title: title.trim(),
      genre: genre.trim(),
      duration,
      year,
      synopsis: synopsis ? synopsis.trim() : null,
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: "Error interno al crear la película." });
  }
};

// ─── PUT /api/movies/:id ───────────────────────────────────────────────────────
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, duration, year, synopsis } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res
        .status(404)
        .json({ error: `No se encontró una película con el id ${id}.` });
    }

    const validationError = validateMovieFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const existingMovie = await Movie.findOne({
      where: {
        title: title.trim(),
        id: { [Op.ne]: id },
      },
    });
    if (existingMovie) {
      return res.status(400).json({
        error: `Ya existe una película registrada con el título "${title.trim()}".`,
      });
    }

    await movie.update({
      title: title.trim(),
      genre: genre.trim(),
      duration,
      year,
      synopsis: synopsis ? synopsis.trim() : null,
    });

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Error interno al actualizar la película." });
  }
};

// ─── DELETE /api/movies/:id ────────────────────────────────────────────────────
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res
        .status(404)
        .json({ error: `No se encontró una película con el id ${id}.` });
    }

    await movie.destroy();
    res
      .status(200)
      .json({ message: `Película con id ${id} eliminada correctamente.` });
  } catch (error) {
    res.status(500).json({ error: "Error interno al eliminar la película." });
  }
};
