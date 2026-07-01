import { useState, useEffect } from "react";
import "./dashboard.css"
import axios from "axios";
import Navbar from "../Navbar";
const Dashboard = () => {

    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [starredRepositories, setStarredRepositories] = useState([]);

    useEffect(() => {

        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
                const data = await response.json();
                setRepositories(data.repositories);
            } catch (err) {
                console.error("Error fetching repositories", err);
            }
        };


        const fetchSuggestedRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:3000/repo/all`);
                const data = await response.json();
                setSuggestedRepositories(data);
            } catch (err) {
                console.error("Error fetching repositories", err);
            }
        };
        fetchRepositories();
        fetchSuggestedRepositories();



    }, []);

    useEffect(() => {
        if (searchQuery == '') {
            setSearchResults(repositories);
        } else {
            const filteredRepo = repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));

            setSearchResults(filteredRepo);
        }
    }, [searchQuery, repositories]);

    const fetchStarredRepositories = async () => {
    try {
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
            `http://localhost:3000/starredRepositories/${userId}`
        );

        setStarredRepositories(response.data);
    } catch (err) {
        console.error(err);
    }
};
useEffect(() => {
    fetchStarredRepositories();
}, []);

const handleStar = async (repoId) => {
    try {
        const userId = localStorage.getItem("userId");

        await axios.put(
            `http://localhost:3000/starRepository/${repoId}`,
            { userId }
        );

        await fetchStarredRepositories(); // Refresh the UI
    } catch (err) {
        console.error(err);
    }
};


   

    return<> 
    <Navbar/>
    <section>
        <aside>
            <h2>Suggested Repositories</h2>
            {suggestedRepositories.map((repo) => {

                const isStarred = starredRepositories.some(
                    starredRepo => starredRepo._id === repo._id
                );

                return (
                    <div key={repo._id}>
                        <div className="starRepo">
                            <h4>{repo.name}</h4>
                            <button onClick={() => handleStar(repo._id)}><i className={isStarred ? "fa-solid fa-star":"fa-regular fa-star"}></i></button>

                        </div>
                        <h4>{repo.description}</h4>
                    </div>
                )
            })}
        </aside>
        <main>
            <h2>Your Repositories</h2>
            <div id="search">
                <input type="text" value={searchQuery} placeholder="Search.." onChange={(e) => { setSearchQuery(e.target.value) }} />


            </div>
            {searchResults.map((repo) => {
                return (
                    <div key={repo._id}>
                        <h4>{repo.name}</h4>
                        <h4>{repo.description}</h4>
                    </div>
                )
            })}
        </main>
        <aside>
            <h3>Upcoming Events</h3>
            <ul>
                <li><p>Agentic AI</p></li>
                <li><p>Github Copilot</p></li>
                <li><p>Tech Conference</p></li>
            </ul>
        </aside>
    </section>

    </>

}

export default Dashboard;