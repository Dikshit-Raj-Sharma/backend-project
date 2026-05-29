import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.log("Error deleting from Cloudinary: ", error);
    return null;
  }
};
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded sucessfully
    // console.log("file uploaded successfully on cloudinary",response.url);
    fs.unlinkSync(localFilePath); // remove locally saved temporary file
    return response;
  } catch (error) {
    console.log("CLOUDINARY ERROR:", error);
    fs.unlinkSync(localFilePath); // remove locally saved temporary file as operation failed
    return null;
  }
};
export { uploadOnCloudinary,deleteFromCloudinary };
