
"use strict";
let Common_Service = require("./common_service");
let customer_model = require("./../models/customer_model");

let customer = new Common_Service(customer_model);
module.exports = customer;
