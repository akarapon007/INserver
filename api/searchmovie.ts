import express from "express";
import {con, mysql, queryAsync} from "../dbcon";
export const router = express.Router();

router.get("/", (req, res) => {
    const title = `%${req.query.title}%`;
    const sql = `
        SELECT
        AMovies.MovieID,
        AMovies.Title AS movie_title,
        AMovies.ReleaseYear AS movie_year,
        AMovies.Genre AS movie_genre,
    AMovies.plot AS movie_plot,
        AStars.PersonID AS star_id,
        stars.Name AS star_name,
        stars.Birthdate AS star_birthdate,
        stars.Nationality AS star_nationality,
        ACreators.CreatorID AS creators_id,
    creators.Name AS creators_name,
    creators.Birthdate AS creatosrs_birthdate,
    creators.Nationality AS creators_nationally
    FROM AMovies , AStars , APersons AS stars , ACreators, APersons  AS creators
    WHERE AMovies.MovieID = AStars.MovieID
    AND AStars.PersonID = stars.PersonID
    AND AMovies.MovieID = ACreators.MovieID
    AND ACreators.CreatorID = creators.PersonID
    AND AMovies.Title LIKE?
    `;
    
    con.query(sql, [title], (err, results: any[], fields) => {
        if (err) throw err;

        
        const moviesMap = new Map<number, any>();

        results.forEach((row: any) => {
            const movieId = row.mid;

            if (!moviesMap.has(movieId)) {
                moviesMap.set(movieId, {
                    movie_id: row.mid,
                    movie_title: row.movie_title,
                    movies_plot : row.movie_plot,
                    movies_rating : row.movie_rating,
                    movies_year : row.movie_year,
                    movies_genre : row.movie_genre,
                    actors: [],
                    creators: [],
                });
            }

            const movie = moviesMap.get(movieId);

            const star = {
                star_id: row.star_id,
                star_name: row.star_name,
                star_born: row.starr_born,
                star_bio: row.star_bio,
            };

            const creator = {
                creator_id: row.creator_id,
                creator_name: row.creator_name,
                creator_born: row.creator_born,
                creator_bio: row.creator_bio,
            };

            // เพิ่มเช็คว่านักแสดงหรือผู้กำกับซ้ำหรือไม่
            if (!movie.actors.find((a: any) => a.star_id === star.star_id)) {
                movie.actors.push(star);
            }

            if (!movie.creators.find((c: any) => c.creator_id === creator.creator_id)) {
                movie.creators.push(creator);
            }
        });

        const jsonData =  { movie :  Array.from(moviesMap.values())};
        res.json(jsonData);
    });
});