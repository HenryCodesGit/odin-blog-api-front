import style from '../../styles/components/ImageLoader.module.css'

import { useState } from 'react'

export default function ImageLoader(imgProps){

    const [loaded, setLoaded] = useState(false)

    const modifiedProps = Object.assign({...imgProps}, {className: `${Object.hasOwn(imgProps,'className') ? imgProps.className : ''}${loaded ? '' : ` ${style.hidden}`}`, onLoad: ()=>{setLoaded(true)}})

    return(
        <>
            <div className={`${style.spinner}${loaded ? ` ${style.hidden}` : ''}`} />
            <img {...modifiedProps} />
        </>
    )
}