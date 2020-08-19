const caller = require("./caller.js");
const parser = require("./parser.js");
const mysql = require("mysql");
const CFM = require("./CatFileManager");
const CH = require("./CatHandler.js");
const DBH = require("./DBHandler.js");

class CatInsight {
    AURLobj;
    initstrings;
    dir;
    memcats;
    memcatimgs;
    constructor(AURLObj, initstrings,dir) {
        this.AURLobj = AURLObj;
        this.initstrings = initstrings;
        this.dir = dir;
    }

    // If the database cannot be connected to for any reason, then the cats are stored in memory
    // aurlall is the url for getting all breeds, aurlind is the url for individual cats, and info is an array 
    // which contains all the descriptors for the cat object
    updateCatInfo(num) {
        let catbidscall = CH.initializeBreedList(this.AURLobj["breedsall"]);
        let catsinsertion;
        let cat;
        let blist;
        let con;
            catbidscall.then((resultlist) => {
                blist = resultlist;
                let initcatscall = CH.initAllBreeds(this.AURLobj["cat"], resultlist, this.initstrings);
                return initcatscall;
            }).then((res) => {
                this.memcats = res;
                cat = res;
                return DBH.prepareBulkInsert(res);
            }).then((icats) => {
                catsinsertion = icats;
                let getcon = DBH.openCon();
                return getcon;
            }).then((conn) => {
                con = conn;
                let isql = "INSERT INTO cat" +
                    " VALUES ? as c ON DUPLICATE KEY UPDATE description = c.description, name = c.name;"
                let dbinsert = DBH.insertAll(con, catsinsertion, isql);
                return dbinsert;
            }).then((res) => {
                console.log("done inserting!");
                return this.updateCatImages(this.AURLobj, blist, num, con);
            }).then((res) => {
                console.log("updating done");
            }).catch((err) => {
                console.log(err.message);
                
            });
    }

    updateCatImages(AURLObj, list, num, con) {
        let imgpaths;
        return new Promise((resolve, reject) => {
            CH.getImageLinks(list, AURLObj["cat"], num).then((imagelist) => {
                let imgobj = CH.processList(imagelist);
                CFM.clearDir(this.dir+"\\images");
                return CFM.downloadAll(imgobj, this.dir, "\\images" + "\\");
            }).then((imagepaths) => {
                this.memcatimgs = CH.processDownloaded(imagepaths);
                imgpaths = imagepaths;
                let delsql1 = "SET SQL_SAFE_UPDATES=0";
                return DBH.performQuery(con, delsql1);
            }).then((res) => {
                let delsql = "delete from catimage";
                return DBH.performQuery(con, delsql);
            }).then((res) => {
                let delsql2 = "SET SQL_SAFE_UPDATES=1";
                return DBH.performQuery(con, delsql2);
            }).then((res) => {
                let isql = "INSERT INTO catimage VALUES ?";
                return DBH.insertAll(con, imgpaths, isql);
            }).then((res) => {
                console.log("inserted and downloaded!");
                resolve();
            }).catch((err) => {
                con.query("SET SQL_SAFE_UPDATES=1", function (errorr, result, fields) {
                    if (error) {
                        console.log(error);
                    }
                    reject(err);
                });
            });
        });
    }
}

module.exports.CatInsight = CatInsight;