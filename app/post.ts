import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';

export type Post = {
    slug: string;
    title: string;
}

export type PostMarkdownAttributes = {
    title: string;
}

const postsPath = path.join(__dirname,"..","posts");

function isValidatePostAttributes(attributes:any):attributes is PostMarkdownAttributes {
    return attributes?.title
}
export const getPosts = async () => {
    const dir = await fs.readdir(postsPath);
    return Promise.all(
        dir.map(async filename =>{
            const file = await fs.readFile(path.join(postsPath,filename));
            const {attributes} = parseFrontMatter(file.toString());
            invariant(isValidatePostAttributes(attributes),`${filename} has a bad meta data!`)    
            return {
                slug: filename.replace(/\.md$/,""),
                title: attributes.title
            }
        })
    )
    
}