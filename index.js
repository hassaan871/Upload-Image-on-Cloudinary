const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer');
const express = require('express');
const cloudinary = require('cloudinary');
const { UploadStream } = require('cloudinary');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/temp"),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const uplaod = multer({storage});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINAY_API_SECRET
});
const uploadOnCloudinary = async (localFilePath) => {
try {
    if(!localFilePath) return null;
    const upload = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto"});
    fs.unlinkSync(localFilePath);
    return upload;

} catch (error) {
    console.error(error);
}
}

const uploadController = async (req, res) => {
    try {
        if(!req.file) return res.status(400).json({error: "file not provided to be uploaded"});
        const upload = await uploadOnCloudinary(req.file.path);
        return res.status(201).json({success: "file uploaded on cloudinary", upload});
    } catch (error) {
        return res.status(500).json({error: "Internal server error"});
    }
}
app.post('/upload', uplaod.single("image"), uploadController);


app.listen(PORT, ()=>{
    console.log("server up and running on PORT",PORT);
});