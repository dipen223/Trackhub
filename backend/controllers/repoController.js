import mongoose from "mongoose";

import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";


const createRepository = async (req,res) =>{
    const {owner,name,issues,content,description,visibility} = req.body;
    

    try{
        if(!name){
            return res.status(400).json({message:"All fields are required"});
        
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({message:"Invalid owner ID"});
        }

        const newRepository =  new Repository({
          name,
          description,
          content,
          owner,
          visibility,
          issues,
        });

        const result = await newRepository.save();

        res.status(201).json({message:"Repository created!",repositoryId:result._id});

    }catch(err){
        console.error("Error creating repository",err);
        res.status(500).send("Server error!");
    }

    
};

const getAllRepos = async (req,res) =>{
    try{
        const repositories = await Repository.find({}).populate("owner").populate("issues");
        res.json(repositories);

    }catch(err){
        console.error("Erroe fetching repositoriees",err.message);
        res.status(500).send("Server error!",err.message);
    }
   
};

const fetchRepoById = async (req,res) =>{
    const {id} = req.params;

    try{
        const repository = await Repository.find({_id:id}).populate("owner").populate("issues");
        if(!repository){
            return res.status(404).send("Repository not found");
        }
        res.json(repository);

    }catch(err){
        console.error("Error fetching the repository",err.message);
        res.status(500).send("Server Error!");
    }

};

const fetchRepoByName = async (req,res) =>{
    const {name} = req.params;

    try{
        const repository = await Repository.find({name:name}).populate("owner").populate("issues");
        if(!repository){
            res.status(404).send("Repository not found");
        }

        res.json(repository);

    }catch(err){
        console.error("Error fetching the repository",err.message);
        res.status(500).send("Server Error!");
    }
};

const fetchRepoForCurrentUser = async (req,res) =>{
    const userId = req.user;
    try{
        const repositories = await Repository.find({owner:userId});
        if(!repositories || repositories.length == 0){
            return res.status(404).json({error:"User repositories not found"});
        }

        res.json({message:"Repositories Found!",repositories});

    }catch(err){
        console.error("Error during fetching user repository: ");
        res.status(500).send("Server Error");

    }
};

const updateRepoById = async (req,res) =>{
    const {id} = req.params;
    const {content,description} = req.body;

    try{
        const repository = await findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"});
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();
        res.json({
            message:"Repository Updated Successfully!",
            repository:updatedRepository
        });

    }catch(err){
        console.error("Error during updating the repository: ",err.message);
        res.status(500).send("Server Error");
    }

}

const toggleVisibilityById =  async (req,res) =>{
    const {id} = req.params;
    try{
        const repository = await Repository.findById(id);
          if(!repository){
            return res.status(404).json({error:"Repository not found"});
        }
        repository.visibility = !repository.visibility;
        const updatedRepository = await repository.save();
        res.json({
            message:"Repository Toggled Successfully!",
            repository:updatedRepository
        });


    }catch(err){
        console.error("Unable to togggle the repository: ",err.message);
        res.status(500).send("Server Error");
    }
}


const deleteRepoById = async (req,res) =>{
    const {id} = req.params;

    try{
        const repository = await Repository.findByIdAndDelete(id);


        if(!repository){
            return res.status(404).json({error:"Repository not found!"});
        }

        res.json({message:"Repository deleted Successfully!"});

    }catch(err){
        console.error("Error Deleting Repository: ",err.message);
        res.status(500).send("Server Error!");
    }
}

export default {createRepository,getAllRepos,fetchRepoById,fetchRepoByName,fetchRepoForCurrentUser,updateRepoById,toggleVisibilityById,deleteRepoById};





