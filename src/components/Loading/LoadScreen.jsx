import style from '../../styles/components/LoadScreen.module.css'
import loading from '../../assets/icons/loading.svg'
import { useEffect, useState } from 'react';

import PropTypes from 'prop-types'

LoadScreen.propTypes = {
    isLoaded: PropTypes.bool,
    afterLoadHandler: PropTypes.func,
    delay: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
}
LoadScreen.defaultProps = {
    afterLoadHandler: ()=>{},
    isLoaded: false,
    delay: 1500,
}
export default function LoadScreen({isLoaded, afterLoadHandler, delay, children}){

    const [visible, setVisible] = useState(false)

    useEffect(()=>{
        if(isLoaded){
            setTimeout(()=>{
                setVisible(true);
                afterLoadHandler();
            },delay)
        }
    },[isLoaded, afterLoadHandler, delay])

    return (
        <>
            {visible ? null : <div className={`${style.container} ${visible ? style.hidden : ''}`}>
                <h1 className={style.description}>LOADING</h1>
                <div className={style.spinner}></div>
            </div>}
            <div className={`${style.container} ${visible ? '' : style.hidden}`}>
                    {children}
            </div>
        </>
    );
}