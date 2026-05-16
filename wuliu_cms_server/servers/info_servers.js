"use strict";
/*
 * require modules
 */
let Common_Service = require("./common_service");
let info_info = require("./../models/info_model");

let info = new Common_Service(info_info);
module.exports = info;