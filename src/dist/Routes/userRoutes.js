"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../Controller/userController");
const route = (0, express_1.Router)();
route.route("/postuser").post(userController_1.RegisterUser);
route.route("/login").post(userController_1.LoginUser);
route.route("/all").get(userController_1.getallUser);
route.route("/backtoschool/:id").post(userController_1.backToSchool);
route.route("/user/:id").get(userController_1.getOneUser);
route.route("/update/:id").patch(userController_1.UpdateBackToSchoolAccount);
route.route("/pay/:userId").patch(userController_1.fundWalletFromBank);
route.route("/pays/:id").patch(userController_1.checkPayment);
// route.route("/withdraw/:userId/:adminId").patch(withdraw)
route.route("/withdraws/:userId/:adminId").patch(userController_1.checkOutToBank);
exports.default = route;
