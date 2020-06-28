const expect = require("chai").expect;
const mysql = require("mysql");

var con;

const cname = "testcat";
const ctable = "CREATE TABLE " + cname +" (breedID VARCHAR(255),name VARCHAR(255),description VARCHAR(255),url VARCHAR(255))";



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
})

// Closes the connection and wipe the table after the tests are done
after(function (done) {

    con.query("DROP TABLE " + cname, function(err, result) {
        if (err) {
            throw err;
        }
        con.end(function(err) {
            if (err) {
              return console.log('Error:' + err.message);
            }
            console.log('Database connection closed.');
            done();
          });
    });

    
})
    it("Should insert", function() {
        console.log("hi");
    })
});
