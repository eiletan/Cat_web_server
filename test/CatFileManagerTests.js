const cfm = require("../js/CatFileManager.js");
const ch = require("../js/CatHandler.js");
const fs = require("fs-extra");
const expect = require("chai").expect;
const imagedir = __dirname + "/images";


describe("Cat File Manager Tests", function() {
    this.timeout(60000);
    beforeEach(function () {
        fs.mkdirSync(imagedir);
        console.log("Test images folder created");
    });


    afterEach(function () {
        fs.removeSync(imagedir);
        console.log("Test images folder removed");
    })


    it("Should download images", function() {
        let tcall = ch.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return ch.getImageLinks(blist,"https://api.thecatapi.com/v1/images/search?breed_ids=",2);
        }).then((ilist) => {
            // console.log(ilist);
            let imgobj = ch.processList(ilist);
            expect(ilist.length).to.be.equal(134);
            return cfm.downloadAll(imgobj,imagedir + "\\");
        }).then((res) => {
            console.log("success!");
        }).catch((err) => {
            expect.fail(err);
        });
    })


    it("Should get names of all images", function () {
        let tcall = ch.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return ch.getImageLinks(blist,"https://api.thecatapi.com/v1/images/search?breed_ids=",2);
        }).then((ilist) => {
            // console.log(ilist);
            let imgobj = ch.processList(ilist);
            expect(ilist.length).to.be.equal(134);
            return cfm.downloadAll(imgobj,imagedir + "\\");
        }).then((res) => {
            console.log("success!");
            return cfm.readDirectory(imagedir + "/");
        }).then((res) => {
            console.log(res);
            expect(res.length).to.be.equal(134);
        }).catch((err) => {
            expect.fail(err);
        });
    });

    it("should download, and then remove the files", function() {
        let tcall = ch.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return ch.getImageLinks(blist,"https://api.thecatapi.com/v1/images/search?breed_ids=",2);
        }).then((ilist) => {
            // console.log(ilist);
            let imgobj = ch.processList(ilist);
            expect(ilist.length).to.be.equal(134);
            return cfm.downloadAll(imgobj,imagedir + "\\");
        }).then((res) => {
            console.log("success!");
            return cfm.readDirectory(imagedir + "/");
        }).then((res) => {
            console.log(res);
            expect(res.length).to.be.equal(134);
            return cfm.removeFilesInDirectory(imagedir+"/");
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            expect.fail(err);
        });
    });


    it("should return empty array for an empty directory", function () {
        let tcall = cfm.readDirectory(imagedir + "\\");
        return tcall.then((res) => {
            expect(res.length).to.be.equal(0);
        }).catch((err) => {
            expect.fail(err.message);
        });
    });
})