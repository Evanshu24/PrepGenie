import User from "../models/User.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import generateToken from "../utils/TokenGenerate.js";
import { OAuth2Client } from "google-auth-library";
import sendEmail from "../utils/sendEmail.js";
import { randomInt } from "crypto";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        name = name?.trim();
        email = email?.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long.",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isEmailVerified) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = randomInt(100000, 1000000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        
        try{
            await sendEmail(
                email,
                "ClankViewer Email Verification",
                `Hello,\n\nWelcome to ClankViewer! 🎯\n\nWe're excited to have you with us. To verify your email address, please use the verification code below:\n\n━━━━━━━━━━━━━━━━━━━━\n        ${otp}\n━━━━━━━━━━━━━━━━━━━━\n\nThis code will expire in 10 minutes.\n\nFor your security, please do not share this code with anyone.\n\nIf you did not request this verification code, you can safely ignore this email.\n\nBest regards,\nTeam ClankViewer`
            );

        }catch(error){
            return res.status(500).json({
                success: false,
                message: "Failed to send otp. Please try again."
            })
        }
        if (existingUser) {
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.emailVerificationCode = hashedOtp;
            existingUser.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
            existingUser.emailVerificationLastSent = new Date();
            existingUser.emailVerificationAttempts = 0;
            await existingUser.save();
        } else {
            await User.create({
                name,
                email,
                password: hashedPassword,
                isEmailVerified: false,
                emailVerificationCode: hashedOtp,
                emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
                emailVerificationLastSent: new Date(),
                emailVerificationResendCount: 0,
                emailVerificationResendReset: new Date(Date.now()+60*60*1000),
                emailVerificationAttempts: 0,
            });
        }

        res.status(201).json({
            success: true,
            message: "Verification OTP sent to your email.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const resendOTP = async(req,res)=>{
    try{
        let {email} = req.body;
        email = email?.trim().toLowerCase();
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Invalid request. Please try again."
            });
        }
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "User does not exist. Please sign up again."
            })
        }
        if (existingUser.isEmailVerified) {
            return res.status(409).json({
                success: false,
                message: "Email is already verified. Please log in."
            });
        }
        if (!existingUser.emailVerificationResendReset || existingUser.emailVerificationResendReset.getTime() <= Date.now()) {
            existingUser.emailVerificationResendReset = new Date(Date.now() + 60 * 60 * 1000);
            existingUser.emailVerificationResendCount = 0;
        }
        if (existingUser.emailVerificationLastSent && existingUser.emailVerificationLastSent.getTime()+30*1000 > Date.now()){
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another OTP."
            });
        }
        if(existingUser.emailVerificationResendCount>=5){
            return res.status(429).json({
                success: false,
                message: "Too many OTP requests. Please try again later."
            })
        }
        const otp = randomInt(100000, 1000000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        try{
            await sendEmail(
                email,
                "ClankViewer Email Verification",
                `Hello,\n\nWelcome to ClankViewer! 🎯\n\nWe're excited to have you with us. To verify your email address, please use the verification code below:\n\n━━━━━━━━━━━━━━━━━━━━\n        ${otp}\n━━━━━━━━━━━━━━━━━━━━\n\nThis code will expire in 10 minutes.\n\nFor your security, please do not share this code with anyone.\n\nIf you did not request this verification code, you can safely ignore this email.\n\nBest regards,\nTeam ClankViewer`
            );

        }catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP. Please try again."
            })
        }
        existingUser.emailVerificationCode = hashedOtp;
        existingUser.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
        existingUser.emailVerificationAttempts = 0;
        existingUser.emailVerificationResendCount++;
        existingUser.emailVerificationLastSent = new Date();
        await existingUser.save();
        return res.status(200).json({
            success: true,
            message: "OTP resent successfully."
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        })
    }
};

const verifyEmail = async (req, res) => {
    try {
        let { email, otp } = req.body;

        email = email?.trim().toLowerCase();

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Missing details to verify",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified",
            });
        }
        if (!user.emailVerificationCode || !user.emailVerificationExpires || Date.now() > user.emailVerificationExpires.getTime()) { 
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Try again.",
            });
        }
        if (user.emailVerificationAttempts >= 5) {
            user.emailVerificationCode = null;
            user.emailVerificationExpires = null;
            await user.save();

            return res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new OTP."
            });
        }

        const isMatch = await bcrypt.compare(otp, user.emailVerificationCode);

        if (!isMatch) {
            user.emailVerificationAttempts++;

            if (user.emailVerificationAttempts >= 5) {
                user.emailVerificationCode = null;
                user.emailVerificationExpires = null;
                await user.save();

                return res.status(429).json({
                    success: false,
                    message: "Too many incorrect attempts. Please request a new OTP."
                });
            }

            await user.save();

            return res.status(401).json({
                success: false,
                message: "Invalid OTP."
            });
        }
        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationExpires = null;
        user.emailVerificationAttempts = 0;
        user.emailVerificationLastSent = null;
        user.emailVerificationResendCount = 0;
        user.emailVerificationResendReset = null;

        await user.save();
        const token = generateToken(user._id);

       try {
            await sendEmail(
                email,
                "ClankViewer Email Verification",
                "Hello,\n\nYour email has been verified successfully! 🎉\n\nWelcome to ClankViewer. You're all set to start using the platform.\n\nBest regards,\nTeam ClankViewer",
            );

        } catch (error) {
            console.log("Verification email failed:", error);
        }
        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                resume: user.resume,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email?.trim().toLowerCase();

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message:"Email not verified. Please verify your email to continue."
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                resume: user.resume,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential, mode } = req.body;
        if (!credential) {
            return res
                .status(400)
                .json({ success: false, message: "Google credential is required." });
        }
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid Google credential." });
        }
        const {sub: googleId,email,name,email_verified: emailVerified,} = payload;
        if (!googleId || !email || !emailVerified) {
            return res.status(401).json({
                success: false,
                message: "Google account could not be verified.",
            });
        }
        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({
            $or: [{ googleId }, { email: normalizedEmail }],
        });

        if (mode === "signup") {
            if (user) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists. Please login instead.",
                });
            }

            user = await User.create({
                name: name?.trim() || "Google User",
                isEmailVerified: true,
                email: normalizedEmail,
                googleId,
            });
        } else if (mode === "login") {
            if (!user) {
                user = await User.create({
                    name: name?.trim() || "Google User",
                    isEmailVerified: true,
                    email: normalizedEmail,
                    googleId,
                });
            } else {
                if (user.googleId && user.googleId !== googleId) {
                    return res.status(409).json({
                        success: false,
                        message: "This email is linked to another Google account.",
                    });
                }

                user.googleId = googleId;
                await user.save();
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid authentication mode.",
            });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: "Google authentication successful.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                resume: user.resume,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Google authentication failed.",
        });
    }
};
export { registerUser, verifyEmail, loginUser, resendOTP, googleLogin};
