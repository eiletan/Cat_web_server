const mysql = require("mysql");


// Opens connection and returns it
function openCon() {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "catdatabase"
      });
    return new Promise((resolve,reject) => {
        con.connect(function(err) {
            if (err){
              reject(err);
            } 
            resolve(con);
          });
    });   
}


// Sends the query to the database and returns the results in a JSON Array
function performQuery(con,query){
    let arr;

    if(arguments.length === 3) {
        arr = arguments[2];
        let qp = new Promise((resolve,reject) => {
            con.query(query,arr,(err,result) => {
                if (err) {
                    console.log("Error performing query: " + err);
                    reject(err);
                }
                let resArray = Object.values(JSON.parse(JSON.stringify(result))); 
                resolve(resArray);
            }); 
        });
        return qp;
    }

    let qp = new Promise((resolve,reject) => {
        con.query(query,(err,result) => {
            if (err) {
                console.log("Error performing query: " + err);
                reject(err);
            }
            let resArray = Object.values(JSON.parse(JSON.stringify(result))); 
            resolve(resArray);
        }); 
    });
    return qp;
}


function insertAll(con,bulkcats,isql) {
    let qp = performQuery(con,isql,[bulkcats]);
    return qp;
}

// Inserts every cat image into the database, what is inserted is the path on disk to the image
// Must be called after images are downloaded to disk
// function insertAllImages(con,table) {
//     let qps = [];
//     let keys = Object.keys(imgobj);
//     let values = Object.values(imgobj);
//     for (let i = 0; i < keys.length; i++) {
//         let imgarr = values[i];
//         for (let j = 0; j < imgarr; j++) {
//             let insertsql = "INSERT INTO " +table+ " VALUES ('" + 
//         }
//     }
// }

// Processes the string for SQL syntax, correcting quotation marks
function processString(string) {
    let regx = /’|'/g;
    let processed = string.replace(regx,"''");
    return processed;
}

function reverseProcessString(string) {
    let regx = /''/g;
    let processed = string.replace(regx,"'");
    return processed;
}

// Converts the list of cat objects into a list of list values for a bulk insert statement
function prepareBulkInsert(cats) {
    let ret = [];
    let keys = Object.keys(cats[0]);
    for (let x of cats) {
        let temp = [];
        for (let i = 0; i < keys.length; i++) {
            temp.push(x[keys[i]]);
        }
        ret.push(temp);
    }
    return ret;
}


module.exports.insertAll = insertAll;
module.exports.performQuery = performQuery;
module.exports.processString = processString;
module.exports.reverseProcessString = reverseProcessString;
module.exports.openCon = openCon;
module.exports.prepareBulkInsert = prepareBulkInsert;