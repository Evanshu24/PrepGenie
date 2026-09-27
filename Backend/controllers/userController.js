import User from "../models/User.js";
import { parseResume } from "../utils/ResumeParser.js";
import { unlink } from "fs/promises";
import cloudinary from "../utils/Cloudinary.js";

export const getLoggedInUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadResume = async (req, res) => {
    let cloudinaryPublicId = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resume",
        });
      }

      let parsed = null;

      try {
        parsed = await parseResume(req.file.path);
      } catch (parseErr) {
        console.error("Resume parsing failed:", parseErr.message);
      }
      const resourceType =req.file.mimetype === "application/pdf" ? "image" : "raw";

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "prepgenie/resumes",
        resource_type: resourceType,
      });


      cloudinaryPublicId = result.public_id;

      req.user.resume = result.secure_url;
      req.user.resumePublicId = result.public_id;
      req.user.resumeResourceType = resourceType;
      req.user.resumeName = req.file.originalname;
      req.user.parsedResume = parsed;

      await req.user.save();

      res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        resume: req.user.resume,
        resumeName: req.user.resumeName,
        parsedResume: req.user.parsedResume,
      });
    }catch (error) {
      console.log(error);
        if (cloudinaryPublicId) {
          try {
            await cloudinary.uploader.destroy(cloudinaryPublicId, {
              resource_type: "image",
            });
          } catch (deleteErr) {
            console.error(
              "Cloudinary cleanup failed:",
              deleteErr.message
            );
          }
        }

        res.status(500).json({
          success: false,
          message: error.message,
        });
    }finally{
        if(req.file?.path){
          try{
            await unlink(req.file.path);
          }catch (fileErr){
            console.error(
              "Temporary file cleanup failed:",
              fileErr.message
            );
          }
        }
    }
};

export const viewResume = async (req, res) => {
  if (!req.user.resume) {
    return res.status(404).json({
      success: false,
      message: "No resume found",
    });
  }

  res.status(200).json({
    success: true,
    resume: req.user.resume,
  });
};

export const updateResume = async (req, res) => {
  let newPublicId = null;
  let newResourceType = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    let parsed = null;
    let parseSuccess = false;

    try {
      parsed = await parseResume(req.file.path);
      parseSuccess = true;
    } catch (parseErr) {
      console.error("Resume parsing failed:", parseErr.message);
    }

    const resourceType =
      req.file.mimetype === "application/pdf" ? "image" : "raw";

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "prepgenie/resumes",
      resource_type: resourceType,
    });

    newPublicId = result.public_id;
    newResourceType = resourceType;

    const oldPublicId = req.user.resumePublicId;
    const oldResourceType = req.user.resumeResourceType;
    
    req.user.resumeName = req.file.originalname;
    req.user.resume = result.secure_url;
    req.user.resumePublicId = result.public_id;
    req.user.resumeResourceType = resourceType;

    if (parseSuccess) {
      req.user.parsedResume = parsed;
    }

    await req.user.save();

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, {
          resource_type: oldResourceType || "image",
        });
      } catch (deleteErr) {
        console.error(
          "Old Cloudinary resume deletion failed:",
          deleteErr.message
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: req.user.resume,
      resumeName: req.user.resumeName,
      parsedResume: req.user.parsedResume,
    });
  } catch (error) {
    console.log("Error updating resume",error);
    if (newPublicId) {
      try {
        await cloudinary.uploader.destroy(newPublicId, {
          resource_type: newResourceType || "image",
        });
      } catch (deleteErr) {
        console.error(
          "New Cloudinary resume cleanup failed:",
          deleteErr.message
        );
      }
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (req.file?.path) {
      try {
        await unlink(req.file.path);
      } catch (fileErr) {
        console.error(
          "Temporary file cleanup failed:",
          fileErr.message
        );
      }
    }
  }
};
