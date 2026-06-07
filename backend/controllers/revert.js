import fs from "fs"
import path from "path";
import promisify from "util";

const readDir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);



async function revertRepo(commitID){
    const repoPath = path.resolve(process.cwd(),".track");
    const commitsPath = path.join(repoPath,"commits");

    try{
        const commitDir = path.join(commitsPath,commitID);
        const files = await readDir(commitDir);
        const parentDir = path.resolve(repoPath,'..');
        for(const file of files){
            await copyFile(path.join(commitDir,file),path.join(parentDir,file));
        }

        console.log(`Commit ${commitID} reverted successfully`);
        
    }catch(err){
        console.error("Unable to revert repo",err);
    }

};

export default revertRepo;