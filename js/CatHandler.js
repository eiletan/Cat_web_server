const caller = require("./caller.js");
const parser = require("./parser.js");
const CF = require("./CatFactory.js");


function initializeBreedList(AURL) {
    let callpromise = caller.callAPI(AURL);
    return new Promise((resolve, reject) => {
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
        for (let c of catson) {
            let id = parser.searchJSON(c, "id");
            breedlist.push(id);
        }
    }
    return breedlist;
}


// Returns a JSON object which has image links of each cat breed
function getImageLinks(breeds, AURL, num) {
    let promises = [];
    for (let x of breeds) {
        for (let i = 0; i < num; i++) {
            promises.push(getImage(AURL, x));
        }
    }
    return Promise.all(promises);
}

function getImagePaths() {
    
}

// Helper function to get the link of the image of one specified breed
// If unable to call the api or an error occurs for some reason, the promise is resolved with null
function getImage(AURL, breed) {
    return new Promise((resolve, reject) => {
        caller.callAPI(AURL + breed).then((res) => {
            return parser.searchJSON(res, "url");
        }).then((url) => {
            let imgobj = {};
            imgobj[breed] = url;
            resolve(imgobj);
        }).catch((err) => {
            resolve(null);
        })
    });
}

// Processes the image list to make it slightly more space efficient
function processList(ilist) {
    let probj = {};
    let temp = "";
    for (let x of ilist) {
        let key = Object.keys(x)[0];
        if (temp === key) {
            if (!Array.isArray(probj[key])) {
                probj[key] = [Object.values(x)[0]];
            } else {
                probj[key].push(Object.values(x)[0]);
            }
        } else {
            probj[key] = [Object.values(x)[0]];
            temp = key;
        }
    }
    return probj;
}

// Creates a cat object for every breed, an array of these objects is returned
function initAllBreeds(AURL,breeds,initstrings) {
    let initp = [];
    for (let c of breeds) {
        initp.push(CF.initializeCat(AURL,c,initstrings));
    }
    return Promise.all(initp);
}

// Processes the list of cats to make it easily searchable by breedID
function processCats(cats) {
    let ret = {};
    for (let x of cats) {
        let key = Object.keys(x)[0];
        ret[x[key]] = x;
    }
    return ret;
}

function processDownloaded(arr) {
    let ret = {};
    for(let val of arr) {
        ret[val[0]] = val[1];
    }
    return ret;
}

module.exports.initializeBreedList = initializeBreedList;
module.exports.getImageLinks = getImageLinks;
module.exports.processList = processList;
module.exports.initAllBreeds = initAllBreeds;
module.exports.processCats = processCats;
module.exports.processDownloaded = processDownloaded;