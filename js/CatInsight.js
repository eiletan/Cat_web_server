const caller = require("./caller.js");
const parser = require("./parser.js");
const mysql = require("mysql");
const CFM = require("./CatFileManager");
const CH = require("./CatHandler.js");
const DBH = require("./DBHandler.js");

export default class CatInsight {
    breedsforimg;
    cats;
    catimgs;
    constructor() {
        this.breedsforimg = null;
        this.cats = null;
        this.catimgs = null;
    }

    // If the database cannot be connected to for any reason, then the cats are stored in memory
    // aurlall is the url for getting all breeds, aurlind is the url for individual cats, and info is an array 
    // which contains all the descriptors for the cat object
    getCats(aurlall, aurlind, info) {
        let con;
        let breedsimg;
        return new Promise ((resolve,reject) => {
            CH.initializeBreedList(aurlall).then((breeds) => {
                breedsimg = breeds;
                return CH.initAllBreeds(aurlind,breeds,info);
            }).catch((err) => {
                reject(err);
            }).then((allcats) => {
                this.cats = allcats;
                return CH.getImageLinks();
            }).then((ilist) => {

            }).catch((err) => {
            })
        })
    }
}