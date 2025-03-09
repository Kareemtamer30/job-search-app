import authRouter from "./src/modules/auth/auth.controller.js"
import helmet from "helmet"
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import{schema} from "./src/DB/graphql/schema.js"
import {connectDB} from "./src/DB/db.connection.js";
import {globalErrorHandler} from "./src/utils/error/error.res.js";
import { graphqlHTTP } from "express-graphql"
import adminRouter from "./src/modules/admin/admin.controller.js"
import userRouter from "./src/modules/user/user.controller.js";
import chatRouter from"./src/modules/chat/chat.controller.js"
import companyRouter from"./src/modules/company/company.controller.js"
import jobsRouter from "./src/modules/jobs/jobs.controller.js"
import {resolvers} from "./src/DB/graphql/resolver.js";
import {ChatModel} from "./src/models/chat.model.js";
export const bootstrap=async (app,express)=>{

    app.use(express.json());
    app.use(globalErrorHandler)
    //// connect to db
    await connectDB()

    ///// auth
    app.use("/auth",authRouter)
    /////user
    app.use("/user",userRouter)
    //////// graphql
    app.use(
        "/graphql",
        graphqlHTTP({
            schema,
            rootValue: resolvers,
            graphiql: true, // Enable GraphQL for testing
        },adminRouter)
    );
    ///// company
    app.use("/company", companyRouter);
    ///// jobs
    app.use("/jobs",jobsRouter)
//////////////// chat/////////

    app.use("/chat",chatRouter)

    // Create HTTP server
    const server = http.createServer(app);

// Initialize Socket.IO
    const io = new Server(server);

// Socket.IO connection handler
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a room based on user ID
        socket.on('join-room', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });

        // Handle sending messages
        socket.on('send-message', async (data) => {
            const { sender, receiver, message } = data;

            // Save the message to the database
            const chatMessage = new ChatModel({
                sender,
                receiver,
                message,
            });

            await chatMessage.save();

            // Emit the message to the receiver's room
            io.to(receiver).emit('receive-message', chatMessage);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });

    /////// limit

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again after 15 minutes',
    });

// Apply the rate limiter to all requests
    app.use(limiter);

    ////////// helmet
    // Use Helmet to set secure HTTP headers
    app.use(helmet());

    /////////// cors

    // CORS configuration
    const corsOptions = {
        origin: ['http://example.com', 'http://localhost:3000'], // Allow only these origins
        methods: 'GET,POST,PUT,DELETE', // Allow only these HTTP methods
        credentials: true, // Allow cookies and credentials
    };

// Apply CORS middleware
    app.use(cors(corsOptions));



}