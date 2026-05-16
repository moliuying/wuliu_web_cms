"use strict";
let Mongoose = require("mongoose");
/*
 * because the Promise's info that from mongoose is incomplete ,so ,use version the ES6 owned by;
 */
Mongoose.Promise = global.Promise;
/*
 * exports module
 */
module.exports = Mongoose;