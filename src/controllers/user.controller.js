import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/couldinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res)=>{
    // steps requried to register a user
    // 1. get user detail from frontend
    // 2. validate the data
    // 3. check existence
    // 4. check for images, check for avatar
    // 5. upload the images to cloudinary,avatar
    // 6. create user object - create entry in the database 
    // 7. remove password and refresh token field from response
    // 8. check for user creation
    // 9. return response to frontend


    const {fullname, email,username,password}=req.body
    console.log("fullname",fullname);

    // if(fullname ===""){
    //     throw new apiError("fullname is required",400); 
    // }
    if(
        [fullname,email,username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError("All fields are required",400);
    }

    const existedUser =User.findOne({
        $or:[{ username},{ email }]
    })
    if(existedUser) throw new ApiError("User already exists",409);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if(!avatarLocalPath) throw new ApiError("Avatar is required",400);

    const avatar =await uploadOnCloudinary(avatarLocalPath)
    const CoverImage =await uploadOnCloudinary(coverImageLocalPath)
    
    if(!avatar) throw new ApiError("Failed to upload avatar",500);

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:CoverImage?.url,
        email,
        username: username.toLowerCase(),
        password
    })
    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken "
    );
    if(!createdUser) throw new ApiError("Failed to create user",500);

    return res.status(201).json(
        new ApiResponse(201, createdUUser,"User registered successfully")
    )

})

export default registerUser;