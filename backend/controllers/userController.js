import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";


dotenv.config();

const uri = process.env.MONGO_URL;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}

const getAllUsers = async (req, res) => {
    try {
        await connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);

    } catch (err) {
        console.error("Error during fetching: ", err.message);
        res.status(500).send("Server error!");
    }
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send("All fields are required");
    }
    try {
        await connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepository: []
        }
        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: token.insertedId });

    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");


        const existingUser = await usersCollection.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: existingUser._id });
    } catch (err) {

        console.error("Error during login:", err.message);
        res.status(500).send("Server error!");
    }
};


const getUserProfile = async (req, res) => {
    const currentId = req.params.id;

    try {
        await connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentId)
        });

        if (!user) {
            return res.status(404).send("User not found!");
        }
        return res.json({
            message: "profile fetched",
            user
        });

    } catch (err) {
        console.error("Error during fetching: ", err.message);
        res.status(500).send("Server error!");
    }
}


const updateUserProfile = async (req, res) => {
    const currentId = req.params.id;
    const { email, password } = req.body;

    try {
        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        await connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");

        const result = await usersCollection.findOneAndUpdate(
            {
                _id: new ObjectId(currentId),
            }, { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!result.value) {
            return res.status(404).send("User not found!");
        }

        res.json({
            message: "Profile updated",
            user: result.value,
        });

    } catch (err) {
        console.error("Error during updating: ", err.message);
        res.status(500).send("Server error!");
    }

};

const deleteUserProfile = (req, res) => {
    const userId = req.params.id;
    try {
        connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");
        const result = usersCollection.deleteOne({ _id: new ObjectId(userId) });
        if (result.deletedCount === 0) {
            return res.status(404).send("User not found!");
        };

        res.json({ message: "User deleted" });
    } catch (err) {
        console.error("Error during deleting: ", err.message);
        res.status(500).send("Server error!");
    }
}

const starRepository = async (req, res) => {
    const { repoId } = req.params;
    const { userId } = req.body;

    try {
        await connectClient();
        const db = client.db("githubDB");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(userId)
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const alreadyStarred = user.starRepository.some(
            id => id.toString() === repoId
        );

        if (alreadyStarred) {
            await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $pull: {
                        starRepository: new ObjectId(repoId)
                    }
                }
            );
        } else {
            await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $addToSet: {
                        starRepository: new ObjectId(repoId)
                    }
                }
            );
        }

        res.json({
            message: alreadyStarred
                ? "Repository unstarred"
                : "Repository starred"
        });

    } catch (err) {
        console.error("Error starring repository:", err);
        res.status(500).send("Server error!");
    }
};
const getStarredRepositories = async (req, res) => {
    const { userId } = req.params;

    await connectClient();
    const db = client.db("githubDB");

    const usersCollection = db.collection("users");
    const repositoriesCollection = db.collection("repositories");

    const user = await usersCollection.findOne({
        _id: new ObjectId(userId)
    });

    const starredRepos = await repositoriesCollection.find({
        _id: {
            $in: user.starRepository
        }
    }).toArray();

    res.json(starredRepos);
};


export default { getAllUsers, signup, login, getUserProfile, updateUserProfile, deleteUserProfile,starRepository,getStarredRepositories };