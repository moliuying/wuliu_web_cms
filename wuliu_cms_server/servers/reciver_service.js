"use strict";
/*
 * require modules
 */
let Common_Service = require("./common_service");
let reciver_info = require("./../models/reciver_model");

let reciver = new Common_Service(reciver_info);
module.exports = reciver;