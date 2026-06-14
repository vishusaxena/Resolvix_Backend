const path = require("path");
const cloudinary = require("./cloudinary");

const uploadToCloudinary = async (files, folder = "GMS") => {
  const uploadedFiles = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.fileBase64, {
      folder,
      resource_type: "auto",
    });

    uploadedFiles.push({
      fileName: file.fileName,
      fileExt: file.fileExt,
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  return uploadedFiles;
};

module.exports = uploadToCloudinary;
