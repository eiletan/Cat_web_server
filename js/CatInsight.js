const caller = require("./caller.js");
const parser = require("./parser.js");
const mysql = require("mysql");
const CFM = require("./CatFileManager");
const CH = require("./CatHandler.js");
const DBH = require("./DBHandler.js");
const path = require("path");

class CatInsight {

    constructor() {
        this.memcats = [];
        this.memcatimgs = {};
        this.AURLobj = {
                breedsall: "https://api.thecatapi.com/v1/breeds?",
                cat: "https://api.thecatapi.com/v1/images/search?breed_ids="
            }
        this.initstrings = ["name", "description"];
        this.dir = path.join(__dirname,"../");
    }


    updateCatInfo(num) {
        let catbidscall = CH.initializeBreedList(this.AURLobj["breedsall"]);
        let blist;
        let promise = new Promise((resolve,reject) => {
            catbidscall.then((resultlist) => {
                blist = resultlist;
                let initcatscall = CH.initAllBreeds(this.AURLobj["cat"], resultlist, this.initstrings);
                return initcatscall;
            }).then((res) => {
                this.memcats = res;
                return this.updateCatImages(this.AURLobj, blist, num);
            }).then((res) => {
                console.log("done updating!");
                resolve();
            }).catch((err) => {
                console.log(err.message);
                reject();
            });
        });
       return promise;     
    }

    updateCatImages(AURLObj, list, num) {
        return new Promise((resolve, reject) => {
            CH.getImageLinks(list, AURLObj["cat"], num).then((imagelist) => {
                let imgobj = CH.processList(imagelist);
                CFM.clearDir(this.dir+"\\public\\images");
                return CFM.downloadAll(imgobj, this.dir, "\\public\\images" + "\\");
            }).then((imagepaths) => {
                this.memcatimgs = CH.processDownloaded(imagepaths);
                resolve();
            }).catch((err) => {
                console.log(err.message);
                reject(err);
            });
        });
    }

    chooseCat() {
        try {
        let n = this.memcats.length;
        let num = Math.floor(Math.random()*n);
        let cat = this.memcats[num];
        let bid = cat["breedID"];
        let n2 = this.memcatimgs[bid].length;
        let num2 = Math.floor(Math.random()*n2);
        let ret = {};
        ret["breedID"] = bid;
        ret["name"] = cat["name"];
        ret["description"] = cat["description"];
        ret["image"] = this.memcatimgs[bid][num2];
        for (let key in ret) {
            if (ret[key] === null || ret[key === undefined]) {
                throw new Error();
            }
        }
        return ret;
        } catch (err) {
            return null;
        }
    }
}

module.exports.CatInsight = CatInsight;