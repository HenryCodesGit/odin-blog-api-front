import { useRef, useEffect} from 'react';
import PropTypes from 'prop-types';

import useResizeEffect from '../react-utils/useResizeEffect';

import style from './MatterOverlay.module.css'

MatterOverlay.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element),
}

// Only function is to be a wrapper of its children for styling
export default function MatterOverlay({children}){
    return (
        <div className={style.overlay}>
            {children}
        </div>
    )
}