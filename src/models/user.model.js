import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//user schema
const userSchema =  new Schema(
 {
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    fullName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,"password is required"]
    },

    refreshToken:{
        type:String,
    }, 
 },
 {timestamps:true})

//encrypt password before save
 userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
 })

 //check password
 userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
 }

 userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
        {
            _id: this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }
 userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
 }

export const User = mongoose.model("User",userSchema)
