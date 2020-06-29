const expect = require("chai").expect;
const mysql = require("mysql");
const DBH = require("../js/DBHandler.js");

var con;

const cname = "testcat";
const ctable = "CREATE TABLE " + cname +" (breedID VARCHAR(255),name VARCHAR(255),description VARCHAR(255))";



describe("Database tests", function () {
    // Connects to the database and creates the tables before the test suite runs
before(function (done) {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "testdb"
    });
    
    con.connect(function(err) {
        if (err) {
            throw err;
        }
        console.log("Connected!");
        con.query(ctable, function (err, result) {
          if (err) throw err;
          console.log("Test table created");
          done();
        });
      });
});

// Closes the connection and wipe the table after the tests are done
after(function (done) {

    con.query("DROP TABLE " + cname, function(err, result) {
        if (err) {
            throw err;
        }
        console.log("Test table dropped");
        con.end(function(err) {
            if (err) {
              return console.log('Error:' + err.message);
            }
            console.log('Database connection closed.');
            done();
          });
    });  
});
    it("Should insert", function() {
        let testcat = {
            breedID: "acur",
            name: "American Curl",
            description: "American Curl cat"
        };
        let ssql = "SELECT * FROM " + cname;
        let isql = "INSERT INTO " + cname + " VALUES('" + testcat["breedID"] + "', '" + testcat["name"] + "', '" + testcat["description"] + "')";
        qp = DBH.performQuery(con,isql);

        let sp = DBH.performQuery(con,ssql);
        return qp.then((res) => {
            return sp;
        }).then((res) => {
            let resultArray = Object.values(JSON.parse(JSON.stringify(res)));
            expect(resultArray[0]).to.deep.equal(testcat);
        }).catch((err) => {
            expect.fail(err);
        });
    });
});
