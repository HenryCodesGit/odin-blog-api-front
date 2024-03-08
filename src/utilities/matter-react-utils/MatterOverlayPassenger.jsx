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
//TODO: Scale the HTML Element based on the body.bounds property of the body?
export default function MatterOverlayPassenger({elementHTML, children}){

        const { engine } = useContext(MatterContext);

        const [bodyElement, setBodyElement] = useState(null)
        const [body, setBody] = useState(null)

        const [elementHTMLState, setElementHTMLState] = useState(null)
        const elementHTMLRef = useRef(null);

        const syncHTML = useCallback(()=>{
            if(!elementHTMLRef.current) return console.warn('HTML element not yet initialized or was not provided. Cancelling syncMatterBody')

            //Resizing the HTML item to the engine item
            //Get the width and height from the body element
            //Make it slightly smaller just in case
            elementHTMLRef.current.style.width  = body.bounds.max.x - body.bounds.min.x;
            elementHTMLRef.current.style.height = body.bounds.max.y - body.bounds.min.y;

            //Setting HTML item relative to engine
            // Center the image on the body
            const bodyPosition = body.position;
            const imageBounds = elementHTMLRef.current.getBoundingClientRect();
            const imageX = bodyPosition.x - (imageBounds.width >> 1); //Bitshift division 
            const imageY = bodyPosition.y - (imageBounds.height >> 1);

            // Update body position
            elementHTMLRef.current.style.transform = `translate(${imageX}px, ${imageY}px)`;
        },[body]);

        // On mount, clone the HTML element and add OverlayPassenger specific properties
        useEffect(()=>{
            if(!body) return console.warn('Physics body not yet initialized or was not provided. Cancelling HTML Element update')
            //Get the width and height from the body element
            const width = body.bounds.max.x - body.bounds.min.x;
            const height = body.bounds.max.y - body.bounds.min.y;

            const newElement = cloneElement(elementHTML,{
                    ref: elementHTMLRef, 
                    className: `${elementHTML.props.className ? elementHTML.props.className+' ' : ''}${style.passenger}`,
                    style: { width, height}
                }
            );
            setElementHTMLState(newElement);
        },[elementHTML, body])

        //Intercept the MatterBody and place a callback function on the returned body
        useEffect(()=>{
            const currChild = Children.only(children);
            const newBodyDataHandler = (data)=>{
                currChild.props.bodyDataHandler(data);
                setBody(data);
            }
            const newBodyElement = cloneElement(Children.only(children),{ bodyDataHandler: newBodyDataHandler}) 
            setBodyElement(newBodyElement)
        },[children])
        
        // Set the update loop
        useEffect(()=>{
            if(!body) return console.warn('Physics body not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!engine) return console.warn('Engine not yet initialized or was not provided. Cancelling syncMatterBody')
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
        },[body, engine, elementHTMLState, syncHTML])

    return (<>
        {elementHTMLState}
        {bodyElement}
    </>);
}