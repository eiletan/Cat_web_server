let caller = require("./caller.js");
let parser = require("./parser.js");


function initializeBreedList(AURL) {
    let callpromise = caller.callAPI(AURL);
    return new Promise((resolve,reject) => {
        callpromise.then((res) => {
            let brl = getBreeds(res);
            resolve(brl);
        }).catch((e) => {
            reject(e);
        });
    });
    
}

function getBreeds(catson) {
    let breedlist = [];
    if (!Array.isArray(catson)) {
        var e = new Error("Error: Received json is not an array");
        console.log(e.message);
        throw e;
    } else {
        for(let c of catson) {
            let id = parser.searchJSON(c,"id");
            breedlist.push(id);
        }
    }
    return breedlist;
}

module.exports.initializeBreedList = initializeBreedList;