import { Router } from "express";
import {
  getAllMovies,
  getMoviesId,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controllers";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getAllMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
