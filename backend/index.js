    import express from "express";
    import dotenv from "dotenv";
    import cors from "cors";
    import mongoose from "mongoose";
    import bodyParser from "body-parser";
    import http from "http";
    import {Server} from "socket.io"
    import router from "./routes/main.router.js";

    import yargs from "yargs";
    import {hideBin} from "yargs/helpers";


    import initRepo from "./controllers/init.js";
    import add from "./controllers/add.js";
    import commitRepo from "./controllers/commit.js";
    import pushRepo from "./controllers/push.js";
    import pullRepo from "./controllers/pull.js";
    import revertRepo from "./controllers/revert.js";

    dotenv.config();

    yargs(hideBin(process.argv))
    .command("start","Starts a new server",{},startServer)
    .command("init","Initialize a new repository",{},initRepo)
    .command("add <file>","Add a file to the repository",
        (yargs) => {yargs.positional("file",{
        describe:"File to add to the staging area",
        type:"string",
    })},(argv) => {
        add(argv.file);
    })
    .command("commit <message>","Commit the staged files",(yargs) => {yargs.positional("message",{
        describe:"Commit Message",
        type:"string",
    })},
    (argv) => {
        commitRepo(argv.message);
    }

    )

    .command("push","Push commits to S3",{},pushRepo)
    .command("pull","Pull commits from S3",{},pullRepo)
    .command(
        "revert <commitID>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "Commit ID to revert to",
                type: "string",
            });
        },
        (argv) => {revertRepo(argv.commitID)}
    )
    .demandCommand(1,"You need at least one command")
    .help().argv;


    function startServer (){
        const app = express();
        const port = process.env.PORT || 3000;
        app.use(bodyParser.json());
        app.use(express.json());

        const mongoURI = process.env.MONGO_URL;
        mongoose.connect(mongoURI).then(() =>{
            console.log("Connected to MongoDB");
        }).catch((err) => console.err("Unable to connect",err));
        
        app.use(cors({origin:"*"}));
        app.use("/",router);

        

        let user = "test";

        const httpServer = http.createServer(app);
        const io = new Server(httpServer,{
            cors:{
                origin:"*",
                methods:["GET","POST"],
            },
        });

        io.on("connection",(socket) => {
            socket.on("joinRoom", (userID) =>{
                user = userID;
                console.log("=====");
                console.log(user);
                console.log("=====");
                socket.join(user);
            });
        });

        const db = mongoose.connection;

        db.once("open", async() =>{
            console.log("CRUD operations called!");
        });

        httpServer.listen(port,() =>{
            console.log(`Server is running on port ${port}`);
        })
    }

    