import { cloneElement } from 'react';
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
    const oldClass = (elementHTML.props.className) ? (elementHTML.props.className + ' ') : ''
    return (
        cloneElement(elementHTML,{className:`${oldClass}${name}${style.overlay}`},children)
    )
}