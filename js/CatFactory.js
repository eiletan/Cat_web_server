let parser = require("./parser.js");
let caller = require("./caller.js");

function initializeCat(AURL,breedID, initstrings){
    return new Promise((resolve,reject) => {
        let speccat = caller.callAPI(AURL+breedID);
        let cat = {};
        speccat.then((res) => {
            for(let x of initstrings) {
                let stringres = parser.searchJSON(res,x);
                if (stringres != undefined) {
                    cat[x] = stringres;
                }
            }
        resolve(cat);     
        }).catch((e) => {
            reject(e);
        });
    });
}

module.exports.initializeCat = initializeCat;