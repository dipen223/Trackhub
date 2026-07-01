import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [starredRepositories, setStarredRepositories] = useState([]);
    const [userDetails,setUserDetails] = useState({name:"username"});

    useEffect(() => {

        const fetchUserDetails  = async() =>{
            const userId = localStorage.getItem("userId");
            if(userId){
                try{
                    const response  = await axios.get(`http://localhost:3000/userProfile/${userId}`);
                    setUserDetails(response.data.user);
                }catch(err){
                    console.error("Error fetching user details",err);
                }
            }
    };
    fetchUserDetails();


    },[])

    useEffect(() => {
        const fetchStarredRepositories = async () => {
            try {
                const userId = localStorage.getItem("userId");

                const response = await axios.get(
                    `http://localhost:3000/starredRepositories/${userId}`
                );

                setStarredRepositories(response.data);
            } catch (err) {
                console.error("Error fetching starred repositories:", err);
            }
        };

        fetchStarredRepositories();
    }, []);

    return (
        <div className="profilePage">

            {/* LEFT PANEL */}
            <aside className="leftPanel">

                <img
                    src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                    alt="Profile"
                />

                <h2>{userDetails.username}</h2>
            
                <button>Edit Profile</button>

                <div className="stats">
                    <p>📦 12 Repositories</p>
                    <p>⭐ {starredRepositories.length} Starred</p>
                    <p>👥 15 Following</p>
                </div>

            </aside>

            {/* RIGHT PANEL */}
            <main className="rightPanel">

                {/* TABS */}
                <div className="tabs">

                    <button
                        className={activeTab === "overview" ? "active" : ""}
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview
                    </button>

                    <button
                        className={activeTab === "starred" ? "active" : ""}
                        onClick={() => setActiveTab("starred")}
                    >
                        ⭐ Starred Repositories
                    </button>

                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="overview">

                        <h2>Overview</h2>

                        <p>
                            <strong>Email:</strong> dipen@example.com
                        </p>

                        <p>
                            Passionate Full Stack Developer building
                            GitHub-like applications using React, Node.js,
                            and MongoDB.
                        </p>

                    </div>
                )}

                {/* STARRED TAB */}
                {activeTab === "starred" && (
                    <div className="starred">

                        <h2>Starred Repositories</h2>

                        {starredRepositories.length === 0 ? (
                            <p>No starred repositories yet.</p>
                        ) : (
                            starredRepositories.map((repo) => (
                                <div className="repoCard" key={repo._id}>
                                    <h3>{repo.name}</h3>
                                    <p>{repo.description}</p>
                                </div>
                            ))
                        )}

                    </div>
                )}

            </main>

        </div>
    );
};

export default Profile;