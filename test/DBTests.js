const expect = require("chai").expect;
const mysql = require("mysql");
const DBH = require("../js/DBHandler.js");
const CatHandler = require("../js/CatHandler.js");
const imagedir = __dirname + "/images";
const cfm = require("../js/CatFileManager.js");
const fs = require("fs-extra");

var con;

const cname = "testcat";
const img = "testimage"
const ctable = "CREATE TABLE " + cname + " (breedID VARCHAR(255),name VARCHAR(255),description LONGTEXT, PRIMARY KEY (breedID))";
const testimgt = "CREATE TABLE " + img + " (breedID VARCHAR(255),imgpath VARCHAR(255), FOREIGN KEY (breedID) REFERENCES testcat(breedID) ON UPDATE CASCADE ON DELETE CASCADE)";



describe.skip("Database tests", function () {
    this.timeout(60000);
    // Connects to the database before the test suite runs
    before(function (done) {
        con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "testdb"
        });

        con.connect(function (err) {
            if (err) {
                throw err;
            }
            console.log("Connected!");
            done();
        });
    });

    // Closes the connection after the tests are done
    after(function (done) {
        con.end(function (err) {
            if (err) {
                return console.log('Error:' + err.message);
            }
            console.log('Database connection closed.');
            done();
        });
    });

    // Creates the test table before each test
    beforeEach(function (done) {
        con.query(ctable, function (err, result) {
            if (err) {
                throw err;
            }
            console.log("Test table created");
            con.query(testimgt, function (err,result) {
                if (err) {
                    throw err;
                }
                console.log("2nd table created");
                done();
            });
        });
    });

    // Deletes the test table after each test
    afterEach(function (done) {
        con.query("DROP TABLE " + img, function (err, result) {
            if (err) {
                throw err;
            }
            console.log("Test table dropped");
            con.query("DROP TABLE " + cname, function (err,result) {
                if (err) {
                    throw err;
                }
                console.log("test table 2 dropped");
                done();
            })
        });
    });

    it("Should insert", function () {
        let testcat = {
            breedID: "acur",
            name: "American Curl",
            description: "American Curl cat"
        };
        let ssql = "SELECT * FROM " + cname;
        let isql = "INSERT INTO " + cname + " VALUES('" + testcat["breedID"] + "', '" + testcat["name"] + "', '" + testcat["description"] + "')";
        qp = DBH.performQuery(con, isql);

        let sp = DBH.performQuery(con, ssql);
        return qp.then((res) => {
            return sp;
        }).then((res) => {
            let resultArray = Object.values(JSON.parse(JSON.stringify(res)));
            expect(resultArray[0]).to.deep.equal(testcat);
        }).catch((err) => {
            expect.fail(err);
        });
    });


    it("Should insert, and then delete", function () {
        let testcat = {
            breedID: "abob",
            name: "American Bobtail",
            description: "American Bobtail cat"
        };
        let ssql = "SELECT * FROM " + cname;
        let isql = "INSERT INTO " + cname + " VALUES('" + testcat["breedID"] + "', '" + testcat["name"] + "', '" + testcat["description"] + "')";
        let dsql = "DELETE FROM " + cname + " WHERE breedID = 'abob'"
        qp = DBH.performQuery(con, isql);

        let sp = DBH.performQuery(con, ssql);
        return qp.then((res) => {
            return sp;
        }).then((res) => {
            let resultArray = Object.values(JSON.parse(JSON.stringify(res)));
            expect(resultArray[0]).to.deep.equal(testcat);
            return DBH.performQuery(con, dsql);
        }).then((res) => {
            return DBH.performQuery(con, ssql);
        }).then((res) => {
            expect(res.length).to.be.equal(0);
        }).catch((err) => {
            expect.fail(err);
        });
    });

    it("Should not delete", function () {
        let testcat = {
            breedID: "acur",
            name: "American Curl",
            description: "American Curl cat"
        };
        let dsql = "DELETE FROM " + cname + " WHERE breedID = 'abob'"
        qp = DBH.performQuery(con, dsql);

        return qp.then((res) => {
            expect.fail("Should not have resolved");
        }).catch((err) => {
            expect(typeof err == "error");
        });
    });

    it ("should return list of all cat objects,prepped for bulk insert",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.initAllBreeds("https://api.thecatapi.com/v1/images/search?breed_ids=",blist,["description","name"]);
        }).then((list) => {
            expect(list.length).to.be.equal(67);
            return DBH.prepareBulkInsert(list);
        }).then((list) => {
            console.log(list);
        }).catch((err) => {
            expect.fail(err);
        })
    });

    it ("should batch insert",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.initAllBreeds("https://api.thecatapi.com/v1/images/search?breed_ids=",blist,["name","description"]);
        }).then((list) => {
            expect(list.length).to.be.equal(67);
            return DBH.prepareBulkInsert(list);
        }).then((list) => {
            let isql = "INSERT INTO testcat" +
            " VALUES ? as tc ON DUPLICATE KEY UPDATE description = tc.description, name = tc.name;"
            return DBH.insertAll(con,list,isql);
        }).then((res) => {
            console.log("done");
        }).catch((err) => {
            expect.fail(err);
        })
    });

    it ("should batch insert, then leave the first one alone, and update the second one",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        let lall;
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.initAllBreeds("https://api.thecatapi.com/v1/images/search?breed_ids=",blist,["name","description"]);
        }).then((list) => {
            expect(list.length).to.be.equal(67);
            return DBH.prepareBulkInsert(list);
        }).then((list) => {
            lall = list;
            let isql = "INSERT INTO testcat" +
            " VALUES ? as tc ON DUPLICATE KEY UPDATE description = tc.description, name = tc.name;"
            return DBH.insertAll(con,list,isql);
        }).then((res) => {
            lall[1][1] = "yeehaw";
            let newl = [lall[0],lall[1]];
            return DBH.prepareBulkInsert(newl);
        }).then((list) => {
            let isql = "INSERT INTO testcat" +
            " VALUES ? as tc ON DUPLICATE KEY UPDATE description = tc.description, name = tc.name;"
            return DBH.insertAll(con,list,isql);
        }).then((res) => {
            console.log("success");
        }).catch((err) => {
            expect.fail(err);
        })
    });

    it ("should batch insert, and the insert image paths",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        let lall;
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.initAllBreeds("https://api.thecatapi.com/v1/images/search?breed_ids=",blist,["name","description"]);
        }).then((list) => {
            expect(list.length).to.be.equal(67);
            return DBH.prepareBulkInsert(list);
        }).then((list) => {
            lall = list;
            let isql = "INSERT INTO testcat" +
            " VALUES ? as tc ON DUPLICATE KEY UPDATE description = tc.description, name = tc.name;"
            return DBH.insertAll(con,list,isql);
        }).then((res) => {
            lall[1][1] = "yeehaw";
            let newl = [lall[0],lall[1]];
            return DBH.prepareBulkInsert(newl);
        }).then((list) => {
            let isql = "INSERT INTO testcat" +
            " VALUES ? as tc ON DUPLICATE KEY UPDATE description = tc.description, name = tc.name;"
            return DBH.insertAll(con,list,isql);
        }).then((res) => {
            console.log("success");
            fs.mkdirSync(imagedir);
            let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
            return tcall;
        }).then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.getImageLinks(blist,"https://api.thecatapi.com/v1/images/search?breed_ids=",2);
        }).then((ilist) => {
            // console.log(ilist);
            let imgobj = CatHandler.processList(ilist);
            expect(ilist.length).to.be.equal(134);
            return cfm.downloadAll(imgobj,imagedir + "\\");
        }).then((res) => {
            let isql = "INSERT INTO " + img + " VALUES ?";
            return DBH.insertAll(con,res,isql);
        }).then((res) => {
            console.log("success!");
            fs.removeSync(imagedir);
        }).catch((err) => {
            fs.removeSync(imagedir);
            expect.fail(err);
        }).catch((err) => {
            expect.fail(err);
        })
    });
    

});
