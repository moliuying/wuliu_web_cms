"use strict";
/*
 * require modules
 */
let Common_Service = require("./common_service");
let user_info = require("./../models/user_model");

let user = new Common_Service(user_info);
module.exports = user;