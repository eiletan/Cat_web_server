const servers = require("./js/server.js");
const Server = servers.Server;


let catserv = new Server(8080);
catserv.start().then((res) => {
        
}).catch((err) => {
    console.log(err.message);
});
