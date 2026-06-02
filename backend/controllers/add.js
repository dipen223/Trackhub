import fs from "fs/promises";
import path from "path";


async function add(filePath) {
    const repoPath = path.resolve(process.cwd(), ".track");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath,{recursive:true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath,path.join(stagingPath,fileName));
        console.log(`File ${fileName} added to staging area`);


    } catch (err) {
        console.error("Error adding file", err);
    }

}



export default add;