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


module.exports.performQuery = performQuery;