// Impasta, by owocean
// https://bruhchan.xyz/contact

let devices = require("os").networkInterfaces();
let device = null;

for(var i in devices["Wi-Fi"]){
    if(devices["Wi-Fi"][i].family == "IPv4"){
        device = devices["Wi-Fi"][i].address;
    }
}

require("./server.js")(device);