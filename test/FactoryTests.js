const expect = require("chai").expect;
const catFactory = require("../js/CatFactory.js");

describe("Cat Factory tests", function () {
    it ("should return american bobtail cat", function () {
        let actual = catFactory.initializeCat("https://api.thecatapi.com/v1/images/search?breed_ids=","abob",["description","name","url"]);
        return actual.then((res) => {
            let expected = {
                description: 'American Bobtails are loving and incredibly intelligent cats possessing a distinctive wild appearance. They are extremely interactive cats that bond with their human family with great devotion.',
                name: 'American Bobtail',
                url: 'https://cdn2.thecatapi.com/images/gVrhv_yAY.jpg'
              };
            let edesc = expected["description"];
            let ename = expected["name"];
            let initurl = "https://cdn2.thecatapi.com/images/";
            let adesc = res["description"];
            let aname = res["name"];

            expect(adesc).to.equal(edesc);
            expect(aname).to.equal(ename);
            expect(res["url"].includes(initurl));
        }).catch((e) => {
            expect.fail(e);
        });
    });
})