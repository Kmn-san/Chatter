import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/chatModel";
import { User } from "../models/userModel"; // Assuming you have a User model
import { isValidObjectId, Types } from "mongoose";

interface PopulatedParticipant {
    _id: Types.ObjectId;
    name: string;
    email: string;
    avatar?: string;
}

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const chats = await Chat.find({ participants: userId })
            .populate<{ participants: PopulatedParticipant[] }>("participants", "name email avatar")
            .populate("lastMessage")
            .sort({ lastMessageAt: -1 })
            .lean(); // Use lean for better performance

        // Remove self and format response
        const formattedChats = chats.map((chat) => {
            const otherParticipant = chat.participants.find(
                (p: PopulatedParticipant) => p._id.toString() !== userId
            );

            return {
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage || null,
                lastMessageAt: chat.lastMessageAt || chat.createdAt,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            };
        });

        res.json(formattedChats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({
            message: "Failed to fetch chats",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const { participantId } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!participantId) {
            res.status(400).json({ message: "Participant ID is required" });
            return;
        }

        if (!isValidObjectId(participantId)) {
            res.status(400).json({ message: "Invalid participant ID" });
            return;
        }

        if (participantId === userId) {
            res.status(400).json({ message: "Cannot create chat with yourself" });
            return;
        }

        // Check if participant exists
        const participant = await User.findById(participantId).select("name email avatar");
        if (!participant) {
            res.status(404).json({ message: "Participant not found" });
            return;
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [userId, participantId] }
        })
            .populate<{ participants: PopulatedParticipant[] }>("participants", "name email avatar")
            .populate("lastMessage")
            .lean();

        if (!chat) {
            // Create new chat
            const newChat = new Chat({
                participants: [userId, participantId]
            });

            await newChat.save();

            // Fetch the created chat with populated data
            chat = await Chat.findById(newChat._id)
                .populate<{ participants: PopulatedParticipant[] }>("participants", "name email avatar")
                .populate("lastMessage")
                .lean();
        }

        if (!chat) {
            res.status(500).json({ message: "Failed to create chat" });
            return;
        }

        const otherParticipant = chat.participants.find(
            (p: PopulatedParticipant) => p._id.toString() !== userId
        );

        res.json({
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage || null,
            lastMessageAt: chat.lastMessageAt || chat.createdAt,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}