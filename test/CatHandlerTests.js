const CatHandler = require("../js/CatHandler.js");
const expect = require("chai").expect;


describe("Cat Handler Tests", function() {
    this.timeout(60000);
    it("should return list of cat breeds",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?"); 
        return tcall.then((res) => {
            expect(res.length).to.be.equal(67);
        }).catch((err) => {
            expect.fail(err);
        })
    });

    it("should not return list of cat breeds",function() {
        let tcall = CatHandler.initializeBreedList("no");
        return tcall.then((res) => {
            expect.fail("Should not have resolved");
        }).catch((err) => {
            expect(typeof err == "error");
        })
    });

    it ("should timeout", function () {
        let tcall = CatHandler.initializeBreedList("https://10.255.255.1/");
        return tcall.then((res) => {
            expect.fail("Not supposed to resolve");
        }).catch((e) => {
            expect(typeof e == "error");
        });
    });

    it ("should return a list of 134 image links",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.getImageLinks(blist,"https://api.thecatapi.com/v1/images/search?breed_ids=",2);
        }).then((ilist) => {
            // console.log(ilist);
            console.log(CatHandler.processList(ilist));
            expect(ilist.length).to.be.equal(134);
        }).catch((err) => {
            expect.fail(err);
        })
    });

    it ("should return list of all cat objects",function() {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.initAllBreeds("https://api.thecatapi.com/v1/images/search?breed_ids=",blist,["description","name"]);
        }).then((list) => {
            expect(list.length).to.be.equal(67);
        }).catch((err) => {
            expect.fail(err);
        })
    });

    it ("should process list of cat objects", function () {
        let tcall = CatHandler.initializeBreedList("https://api.thecatapi.com/v1/breeds?");
        return tcall.then((blist) => {
            expect(blist.length).to.be.equal(67);
            return CatHandler.initAllBreeds("https://api.thecatapi.com/v1/images/search?breed_ids=",blist,["description","name"]);
        }).then((list) => {
            expect(list.length).to.be.equal(67);
            console.log("printing processed list object");
            console.log(CatHandler.processCats(list));
        }).then().catch((err) => {
            expect.fail(err);
        })
    })


});