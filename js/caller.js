require("dotenv").config();



// Returns the JSON response of the API
function callAPI(AURL) {
    let https = require("https");
    let key = process.env.API_KEY;
    let url = AURL + "&api_key=" + key;
    return new Promise ((resolve, reject) => {
        // From the node js https documentation
        https.get(url, (resp) => {
            let data = '';

  
            resp.on('data', (chunk) => {
                data += chunk;
            });


            resp.on('end', () => {
                let rep = JSON.parse(data);
                resolve(rep);
            });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                reject(err);
            });
    });
}


module.exports.callAPI = callAPI;