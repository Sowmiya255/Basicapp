import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}))

app.get('/',(req,res) =>{
    res.send("API is working");
})

app.listen(port, () =>{
    console.log(`server started on port:http://localhost:${port}`)
});

