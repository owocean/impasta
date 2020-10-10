const chalk = require("chalk");
const keypress = require('keypress');
keypress(process.stdin);

let v = false;

function print(str,color,verbose){
    if(v == false && verbose == true)return;
    console.log(chalk[color](str));
}

process.stdin.on("keypress", function(ch,key){
    if(key == undefined)return;
    if(key.name == "v"){
        v = !v;
        print("Verbose changed to "+v,"white");
    }
    if(key.name == "c"){
        process.exit();
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();

module.exports.print = print;