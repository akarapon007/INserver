import express from "express";
export const app = express();

import { router as Movie } from "./api/Movie";
import { router as Creators } from "./api/Creators";
import { router as Person} from "./api/Persons";
import { router as AStars } from "./api/Stars";
import { router as search } from "./api/searchmovie";
app.use(express.json());
app.use("/person", Person);
app.use("/stars", AStars);
app.use("/movies", Movie);
app.use("/creators", Creators);
app.use("/search", search);
