import { useState, useEffect } from "react";

const Dashboard = () => {

    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);


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

    return <h1>Dashboard</h1>


}

export default Dashboard;