const assert = require("chai").assert;
const parser = require("../js/parser.js");


describe("Parser tests", function () {
    it ("should return banana json", function () {
        let fruits = [
            {
                "apple": "a"
            },
            {
                "banana": "b"
            }
        ];
        let actual = parser.searchJSON(fruits,"banana");
        let expected = "b"
        assert.equal(actual,expected);
    });

    it ("should return description json", function () {
        let cat = [
            {
                "breeds": [
                    {
                        "weight": {
                            "imperial": "7 - 16",
                            "metric": "3 - 7"
                        },
                        "id": "abob",
                        "name": "American Bobtail",
                        "cfa_url": "http://cfa.org/Breeds/BreedsAB/AmericanBobtail.aspx",
                        "vetstreet_url": "http://www.vetstreet.com/cats/american-bobtail",
                        "vcahospitals_url": "https://vcahospitals.com/know-your-pet/cat-breeds/american-bobtail",
                        "temperament": "Intelligent, Interactive, Lively, Playful, Sensitive",
                        "origin": "United States",
                        "country_codes": "US",
                        "country_code": "US",
                        "description": "American Bobtails are loving and incredibly intelligent cats possessing a distinctive wild appearance. They are extremely interactive cats that bond with their human family with great devotion.",
                        "life_span": "11 - 15",
                        "indoor": 0,
                        "lap": 1,
                        "alt_names": "",
                        "adaptability": 5,
                        "affection_level": 5,
                        "child_friendly": 4,
                        "dog_friendly": 5,
                        "energy_level": 3,
                        "grooming": 1,
                        "health_issues": 1,
                        "intelligence": 5,
                        "shedding_level": 3,
                        "social_needs": 3,
                        "stranger_friendly": 3,
                        "vocalisation": 3,
                        "experimental": 0,
                        "hairless": 0,
                        "natural": 0,
                        "rare": 0,
                        "rex": 0,
                        "suppressed_tail": 1,
                        "short_legs": 0,
                        "wikipedia_url": "https://en.wikipedia.org/wiki/American_Bobtail",
                        "hypoallergenic": 0
                    }
                ],
                "id": "gVrhv_yAY",
                "url": "https://cdn2.thecatapi.com/images/gVrhv_yAY.jpg",
                "width": 1600,
                "height": 1051
            }
        ];

     
        let actual = parser.searchJSON(cat,"description");
        let expected = "American Bobtails are loving and incredibly intelligent cats possessing a distinctive wild appearance. They are extremely interactive cats that bond with their human family with great devotion."
        assert.equal(actual,expected);
    });

    it ("should return null", function () {
        let fruits = [
            {
                "apple": "a"
            },
            {
                "banana": "b"
            }
        ];
        assert.equal(parser.searchJSON(fruits,""),null);
    });

    it ("should return pearl", function () {
        let fruits = [
            {
                "apple": {
                    "ambrosia": {
                        "opal": {
                            "fuji": {
                                "pearl": "pearl"
                            }
                        }
                    }
                }
            },
            {
                "banana": "b"
            }
        ];

        let actual = parser.searchJSON(fruits,"pearl");
        let expected = "pearl";
        assert.equal(actual,expected);
    });

    it ("should return null from empty json", function () {
        let fruits = {};

        let actual = parser.searchJSON(fruits,"banana");
        let expected = null;
        assert.equal(actual,expected);
    });

    it ("should return null from non-json", function () {
        let fruits = "this is not a json";

        let actual = parser.searchJSON(fruits,"banana");
        let expected = null;
        assert.equal(actual,expected);
    });
})