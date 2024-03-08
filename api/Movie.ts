import express from "express";
import { mysql, con, queryAsync } from "../dbcon";
import { AMovies} from "../model/model_Movie"; // นำเข้า MovieGet จากโมเดล

export const router = express.Router();


router.get("/",(req,res)=>{
    con.query('select * from AMovies',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

router.get("/:moviename",(req,res)=>{
    const name = req.params.moviename;
    con.query('select * from AMovies where Title = ?',[name],(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

router.post("/insert", (req, res) => {
  let movies: AMovies = req.body; // ใช้ req.body ในการรับข้อมูล
  let sql =
    "INSERT INTO `AMovies`(`Title`, `ReleaseYear`, `Genre`, `plot`) VALUES (?,?,?,?)";
  sql = mysql.format(sql, [
      movies.Title,
      movies.ReleaseYear,
      movies.Genre,
      movies.plot,
  ]);
  con.query(sql, (err, result) => {
      if (err) throw err;
      res
          .status(201)
          .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

router.delete("/delete/:moviename", async (req, res) => {
  const movie = req.params.moviename;
  let movieid : number;
  let sql = mysql.format("select MovieID from AMovies where Title = ?",[movie])
  let result = await queryAsync(sql);
  const jsonStr =  JSON.stringify(result);
  const jsonobj = JSON.parse(jsonStr);
  const rowData = jsonobj;
  movieid = rowData[0].MovieID;
  con.query("delete from AMovies where MovieID = ?", [movieid], (err, result) => {
      if (err) throw err;
      res
        .status(200)
        .json({ affected_row: result.affectedRows });
   });
});

  router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id;
    con.query("delete from AMovies where MovieID = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });
  
