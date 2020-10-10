const { print } = require("./interface.js");

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
                            if(players[bytes[read.start]] != undefined)break;
                            players[bytes[read.start]] = {"impostor": false};
                            print("User " + bytes[read.start] + " joined", "green");
                            break;
                        case 0x0d:
                            print(bytes[read.start] + ": " + getLengthedString(bytes, read.start + 2), "greenBright");
                            break;
                        case 0x03:
                            let num = bytes[read.start + 2];
                            let impostors = [];
                            for(var e=0; e<num; e++){
                                impostors.push(bytes[read.start + 3 + e]);
                            }
                            for(var j in impostors){
                                impostors[j] = impostors[j].toString(10);
                            }
                            print(num.toString(10)+" players are impostors. IDs: "+impostors.join(" "), "white");
                    }
                }
                i = read.end;
            }
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

//01 00 62 62 02 05 79 59 30 80 01 00 05 01 2d 00 04 00 fe ff ff ff 0f 00 01 22 21 00 01 00 40 1c 46 00 1f 1f ff 00 40 1c 46 00 00 00 00 01 01 01 01 01 01 01 01 01 01 01 01 01 00 00 00 00 04 00 02 04 03 01 06 0e 00 02 02 1d 00 0a 01 00 09 02 04 13 1a 0d 0c 10 0e 00 02 02 1d 01 0a 01 00 03 07 08 0b 0e 14 15 12 0e 00 02 02 1d 02 0a 01 00 05 06 07 17 11 0c 0b 10 0e 00 02 02 1d 03 0a 01 00 02 04 05 1a 0d 14 12 0e 0e 00 02 02 1d 04 0a 01 00 09 03 08 18 0f 0d 0c 12 0e 00 02 02 1d 05 0a 01 00 06 05 04 17 0a 0e 10 0b 0e 00 02 02 1d 06 0a 01 00 03 06 08 0e 15 13 0b 0c 0e 00 02 02 1d 07 0a 01 00 02 07 09 17 0d 12 11 10 0e 00 02 02 1d 08 0a 01 00 08 02 07 0a 16 0d 12 0e 0e 00 02 02 1d 09 0a 01 00 04 06 05 11 17 0c 10 0b 76 01 02 02 1e 24 00 00 09 58 78 70 75 72 70 6c 78 58 08 1e 03 01 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 24 00 01 09 58 78 43 61 6e 64 79 78 58 07 20 05 09 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 24 00 02 09 72 65 63 72 75 69 72 38 39 0a 00 00 00 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 23 00 03 08 50 61 70 69 4a 65 73 73 06 48 00 00 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 22 00 04 07 6f 77 6f 63 65 61 6e 0b 11 02 07 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 20 00 05 05 73 6d 61 73 68 00 40 00 00 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 20 00 06 05 64 61 64 64 79 05 1c 00 00 02 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 21 00 07 06 77 61 6c 6b 65 72 02 50 00 00 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 23 00 08 08 63 69 74 79 67 69 72 6c 03 3c 00 00 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00 21 00 09 06 59 65 6c 6c 6f 77 09 02 00 00 00 0a 00 00 01 00 02 00 03 00 04 00 05 00 06 00 07 00 08 00 09 00