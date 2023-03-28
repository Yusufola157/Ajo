"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    balance: {
        type: Number
    },
    credit: {
        type: Number
    },
    debit: {
        type: Number
    },
    Target: {
        type: Number
    },
    purpose: {
        type: String
    },
});
exports.default = mongoose_1.default.model("backtoschools", walletSchema);
