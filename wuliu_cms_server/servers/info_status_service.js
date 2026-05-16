"use strict";
/*
 * require modules
 */
let Common_Service = require("./common_service");
let info_status_model = require("./../models/info_status_model");

let info_status = new Common_Service(info_status_model);
module.exports = info_status;
