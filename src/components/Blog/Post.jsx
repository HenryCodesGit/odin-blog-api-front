import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Markdown from "react-markdown";

import blogAPI from './blogAPI';

import style from '/src/styles/components/Post.module.css'

import paper from '/src/assets/tool/noise.svg'

export default function Post(){

    const { pid } = useParams();
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const modalRef = useRef();
    const nameRef = useRef();
    const commentRef = useRef();

    // Get post data
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

    // Get comment data
    useEffect(()=>{
        const [responseGetComment, cancelGetComment] = blogAPI.getComments({pid})

        let timeoutID;
        responseGetComment
            .then(data=>{ 
                // Set a timeout from when the posts is loaded vs displayed so that there is no jarring effect between switching on or off the load screen too quickly
                timeoutID = setTimeout(()=>{
                    setComments(data.details);
                }, 500);
            })
            .catch((err)=>{
                //TODO: Redirect to error page
                console.warn(err);
            })

        return ()=>{
            clearTimeout(timeoutID);
            cancelGetComment();
        }
    },[pid])

    useEffect(()=>{
        if(!comments) return;

        console.log(comments);
        
    },[comments])

    function showForm(){
        modalRef.current.showModal();
    }

    function closeFormAndClear(){
        // Probably not needed because window is reloaded anyway, but whatever
        modalRef.current.close();
        nameRef.current.value = '';
        commentRef.current.value = '';    
    }

    function submitComment(event){
        event.preventDefault();
        
        // Get details
        const form =  new FormData(event.target);
        const name = form.get("name");
        const details = form.get("details");

        // Confirm if user wants to submit
        const verify = window.confirm('Are you sure you want to post this comment?')
        if (!verify) return;

        //Front-end validation
        if(name.length > 10) return alert('There was an issue submitting the comment. Name must be max 10 characters') //Return and allow user to try again?

        const [response] = blogAPI.makeComment({pid,name,details})
        response
            .then((data)=>{
                // If there was no error, then we know that the post succeeded. Thus update the local array to fake the commment information
                const newComments = [...comments];
                newComments.push(data.details)
                setComments(newComments);
                closeFormAndClear();
            })
            .catch((err)=>{
                return alert('There was an issue submitting the comment.') //Return and allow user to try again?
            })
    }

    const commentComponent = (!comments || !comments.length) ? 
        (<li className={`${style.content} ${style.comment}`}>
                <p className={style.commenter}>Henry Ma</p>
                <blockquote className={style.message}>It looks like no one has commented on this post yet.. Maybe you can be the first!</blockquote>
        </li>) : comments.map((comment)=>{
            return (
                <li key={comment.cid} className={`${style.content} ${style.comment}`}>
                    <p className={style.commenter}>{comment.name}</p>
                    <blockquote className={style.message}>{comment.details}</blockquote>
                </li>
            )
        });

    // TODO: Temporary screen when loading
    if(!post) return null;
    return (
        <div className={style.container}>
            <dialog className={style.modal} ref={modalRef}>
                <form className={style.form} onSubmit={submitComment}>
                    <label className={style.label}>
                        <h2 className={`${style.content} ${style.formTitle}`}>Name</h2>
                        <input ref={nameRef} className={`${style.input}`} type="text" name="name" id="name" required={true} maxLength='10'/>
                    </label>
                    <label className={style.label}>
                        <h2 className={`${style.content} ${style.formTitle}`}>Comment</h2>
                        <input ref={commentRef} className={`${style.input}`} type="text" name="details" id="details" required={true}/>
                    </label>
                    <div className={style.buttonContainer}>
                        <button type="button" className={`${style.formButton} ${style.cancel}`} onClick={closeFormAndClear}>Cancel</button>
                        <button type="submit" className={`${style.formButton} ${style.submit}`}>Submit</button>
                    </div>
                </form>
            </dialog>
            <article className={style.paper} style={{backgroundImage: `url('${paper}')`}}>
                <h1 className={style.title}>{post.title}</h1>
                <p className={style.date}>Posted: {new Date(post.created_at).toDateString()}{ (new Date(post.created_at).toDateString() !== new Date(post.updated_at).toDateString()) ? (<>{' // '}Last edit: {new Date(post.updated_at).toDateString()}</>) : null}</p>
                <section className={style.content}>
                    <Markdown>
                        {post.details}
                    </Markdown>
                </section>
            </article>
            <div className={style.comments} style={{backgroundImage: `url('${paper}')`}} >
                <div className={style.titleComments}>
                    <h1>Comments</h1>
                    <button className={style.commentButton} onClick={showForm}>Add comment</button>
                </div>
                <div className={style.commentScroll}>
                    {commentComponent}
                </div>
            </div>
        </div>
    );
}