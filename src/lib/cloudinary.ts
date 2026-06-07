
import { v2 as cloudinary } from 'cloudinary';  
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath : string) => {
    try{
        if(!localFilePath) {
            throw new Error('No file path provided');
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: 'auto' });
        console.log('File uploaded successfully', response.url);
        return response;
    } catch(error){
        fs.unlinkSync(localFilePath); //remove the locally sved temp file as the upload operation got failed
        console.error('Error uploading file to Cloudinary:', error);
        return null;
    }
};

const deleteFromCloudinary = async (publicId: string) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
        console.log('File deleted successfully from Cloudinary', response);
        return response;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return null;
    }   
};

export { uploadOnCloudinary, deleteFromCloudinary };
