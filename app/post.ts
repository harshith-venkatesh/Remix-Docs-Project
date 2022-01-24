import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import {marked} from 'marked'

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
const getPosts = async () => {
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

const getPost = async (slug: string) => {
    const filepath = path.join(postsPath,slug + '.md');
    const file = await fs.readFile(filepath);
    const {attributes, body } = parseFrontMatter(file.toString());
    invariant(isValidatePostAttributes(attributes), `Post ${filepath} is missing attributes`);
    const html = marked(body)
    return { slug,html, title: attributes.title}
}
export { getPosts, getPost}