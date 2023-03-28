"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        // required:true,
    },
    verified: {
        type: Boolean,
        // required:true,
    },
    Message: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "messages"
        }
    ],
    wallet: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "wallet"
        }
    ],
    history: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "histories"
        }
    ],
    backToSchool: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "backtoschools"
        }
    ],
});
exports.default = mongoose_1.default.model("user", UserSchema);
