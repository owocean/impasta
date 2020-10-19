"use strict";

const message = require("./messages.js");

require("fs")
  .readFileSync("replay.txt", { encoding: "utf8" })
  .split("\n")
  .forEach(message);