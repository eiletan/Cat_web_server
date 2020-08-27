const express = require("express");
const path = require("path");
const cis = require("../js/CatInsight.js");
const CatInsight = cis.CatInsight;


class Server {
    #port;
    #app;
    #CInsight;
    #inst;

    constructor(port) {
        this.#port = port;
        this.#app = express();
        this.#CInsight = new CatInsight();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.#app.use(express.static(path.join(__dirname, "../public")));
            this.#CInsight.updateCatInfo(2).then((res) => {
                try {
                    if (this.#app !== undefined) {
                        this.#inst = this.#app.listen(this.#port, () => {
                            console.log("Server running and listening on port: " + this.#port);
                            resolve(true);
                        });
                    }

                    this.#app.get("/", (req, res, next) => {
                        res.sendFile("index.html", { root: path.join(__dirname, "../") });
                        // res.send("YAHALLO");
                        // next();
                    });

                    this.#app.get("/newcat", (req, res) => {
                        let cat = this.#CInsight.chooseCat();
                        if (cat !== null) {
                            res.status(200).json({result: cat});
                        } else {
                            res.status(500).json({ error: "Cat could not be selected, please try again for refresh the database" });
                        }
                    });

                    this.#app.put("/replace/:num", (req, res) => {
                        this.#CInsight.updateCatInfo(req.params.num).then((result) => {
                            res.status(201).json({result: true});
                        }).catch((err) => {
                            res.status(501).json({result: false, error: err.message});
                        });
                    });

                } catch (err) {
                    console.log(err.message);
                    throw err;
                }
            }).catch((err) => {
                console.log("we got an error");
                reject(err);
            });
        });
    }

    stop() {
        return new Promise((resolve) => {
            this.#inst.close();
            resolve();
        });
    }
}


module.exports.Server = Server;