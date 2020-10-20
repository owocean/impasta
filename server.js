var Cap = require('cap').Cap;
var decoders = require('cap').decoders;
var PROTOCOL = decoders.PROTOCOL;
var message = require("./messages.js");

function init(dev){
    var c = new Cap();
    var device = Cap.findDevice(dev);
    var filter = 'udp and port 22023 or 22123 or 22223 or 22323 or 22423';
    var bufSize = 10 * 1024 * 1024;
    var buffer = Buffer.alloc(65535);

    var linkType = c.open(device, filter, bufSize, buffer);

    c.setMinBytes && c.setMinBytes(0);

    c.on('packet', function (nbytes, trunc) {
        if (linkType === 'ETHERNET') {
            var ret = decoders.Ethernet(buffer);

            if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
                ret = decoders.IPV4(buffer, ret.offset);

                if (ret.info.protocol === PROTOCOL.IP.UDP) {
                    ret = decoders.UDP(buffer, ret.offset);
                    if(ret.info.dstport != "22023"){
                        message(buffer.toString('hex', ret.offset, ret.offset + ret.info.length));
                    }
                } else
                    console.log('Unsupported IPv4 protocol: ' + PROTOCOL.IP[ret.info.protocol]);
            } else
                console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
        }
    });
}

module.exports = init;