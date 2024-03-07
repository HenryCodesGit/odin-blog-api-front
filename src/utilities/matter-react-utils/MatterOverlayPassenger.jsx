//TODO a 'Driver' React component that takes a single child. This component will set any physics component in the linked Overlay equal to the position of this component
import { Children, useState, useContext, useEffect, cloneElement, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';

import { Body, Events } from 'matter-js';

import style from './MatterOverlay.module.css'

import MatterContext from "./MatterContext";
import useResizeEffect from '../react-utils/useResizeEffect';

MatterOverlayPassenger.propTypes = {
    elementHTML: PropTypes.element, //Matterbody is the physics component to be associated with the HTML element
    children: function(props, propName, componentName) {
        if(Children.count(props[propName]) < 1) return new Error(`${componentName} must have a child element`)

        try {  Children.only(props[propName]) } 
        catch { return new Error(`${componentName} can only take in one child element!`);}
      },
}

MatterOverlayPassenger.defaultProps = {
}


//TODO: Have a setting to scale image with respect to engine element

export default function MatterOverlayPassenger({elementHTML, children}){

        const { engine, render } = useContext(MatterContext);

        
        const [bodyElement, setBodyElement] = useState(null)
        const [body, setBody] = useState(null)

        const [elementHTMLState, setElementHTMLState] = useState(null)
        const elementHTMLRef = useRef(null);

        const syncHTML = useCallback(()=>{
            if(!elementHTMLRef.current) return console.warn('HTML element not yet initialized or was not provided. Cancelling syncMatterBody')

            //Setting HTML item relative to engine
            // Center the image on the body
            const bodyPosition = body.position;
            const imageBounds = elementHTMLRef.current.getBoundingClientRect();
            const imageX = parseInt(bodyPosition.x - imageBounds.width/2,10); 
            const imageY = parseInt(bodyPosition.y - imageBounds.height/2,10);

            //Calculate how fast transition must be to reach next spot in a single tick
            const tickTiming = 1000/60;
            elementHTMLRef.current.style.transition= `transform calc(${tickTiming}ms) steps(1, jump-start)`; 
            elementHTMLRef.current.style.transform = `translate(${imageX}px, ${imageY}px)`;
        },[body]);

        useEffect(()=>{
            //On mount, clone the HTML element and add a reference to it. Also change the styling to include the passenger style
            const newElement = cloneElement(
                elementHTML,
                {
                    ref: elementHTMLRef, 
                    className: `${elementHTML.props.className ? elementHTML.props.className+' ' : ''}${style.passenger}`
                }
            );
            setElementHTMLState(newElement);

            //Intercept the MatterBody and place a callback function on the returned body
            //TODO: Need to make sure we don't overwrite the old bodyDatahandler if there is one. Instead combine the functions together.
            const newBodyElement = cloneElement(Children.only(children),{ bodyDataHandler: (data) => setBody(data)}) 
            setBodyElement(newBodyElement)

            if(!body) return console.warn('Physics body not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!engine) return console.warn('Engine not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!render) return console.warn('Renderer not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!elementHTMLRef.current) return console.warn('HTML element not yet initialized or was not provided. Cancelling syncMatterBody')

            
            //First position of the element will be set as 0px, 0px (at the origin) so the translate property works 
            elementHTMLRef.current.style.top = '0px' //`${imageY}px`;
            elementHTMLRef.current.left = '0px' //`${imageX}px`;

            // Center the image on the body
            const bodyPosition = body.position;
            const imageBounds = elementHTMLRef.current.getBoundingClientRect();
            const imageX = parseInt(bodyPosition.x - imageBounds.width/2,10); 
            const imageY = parseInt(bodyPosition.y - imageBounds.height/2,10);
            elementHTMLRef.current.style.transition= `transform 0ms steps(1, jump-start)`; 
            elementHTMLRef.current.style.transform = `translate(${imageX}px, ${imageY}px)`;

            // Move the image after every update
            Events.on(engine,'afterUpdate', syncHTML)

            // Cleanup
            return ()=>{
                Events.off(engine,'afterUpdate', syncHTML)
            }

        },[engine, render, body, elementHTML, children, syncHTML])

    return (<>
        {elementHTMLState}
        {bodyElement}
    </>);
}