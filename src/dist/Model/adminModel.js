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
    Totalbalance: {
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
    phoneNumber: {
        type: Number,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: true,
        // required:true,
    },
    Message: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "message"
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
            ref: "backtoschool"
        }
    ],
});
exports.default = mongoose_1.default.model("admin", UserSchema);
