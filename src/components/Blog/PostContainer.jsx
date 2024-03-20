import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';

import blogAPI from './blogAPI';

import style from '/src/styles/components/PostContainer.module.css'

PostContainer.defaultProps={ 
    limit: 10,
}

PostContainer.propTypes = {
    limit: PropTypes.number,
}

// TODO: Loading spinner when fetching posts. 
// TODO: Set the start as the actual pid instead of a random integer. It's causing issues right now because post numbers are not always sequentially increasing. (Sometimes it skips by 1 if a post was deleted in between);
export default function PostContainer({limit}){

    const [posts, setPosts] = useState(null)
    const [maxPosts, setMax] = useState(null)
    const [start, setStart] = useState(0)
    const carouselRef = useRef();

    // Get posts on initial mount
    useEffect(()=>{
        const [responseGetPosts, cancelGetPosts] = blogAPI.getPosts({start, limit});

        let timeoutID;
        responseGetPosts
            .then(data=>{ 
                timeoutID = setTimeout(()=>{
                    setPosts(data.details);
                    setMax(data.count);
                }, 500);
            })
            .catch((err)=>{
                //TODO: Redirect to error page
                console.warn(err);
            })

        return ()=>{
            clearTimeout(timeoutID);
            cancelGetPosts();
        }
    },[start, limit])

    // Do stuff when new posts are captured
    useEffect(()=>{
        if(!posts) return;
        console.log(posts);
    },[posts])

    function mapPosts(){
        const output = [];
        if(posts && posts.length){
            posts.forEach(post=> output.push(
                <li key={post.pid} className={style.post}><a className={style.link} href={`/blog/post/${post.pid}`}>
                    <h2 className={style.title}>{post.title}</h2>
                    <p className={style.date}>{new Date(post.created_at).toDateString()}</p>
                </a></li>)  
            )
        }
        
        // Empty spaces get filled with blanks
        for(let i = output.length; i<limit; i++){
            output.push(
                <li key={`LOADING_ONLY_${i}`} className={`${style.post}`}><a className={`${style.link} ${style.loading}`}>
                <h2 className={style.title} style={(posts && posts.length) ? {visibility:'hidden'} : {}}>Loading</h2>
                <p className={style.date} style={(posts && posts.length) ? {visibility:'hidden'} : {}}>...</p>
                </a></li>
            )
        }
        
        return output;
    }

    return (<ul className={style.carousel} ref={carouselRef}>
            <h1 className={style.heading}>/posts/</h1>
            { mapPosts() }
            <nav className={style.pageNav}>
            <button
                className={style.pageButton} 
                onClick={()=>{
                    if(start>=limit){
                        carouselRef.current.parentNode.scrollTo({top: 0, left: 0});
                        setStart(start-limit)
                        setPosts(null);
                    };
                }} 
                disabled={start<=0}
            > {`<<<`} </button>
            <p className={style.pageCount}> Page {start / limit + 1}/{parseInt(maxPosts/limit) + 1} </p>
            <button
                className={style.pageButton} 
                onClick={()=>{
                    carouselRef.current.parentNode.scrollTo({top: 0, left: 0});
                    setStart(start+limit);
                    setPosts(null);
                }}
                disabled={start / limit >= parseInt(maxPosts/limit)}    
            >{`>>>`}</button>
            </nav>
    </ul>);
}