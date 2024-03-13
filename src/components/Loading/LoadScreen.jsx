import style from '../../styles/components/LoadScreen.module.css'
import loading from '../../assets/icons/loading.svg'
import { useEffect, useState } from 'react';

import PropTypes from 'prop-types'

LoadScreen.propTypes = {
    isLoaded: PropTypes.bool,
    delay: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
}
LoadScreen.defaultProps = {
    isLoaded: false,
    delay: 1500,
}
export default function LoadScreen({isLoaded, delay, children}){

    const [visible, setVisible] = useState(false)

    useEffect(()=>{
        if(isLoaded){
            setTimeout(()=>{setVisible(true)},delay)
        }
    },[isLoaded, delay])

    return (
        <>
            {visible ? null : <div className={`${style.container} ${visible ? style.hidden : ''}`}>
                <h1 className={style.description}>Loading</h1>
                <img className={style.icon} src={loading}></img>
            </div>}
            <div className={`${style.container} ${visible ? '' : style.hidden}`}>
                    {children}
            </div>
        </>
    );
}