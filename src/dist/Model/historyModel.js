"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const historySchema = new mongoose_1.default.Schema({
    message: {
        type: String,
    },
    transactionRefrence: {
        type: String,
    },
    Date: {
        type: String,
    },
    description: {
        type: String,
    },
});
exports.default = mongoose_1.default.model("history", historySchema);
