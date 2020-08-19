const caller = require("./js/caller.js");
const parser = require("./js/parser.js");
const CFM = require("./js/CatFileManager");
const DBH = require("./js/DBHandler.js");
const CH = require("./js/CatHandler.js");
const CF = require("./js/CatFactory.js");
const CI = require("./js/CatInsight.js");
const CatInsight = CI.CatInsight;

var updateCats;



const AURLObj = {
    breedsall: "https://api.thecatapi.com/v1/breeds?",
    cat: "https://api.thecatapi.com/v1/images/search?breed_ids="
}

const initstrings = ["name", "description"];

let cati = new CatInsight(AURLObj,initstrings,__dirname);
cati.updateCatInfo(2);