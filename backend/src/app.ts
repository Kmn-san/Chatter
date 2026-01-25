import express from "express"
import path from "path"
import { clerkMiddleware } from '@clerk/express'
import authRoutes from "./router/authRoutes.ts"
import chatRoutes from "./router/chatRoutes.ts"
import messageRoutes from "./router/messageRoutes.ts"
import userRoutes from "./router/userRoutes.ts"
import { errorHandler } from "./middleware/errorHandler.ts"

const app = express();

app.use(express.json()) // parse incoming JSON request bodies and makes them available as req.body in your route handlers.

app.use(clerkMiddleware())

app.use("/api/auth", authRoutes)
app.use("/api/chats", chatRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)


// error handlers must come after all the routes and other middleware so tahy can catch errors passed with next(err) ot thrown inside async handlers
app.use(errorHandler)


// serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../web/dist")))

    app.get("/{*any}", (_, res) => {
        res.sendFile(path.join(__dirname, "../../web/dist/index.html"))
    })

}

export default app;