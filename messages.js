const { print } = require("./interface.js");
const emit = require("./hook.js");

let players = {};

function message(msg) {
    let bytes = Buffer.from(msg, "hex");
    if (bytes[0] == 0x09) {
        players = {};
    }
    if (bytes[0] != 0x01) return;
    else {
        // the following code was assisted by https://github.com/NickCis/among-us-proxy
        // go give it a star :)
        print("\n" + bytes.toString("hex").match(/.{1,2}/g).join(" "), "blue", true);
        let t = bytes[5];
        if (t == 0x05) {
            for (var i = 10; i < bytes.length;) {
                let read = getLengthedBuffer(bytes, i);
                if (read.head == 0x0002) {
                    let opt = bytes[read.start + 1];
                    switch (opt) {
                        // todo: add playernames and more events
                        case 0x08:
                            if (players[bytes[read.start]] != undefined) break;
                            players[bytes[read.start]] = { "impostor": false };
                            print("User " + bytes[read.start] + " joined", "green");
                            emit("join " + bytes[read.start]);
                            break;
                        case 0x0d:
                            let chat = getLengthedString(bytes, read.start + 2);
                            print(bytes[read.start] + ": " + chat, "greenBright");
                            emit("chat " + bytes[read.start] + " " + chat);
                            break;
                        case 0x03:
                            let num = bytes[read.start + 2];
                            let impostors = [];
                            for (var e = 0; e < num; e++) {
                                impostors.push(bytes[read.start + 3 + e]);
                            }
                            for (var j in impostors) {
                                impostors[j] = impostors[j].toString(10);
                            }
                            print(num.toString(10) + " players are impostors. IDs: " + impostors.join(" "), "white");
                            emit("impostors " + num.toString(10) + " " + impostors.join(" "));
                            break;
                        case 0x0e:
                            print("Meeting was called", "green");
                            emit("meeting");
                            break;
                        case 0x16:
                            print("Meeting ended", "green");
                            emit("endmeeting");
                            break;
                    }
                }
                i = read.end;
            }
        } else if (t == 0x02) {
            print("Game started", "white");
            emit("start");
        }
    }
}

// also taken from https://github.com/NickCis/among-us-proxy
function getLengthedBuffer(bytes, offset) {
    const length = bytes.readUInt16LE(offset);
    const head = bytes[offset + 2];
    const start = offset + 2 + 1;
    const end = start + length;

    return {
        length,
        head,
        start,
        end,
    };
}

function getLengthedString(buffer, offset) {
    const length = buffer[offset];
    let text = '';

    for (let i = 0; i < length; i++) {
        text += String.fromCharCode(buffer[offset + 1 + i]);
    }

    return text;
}

module.exports = message;