import { useState, useEffect } from "react";

export default function PostFetcher(){

    const [posts, setPosts] = useState();

    useEffect(()=>{
        fetch('http://localhost:3000/api/blog/posts')
            .then(data => {
                return data.json();
            })
            .then(setPosts)
            .catch(err=>{
                console.log('Something went wrong',err);
            })
    },[])

    useEffect(()=>{
        if(!posts) return;

        console.log('Found posts',posts);
    })

    return null;
}