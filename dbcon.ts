import mysql from "mysql";
import util from "util";
export const con = mysql.createPool(
    {
        connectionLimit : 10,
        host:"202.28.34.197",
        user: "web66_65011212237",
        password:"65011212237@csmsu",
        database:"web66_65011212237"
    }
);

export const queryAsync = util.promisify(con.query).bind(con);
export { mysql };
