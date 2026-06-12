const createRepository = (req,res) =>{
    res.send("Repository created!");
};

const getAllRepos = (req,res) =>{
    res.send("All repos fetched!");
};

const fetchRepoById = (req,res) =>{
    res.send("Repo fetched!");

};

const fetchRepoByName = (req,res) =>{
    res.send("Repo fetched!");
};

const fetchRepoForCurrentUser = (req,res) =>{
    res.send("Repo fetched!");
};

const updateRepoById = (req,res) =>{
    res.send("Repo updated!");
}

const toggleVisibilityById = (req,res) =>{
    res.send("Visibility toggled!");
}


const deleteRepoById = (req,res) =>{
    res.send("Repo deleted!");
}


export default {createRepository,getAllRepos,fetchRepoById,fetchRepoByName,fetchRepoForCurrentUser,updateRepoById,toggleVisibilityById,deleteRepoById};





