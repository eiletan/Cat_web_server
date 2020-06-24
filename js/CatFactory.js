let parser = require("./parser.js");
let caller = require("./caller.js");

function initializeCat(AURL,breedID, initstrings){
    return new Promise((resolve,reject) => {
        let speccat = caller.callAPI(AURL+breedID);
        let cat = {};
        speccat.then((res) => {
            for(let x of initstrings) {
                let stringres = parser.searchJSON(res,x);
                if (stringres != null) {
                    cat[x] = stringres;
                }
                else {
                    var e = new Error("Error: Cat data is incomplete, please try again.");
                    console.log(e.message);
                    throw e;
                }
            }
        resolve(cat);     
        }).catch((e) => {
            console.log("Error when calling API: " + e.message)
            reject(e);
        });
    });
}

module.exports.initializeCat = initializeCat;