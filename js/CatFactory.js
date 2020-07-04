const parser = require("./parser.js");
const caller = require("./caller.js");
const DBH = require("./DBHandler.js");

function initializeCat(AURL,breedID, initstrings){
    return new Promise((resolve,reject) => {
        let speccat = caller.callAPI(AURL+breedID);
        let cat = {};
        cat["breedID"] = breedID;
        speccat.then((res) => {
            for(let x of initstrings) {
                let stringres = parser.searchJSON(res,x);
                if (stringres != null) {
                    let procstring = DBH.processString(stringres);
                    cat[x] = procstring;
                }
                else {
                    var e = new Error("Error: Cat data is incomplete. Possibly bad URL or keys");
                    console.log(e.message);
                    throw e;
                }
            }
        resolve(cat);     
        }).catch((e) => {
            reject(e);
        });
    });
}

module.exports.initializeCat = initializeCat;