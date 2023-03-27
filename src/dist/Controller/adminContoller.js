"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHistory = exports.LoginAdmin = exports.RegisterAdmin = void 0;
const adminModel_1 = __importDefault(require("../Model/adminModel"));
const walletModel_1 = __importDefault(require("../Model/walletModel"));
const historyModel_1 = __importDefault(require("../Model/historyModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RegisterAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, username, phoneNumber } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const dater = Date.now();
        const numb = +234;
        const generateToken = Math.floor(Math.random() * 78) + dater;
        const regUser = yield adminModel_1.default.create({
            name,
            email,
            username,
            password: hash,
            phoneNumber: numb + phoneNumber,
            verified: true,
            accountNumber: generateToken
        });
        const createWalllet = yield walletModel_1.default.create({
            _id: regUser === null || regUser === void 0 ? void 0 : regUser._id,
            balance: 0,
            credit: 0,
            debit: 0,
        });
        regUser === null || regUser === void 0 ? void 0 : regUser.wallet.push(new mongoose_1.default.Types.ObjectId(createWalllet === null || createWalllet === void 0 ? void 0 : createWalllet._id));
        regUser.save();
        res.status(200).json({
            message: "created user",
            data: regUser,
            token: jsonwebtoken_1.default.sign({ _id: regUser._id }, "ddhrjd-jfjfndd-nehdjs")
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occured"
        });
    }
});
exports.RegisterAdmin = RegisterAdmin;
const LoginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const Admin = yield adminModel_1.default.findOne({ email });
        if (!Admin) {
            return res.status(400).json({
                message: "you are not authorzed"
            });
        }
        else {
            return res.status(200).json({
                message: "welcome back boss",
                data: Admin
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "email or password not correct"
        });
    }
});
exports.LoginAdmin = LoginAdmin;
const getAllHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allHistory = yield historyModel_1.default.find();
        return res.status(200).json({
            message: "here are all the user history",
            data: allHistory
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occured"
        });
    }
});
exports.getAllHistory = getAllHistory;
