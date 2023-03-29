import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import route from "./Routes/userRoutes";
import routes from "./Routes/adminRoutes";
const port=1400;
const url="mongodb+srv://Sukanmi157:Sukanmi157@cluster0.dorzl9v.mongodb.net/?retryWrites=true&w=majority"

const app = express();
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
    res.status(200).json({
        message:"on..."
    })
})
mongoose.connect(url).then(()=>{
    console.log("db is on...")
})
app.use("/api",route)
app.use("/",routes)
// app.use(url())

app.listen(port,()=>{
    console.log("server is up.....")
})