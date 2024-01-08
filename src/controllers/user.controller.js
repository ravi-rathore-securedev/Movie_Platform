import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { upload, uploadMultiple } from '../middlewares/multer.middleware.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'



const generateAccessAndRefreshToken = async(userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()


       user.refreshToken = refreshToken
       user.save({validateBeforeSave: false})

       return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,"something went wrong while generating tokens")
    }
}




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

    const loginUser = asyncHandler( async (req,res) => {
        // req body -> data
        // username or email base access
        // find the user
        //password check
        //access and refresh token generate
        // send cookie
        
        const {email, username, password} = req.body
        if (!username && !email) {
            throw new ApiError(400, "username or password is required")

        }

   const user =  await   User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        throw new ApiError(400, "user not found")
    }

    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(401, "invalid password")
    }

  const {accessToken,refreshToken} =  await  generateAccessAndRefreshToken(user._id)

  const logggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }
  return res
  .status(200).
  cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
        200,
        {
            user: logggedInUser, accessToken,refreshToken
        },
        "user logged in successfully"
    )
  )

    })

const logoutUser = asyncHandler( async (req, res) =>{

   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )
     
    const options = {
        httpOnly:true,
        secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(200,{},"user logged Out Successfully")
      )
})

const refreshAccessToken = asyncHandler( async (req,res) =>{

   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new ApiError(401,"refresh token expired")
   }

  try {
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)
  
    if (!user) {
      throw new ApiError(401, "invalid refresh token")
    }
  
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401,"refresh token is expired or used")
    }
  
    const options = {
      httpOnly:true,
      secure:true
    }
  
      const {newRefreshToken, accessToken} = await generateAccessAndRefreshToken(user._id)
  
      return res.status(200)
      .cookie("accessToken",accessToken, options)
      .cookie("refreshToken",newRefreshToken, options)
      .json(
          new ApiResponse(
              200,
              {accessToken},
              {refreshToken:newRefreshToken},
              "access token refreshed successfully"
          )
  )
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid error message")
  }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

}

