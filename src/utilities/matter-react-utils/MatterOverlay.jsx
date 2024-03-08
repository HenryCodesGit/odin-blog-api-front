import { useRef, useEffect, cloneElement} from 'react';
import PropTypes from 'prop-types';

import useResizeEffect from '../react-utils/useResizeEffect';

import style from './MatterOverlay.module.css'

MatterOverlay.propTypes = {
    elementHTML: PropTypes.element,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
    className: PropTypes.string
}

MatterOverlay.defaultProps = {
    elementHTML: (<div></div>)
}

// Only function is to be a wrapper of its children for styling
export default function MatterOverlay({className, elementHTML, children}){

    const name = className ? `${className} ` : '';
    const newElement = cloneElement(elementHTML,{className:`${elementHTML.props.className} ${name}${style.overlay}`},children)

    return (
        newElement
    )
}