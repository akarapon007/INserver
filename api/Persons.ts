import express from "express";
import {con, mysql, queryAsync} from "../dbcon";
import { APersons } from "../model/model_Movie";
export const router = express.Router();

router.get("/",(req,res)=>{
    con.query('select * from APersons',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Person."
            });
        }
    });
});

router.get("/:Name",(req,res)=>{
    const Name = req.params.Name;
    con.query('select * from APersons where Name = ?',[Name],(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Person."
            });
        }
    });
});

router.post("/insert", (req, res) => {
    let person: APersons = req.body;
    let sql =
      "INSERT INTO `APersons`(`Name`, `Birthdate`, `Nationality`) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        person.Name,
        person.Birthdate,
        person.Nationality,
    ]);
    con.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.delete("/delete/:person", async (req, res) => {
    const person = req.params.person;
    let PersonID : number;
    let sql = mysql.format("select PersonID from APersons where Name = ?",[person])
    let result = await queryAsync(sql);
    const jsonStr =  JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    PersonID = rowData[0].PersonID;
    con.query("delete from APersons where PersonID = ?", [PersonID], (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ affected_row: result.affectedRows });
     });
  });

  router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id;
    con.query("delete from APerson where PersonID = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });