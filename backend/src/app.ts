import express from "express"
import authRoutes from "./router/authRoutes.ts"
import chatRoutes from "./router/chatRoutes.ts"
import messageRoutes from "./router/messageRoutes.ts"
import userRoutes from "./router/userRoutes.ts"

const app = express();

app.use(express.json()) // parse incoming JSON request bodies and makes them available as req.body in your route handlers.

app.use("/api/auth", authRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

export default app;