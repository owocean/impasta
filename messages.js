const { print } = require("./interface.js");
const COLORS = require("./colors.json");

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
                            break;
                        case 0x0d:
                            let chat = getLengthedString(bytes, read.start + 2);
                            print(bytes[read.start] + ": " + chat, "greenBright");

                            break;
                        case 0x03: {
                            const num = bytes[read.start + 2];
                            const impostors = [];
                            for (let e = 0; e < num; e++) {
                                impostors.push(bytes[read.start + 3 + e]);
                            }
                            const impostorPlayers = Object.values(players)
                                .filter(({ number }) => impostors.includes(number));
                            print(num.toString(10) + " players are impostors:", "red");
                            impostorPlayers.forEach(({ name, color }) => print('\t' + name + ' (' + color + ')', color));
                            break;
                        }
                        case 0x0e:
                            print("Meeting was called", "green");
                            break;
                        case 0x16:
                            print("Meeting ended", "green");
                            break;
                        case 0x1e: {
                            for (let k = read.start + 2; k < bytes.length;) {
                                const player_length = bytes[k];
                                const player_number = Buffer.from(bytes.slice(k + 1, k + 3)).readUInt16BE(0);
                                const player_name_length = bytes[k + 3];
                                const player_name = decode(bytes.slice(k + 4, k + 4 + player_name_length));
                                const data_begin = k + 4 + player_name_length;
                                const player_color = COLORS[bytes[data_begin]];
                                const player_hat = bytes[data_begin + 1];
                                const player_pet = bytes[data_begin + 2];
                                const player_skin = bytes[data_begin + 3]
                                const player = {
                                    number: player_number, name: player_name, color: player_color, hat: player_hat, pet: player_pet, skin: player_skin
                                };
                                players[player_number] = player;
                                k += (player_length + 3);
                            }
                            break;
                        }
                    }
                }
                i = read.end;
            }
        } else if (t == 0x02) {
            print("Game started", "white");

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

function decode(bytes) {
    return new TextDecoder().decode(Uint8Array.from(bytes));
}

module.exports = message;
