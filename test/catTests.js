const Cat = require("../js/Cat.js");
const CH = require("../js/CatHandler.js");
const expect = require("chai").expect;

describe("Cat test suite", function () {
    it ("Should compare equality of two cats objects, true",function () {
        let cat1 = {
            breedID: "cat",
            description: "catsss",
            name: "cat"
        }
        let bool = Cat.catsEquals(cat1,cat1);
        expect(bool).to.be.equal(true);
    });

    it ("Should compare equality of two cats objects, return false",function () {
        let cat1 = {
            breedID: "cat",
            description: "catsss",
            name: "cat"
        }
        let cat2 = {
            breedID: "cat",
            description: "catsss",
            name: "dog"
        }
        let bool = Cat.catsEquals(cat1,cat2);
        expect(bool).to.be.equal(false);
    });

    it ("Should compare equality of cat object lists, return empty list",function () {
        let cat1 = {
            breedID: "cat",
            description: "catsss",
            name: "cat"
        }
        let cat2 = {
            breedID: "cat",
            description: "catsss",
            name: "dog"
        }

        let c1 = CH.processCats([cat1,cat2]);
        let c2 = CH.processCats([cat1,cat2]);
        
        let arr = Cat.compareCats(c1,c2);
        expect(arr.length).to.be.equal(0);
    });

    it ("Should compare equality of cat object lists, return empty list",function () {
        let cat1 = {
            breedID: "cat",
            description: "catsss",
            name: "cat"
        }
        let cat2 = {
            breedID: "dog",
            description: "catsss",
            name: "dog"
        }

        let cat3 = {
            breedID: "dog",
            description: "catts",
            name: "dog"
        }

        let c1 = CH.processCats([cat1,cat2]);
        let c2 = CH.processCats([cat1,cat3]);
        
        let res = Cat.compareCats(c1,c2);
        let exp = [cat3];
        expect(res).to.be.deep.equal(exp);
    });
});