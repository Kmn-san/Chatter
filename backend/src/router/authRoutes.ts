import { Router } from "express";
import { authCallback, getMe, updateProfile } from "../controllers/authController.ts"
import { protectRoute } from "../middleware/auth.ts";

const router = Router()

router.get("/me", protectRoute, getMe)
router.patch("/me", protectRoute, updateProfile)
router.post("/callback", authCallback)

export default router;