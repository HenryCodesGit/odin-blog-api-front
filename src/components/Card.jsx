import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import style from '../styles/components/Card.module.css'

Card.propTypes = {
    imgURL: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string
}

function Card({imgURL, description, link}){

    const imageRef = useRef(null);
    const textRef = useRef(null);

    useEffect(()=>{

        const currentImage = imageRef.current;
        const currentText = textRef.current;

        const addImageClass = () => currentImage.classList.add(style.blurImage);
        const removeImageClass = () => currentImage.classList.remove(style.blurImage)
        currentImage.addEventListener('touchstart', addImageClass);
        currentImage.addEventListener('touchend', removeImageClass);
        currentImage.addEventListener('mouseenter', addImageClass);
        currentImage.addEventListener('mouseout', removeImageClass);

        const addTextClass = () => currentText.classList.add(style.blurText);
        const removeTextClass = () => currentText.classList.remove(style.blurText)
        currentImage.addEventListener('touchstart', addTextClass);
        currentImage.addEventListener('touchend', removeTextClass);
        currentImage.addEventListener('mouseenter', addTextClass);
        currentImage.addEventListener('mouseout', removeTextClass);

        return ()=>{
            currentImage.removeEventListener('touchstart', addImageClass);
            currentImage.removeEventListener('touchend', removeImageClass);
            currentImage.removeEventListener('mouseenter', addTextClass);
            currentImage.removeEventListener('mouseout', removeTextClass);
        }
    })

    return(
        <li className={style.card}>
            <a href={link}>
                <div className={style.backgroundVignette}></div>
                <div ref={imageRef} className={style.image} role="img" style={{backgroundImage: `url(${imgURL})`}} aria-label={description}></div>
                <p ref={textRef} className={style.description}>{description}</p>
            </a>
        </li>        
    )
}

export default Card