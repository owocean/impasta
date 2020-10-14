const fs = require("fs");
const request = require("request");
require('dotenv').config();

let webhookurl = null;

if (!fs.existsSync(".env")) {
    fs.writeFileSync(".env", "WEBHOOK_URL=null");
} else {
    webhookurl = process.env.WEBHOOK_URL
}

function emit(msg) {
    if (webhookurl == null) return;
    request.post({ url: webhookurl, json: { msg: msg } });
}

module.exports = emit;