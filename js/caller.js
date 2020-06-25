require("dotenv").config();


var timeoutlength = 10000;


// Returns the JSON response of the API
function callAPI(AURL) {
    let https = require("https");
    let key = process.env.API_KEY;
    let url = AURL + "&api_key=" + key;
    const options = {timeout: timeoutlength};
    return new Promise((resolve, reject) => {
        // From the node js https documentation
        let request = https.get(url,options,(resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });


            resp.on('end', () => {
                let rep = JSON.parse(data);
                resolve(rep);
            });

        }).on("error", (err) => {
            console.log(err.message);
            reject(err);
        });

        request.setTimeout(timeoutlength,() =>{
            var e = new Error("Error: Request timed out as it took over " + timeoutlength/1000 + " seconds to resolve.");
            request.destroy(e);
        })

    });
}


module.exports.callAPI = callAPI;