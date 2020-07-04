// Sends the query to the database and returns the results in a JSON Array
function performQuery(con,query){
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

// Inserts every cat object into the database
function insertAllCats(con,cats, table) {
    let qps = [];
    for (let c of cats) {
         let insertsql = "INSERT INTO " +table+" (breedID,name,description) SELECT * FROM (SELECT '" +c["breedID"]+  "' as breedID, '" +c["name"] + "' as name, '" +c["description"]+  "' as description) AS tmp " +
         "WHERE NOT EXISTS ( SELECT breedID FROM " +table+  " WHERE breedID = '" +c["breedID"]+ "') LIMIT 1";
         let qp = performQuery(con,insertsql);
         qps.push(qp);
    }
    return Promise.all(qps);
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


module.exports.insertAll = insertAllCats;
module.exports.performQuery = performQuery;
module.exports.processString = processString;
module.exports.reverseProcessString = reverseProcessString;