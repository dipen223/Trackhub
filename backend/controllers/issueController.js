import mongoose from mongoose;
import Issue from "../models/issueModel";
import Repository from "../models/repoModel";
import User from "../models/userModel";


const createIssue = async (req,res) =>{
    const {title,description} = req.body;
    const {id} = req.params;

    try{
            const issue = new Issue({
        title:title,
        description:description,
        repository:id
    });

    await issue.save();
    res.status(201).json(issue);

    }
    catch(err){
        console.error("Error creating an issue: ",err.message);
        res.status(500).send("Server Error");
    }


    
};


const updateIssueById = async (req,res) =>{
    const {id} = req.params;
    const {title,description,status} = req.body;

    try{
        const issue = await Issue.findById(id);

        if(!issue){
            res.status(404).send("Issue not found!");
        
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;


        await issue.save();

        res.json({message:"Issue Updated"},issue);
        
    } catch(err){
        console.error("Error updating an issue: ",err.message);
        res.status(500).send("Server Error");
    }

};

const deleteIssueById = async (req,res) =>{
   const {id} = req.params;

    try{
        const issue = await Issue.findByIdAndDelete(id);

        if(!isssue){
             res.status(404).send("Issue not found!");
        }

        res.json({message:"Issue Deleted Successfully!"});
        
    } catch(err){
        console.error("Error deleting an issue: ",err.message);
        res.status(500).send("Server Error");
    }
};

const getAllIssues = async (req,res) =>{
    const {id} = req.params;
    try{

        const issues = await Issue.find({repository:id});
        if(!issues){
            res.status(404).json({error:"Issues not found! "});
        }
        res.status(200).json(issues);
        

    } catch(err){
        console.error("Error during issue fetching: ",err.message);
        res.status(500).send("Server Error");
    }
};


const getIssueById = async (req,res) =>{
    const {id} = req.params;

    try{
        const issue = Issue.findById(id);
        if(!issue){
            res.status(404).json({error:"Issue not found! "});
        }

        res.json(issue);
    }
     catch(err){
        console.error("Error fetching an issue: ",err.message);
        res.status(500).send("Server Error");
    }
};

export default {createIssue,updateIssueById,deleteIssueById,getAllIssues,getIssueById};