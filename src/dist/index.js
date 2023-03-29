"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes"));
const port = 1400;
const url = "mongodb+srv://Sukanmi157:Sukanmi157@cluster0.dorzl9v.mongodb.net/?retryWrites=true&w=majority";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "on..."
    });
});
mongoose_1.default.connect(url).then(() => {
    console.log("db is on...");
});
app.use("/api", userRoutes_1.default);
app.use("/", adminRoutes_1.default);
// app.use(url())
app.listen(port, () => {
    console.log("server is up.....");
});
