import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Markdown from "react-markdown";

import blogAPI from './blogAPI';

import style from '/src/styles/components/Post.module.css'

export default function Post(){

    const { pid } = useParams();
    const [post, setPost] = useState();

    useEffect(()=>{
        const [responseGetPost, cancelGetPost] = blogAPI.getPost(pid)

        let timeoutID;
        responseGetPost
            .then(data=>{ 
                // Set a timeout from when the posts is loaded vs displayed so that there is no jarring effect between switching on or off the load screen too quickly
                timeoutID = setTimeout(()=>{
                    setPost(data.details);
                }, 500);
            })
            .catch((err)=>{
                //TODO: Redirect to error page
                console.warn(err);
            })

        return ()=>{
            clearTimeout(timeoutID);
            cancelGetPost();
        }
    },[pid])

    useEffect(()=>{
        if(post){
            console.log(post)
        }
    },[post])

    // TODO: Temporary screen when loading
    if(!post) return null;
    return (
        <article className={style.paper}>
            <h1 className={style.title}>{post.title}</h1>
            <p className={style.date}>Posted: {new Date(post.created_at).toDateString()}{ (new Date(post.created_at).toDateString() !== new Date(post.updated_at).toDateString()) ? (<>{' // '}Last edit: {new Date(post.updated_at).toDateString()}</>) : null}</p>
            <section className={style.content}>
                <Markdown>
                    {post.details}
                </Markdown>
            </section>
        </article>
    );
}