import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/userModel";
import { clerkClient, getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary";


export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ message: "User not found" })
            return;
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500)
        next(error)
    }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const update: any = {}

        if (req.body.name) {
            update.name = req.body.name
        }

        if (req.file) {
            // 🔥 upload directly from memory
            const base64 = req.file.buffer.toString("base64")
            const dataUri = `data:${req.file.mimetype};base64,${base64}`

            const uploadResult = await cloudinary.uploader.upload(dataUri, {
                folder: "user-profile",
                transformation: [
                    { width: 500, height: 500, crop: "limit", quality: "auto" },
                ],
            })
            update.avatar = uploadResult.secure_url
        }
        const updatedData = await User.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true }
        )
        if (!updatedData) {
            res.status(404).json({ message: "User not found" })
            return
        }
        res.status(200).json(updatedData)
    } catch (error) {
        res.status(500)
        next(error)
    }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId: clerkId } = getAuth(req);
        if (!clerkId) {
            res.status(401).json({ message: "Unauthorized " })
            return
        }

        let user = await User.findOne({ clerkId })
        if (!user) {
            // get user info from clerk and save to db
            const clerkUser = await clerkClient.users.getUser(clerkId)

            user = await User.create({
                clerkId,
                name: clerkUser.firstName
                    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
                    : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] || "User",
                email: clerkUser.emailAddresses[0]?.emailAddress,
                avatar: clerkUser.imageUrl
            })
        }
        res.json(user)
    } catch (error) {
        res.status(500)
        next(error)
    }
}