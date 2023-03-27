"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminContoller_1 = require("../Controller/adminContoller");
const route = (0, express_1.Router)();
route.route("/reg").post(adminContoller_1.RegisterAdmin);
route.route("/login").post(adminContoller_1.LoginAdmin);
route.route("/history").get(adminContoller_1.getAllHistory);
// route.route("/all").get(getallUser)
// route.route("/backtoschool/:id").post(backToSchool)
// route.route("/update/:walletId").patch(UpdateBackToSchoolAccount)
// route.route("/withdraw/:userId/:adminId").patch(withdraw)
exports.default = route;
