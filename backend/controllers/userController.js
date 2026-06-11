const getAllUsers = (req,res) =>{
    res.send("All users fetched!");

};

const signup  = (req,res) =>{
    res.send("User created successfully");
};

const login  = (req,res) =>{
    res.send("User logged in successfully");
};


const getUserProfile = (req,res) => {
    res.send("User profile fetched!");

}
const updateUserProfile = (req,res) => {

}

const deleteUserProfile = (req,res) =>{
    res.send("User profile deleted!");

}

export default {getAllUsers,signup,login,getUserProfile,updateUserProfile,deleteUserProfile};