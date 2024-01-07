import mongoose from "mongoose";
import { DB_NAME } from './constants.js'
import dotenv from 'dotenv'
import express from "express"
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: './.env'
})



// connect db mongodb
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`server is running on Port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
console.log("MongoDB Connection Failed",error);
})





/*
( async () => { 
    try {
        await Mongoose.connect(`${process.env.MODULE_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.log("ERROR", error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("ERROR", error);
        throw error
    }
})()
*/