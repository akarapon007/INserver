import express from "express";
import {con, mysql, queryAsync} from "../dbcon";
import { AStars } from "../model/model_Movie";
export const router = express.Router();

router.get("/",(req,res)=>{
    con.query('select * from stars',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Stars."
            });
        }
    });
});

router.post("/insert", async (req, res) => {
    let person: AStars = req.body;
    let Pid : number;
    let sql = mysql.format("select PersonID from APersons where Name = ?",[person.Personname])
    let result = await queryAsync(sql);
    let jsonStr =  JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    Pid = rowData[0].PersonID;

    let Mid : number;
    sql = mysql.format("select MovieID from AMovies where Title = ?",[person.Moviename])
     result = await queryAsync(sql);
     jsonStr =  JSON.stringify(result);
     jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    Mid = rowData[0].MovieID;


    sql = "INSERT INTO `AStars`(`MovieID`, `PersonID`) VALUES (?,?)";
    sql = mysql.format(sql, [
      Mid,
        Pid,
    ]);
    con.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.delete("/delete/:person/:movie", async (req, res) => {
    const person = req.params.person;
    const movie = req.params.movie;

    let Pid : number;
    let sql = mysql.format("select PersonID from APersons where Name = ?",[person])
    let result = await queryAsync(sql);
    let jsonStr =  JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    Pid= rowData[0].PersonID;

    let Mid : number;
    sql = mysql.format("select MovieID from AMovies where Title = ?",[movie])
    result = await queryAsync(sql);
    jsonStr =  JSON.stringify(result);
    jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    Mid = rowData[0].MovieID;

    con.query("delete from AStars where MovieID = ? and PersonID = ?", [Mid,Pid], (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ affected_row: result.affectedRows });
     });
  });

  router.delete("/deletebyid/:PersonID/:MovieID", (req, res) => {
    let pid = +req.params.PersonID;
    let mid = +req.params.MovieID;
    con.query("delete from AStars where MovieID = ? and PersonID = ?", [mid,pid], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });