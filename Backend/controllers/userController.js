import User from "../models/User.js";
import { unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume",
            });
        }

        req.user.resume = req.file.path;

        await req.user.save();

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: req.user.resume,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getResume= async(req,res)=>{
    if(!req.user.resume){
        return res.status(404).json({
            success:false,
            message: "No resume found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Resume fetched successfully",
        resume: req.user.resume,
    })
}

export const viewResume = async (req, res) => {
    if(!req.user.resume){
        return res.status(404).json({
            success:false,
            message: "No resume found",
        });
    }
    try {
        const filePath = path.join(__dirname, "..", req.user.resume);
        res.sendFile(filePath);
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume",
            });
        }

        let oldpath = req.user.resume;
        let newpath = req.file.path;

        req.user.resume = newpath;
        await req.user.save();

        if (oldpath) {
            try {
                await unlink(oldpath);
            } catch (error) {
                console.log("Old resume deletion failed:", error.message);
            }
        }

        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            resume: req.user.resume,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteResume = async (req, res) => {
    try {
        let path = req.user.resume;

        if (!path) {
            return res.status(404).json({
                success: false,
                message: "No resume found",
            });
        }

        await unlink(path);

        req.user.resume = null;
        await req.user.save();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

