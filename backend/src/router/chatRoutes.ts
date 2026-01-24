import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreatechat } from "../controllers/chatController";

const router = Router()

router.use(protectRoute)

router.get("/", getChats)
router.post("/with/:participantId", getOrCreatechat)


export default router;