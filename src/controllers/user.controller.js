import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { upload, uploadMultiple } from '../middlewares/multer.middleware.js'
import { ApiResponse } from '../utils/ApiResponse.js'





 const registerUser =  asyncHandler(async (req, res,next) => {
       // get user details from frontend
       //validation - not empty
       //check if user already exist:username, email
       //check for images, avatar
       //upload them to cloudinary, avatar
       //create user object - create entry in db
       //remove password and refresh token field
       //check for user creation
       //return res

       const { fullName, username, email, password} = req.body
        
    
    //    if (fullName === "") {
    //         throw new ApiError(400 , "fullName is required")
    //    }

       if(
        [fullName, username, email, password].some((field) =>field?.trim()==="")
       ){
        throw new ApiError(400 , "All fields are required")
       }

       const existedUser = await User.findOne({
        $or: [{username}, {email}]
       })


    if (existedUser) {
        throw new ApiError(409, "username or email already existed")
    }
    
    console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    // console.log(avatarLocalPath);
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
        console.log(coverImageLocalPath);
    }
  

    
    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

   const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

   const createdUser =  await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if (!createdUser) {
    throw new ApiError(400, "something went wrong while register")
   }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
    
    })

export default registerUser

