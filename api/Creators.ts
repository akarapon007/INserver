import  express  from "express";
import { mysql,con,queryAsync } from "../dbcon";
import { ACreators } from "../model/model_Movie";

export const router = express.Router();



router.get("/", (req, res) => {
    con.query('SELECT * FROM ACreators', (err, result, fields) => {
        if (result && result.length > 0) {
            res.json(result);
        } else {
            res.json({
                success: false,
                Error: "Incorrect Select Movie."
            });
        }
    });
});

router.post("/insert", async (req, res) => {
    let creators: ACreators = req.body;
    let CreatorID  : number;
    let sql = mysql.format("select PersonID from APersons where Name = ?",[creators. Personname])
    let result = await queryAsync(sql);
    let jsonStr =  JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    CreatorID = rowData[0].PersonID;

    let MovieID : number;
    sql = mysql.format("select MovieID from AMovies where Title = ?",[creators. Moviename])
     result = await queryAsync(sql);
     jsonStr =  JSON.stringify(result);
     jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    MovieID = rowData[0].MovieID;


    sql = "INSERT INTO `ACreators`(`CreatorID`, `MovieID`) VALUES (?,?)";
    sql = mysql.format(sql, [
        CreatorID,
        MovieID,
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

    let PersonID: number;
    let sql = mysql.format("SELECT PersonID FROM APersons WHERE Name = ?", [person]);
    let result = await queryAsync(sql);
    let rowData = JSON.parse(JSON.stringify(result));
    PersonID = rowData[0].PersonID;

    let MovieID: number;
    sql = mysql.format("SELECT MovieID FROM AMovies WHERE Title = ?", [movie]);
    result = await queryAsync(sql);
    rowData = JSON.parse(JSON.stringify(result));
    MovieID= rowData[0].MovieID;

    con.query("DELETE FROM ACreators WHERE MovieID = ? AND CreatorID = ?", [MovieID, PersonID], (err, result) => {
        if (err) throw err;
        res.status(200).json({ affected_row: result.affectedRows });
    });
});

router.delete("/deletebyid/:mid/:cid", (req, res) => {
    let CreatorID = +req.params.cid;
    let MovieID = +req.params.mid;      

    con.query("DELETE FROM ACreators WHERE MovieID = ? AND CreatorID = ?", [MovieID, CreatorID], (err, result) => {
        if (err) throw err;
        res.status(200).json({ affected_row: result.affectedRows });
    });
});
