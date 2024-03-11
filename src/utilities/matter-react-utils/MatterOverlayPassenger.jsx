//TODO a 'Driver' React component that takes a single child. This component will set any physics component in the linked Overlay equal to the position of this component
import { Children, useState, useContext, useEffect, cloneElement, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';

import { Body, Events } from 'matter-js';

import style from './MatterOverlay.module.css'

import MatterContext from "./MatterContext";

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

            //Get the last size of the body and the border thickness
            const {width, height} = body.getBounds();
            const borderThickness = getComputedStyle(elementHTMLRef.current).getPropertyValue("border-width");

            // Set the image size if it changed
            if(!(elementHTMLRef.current.style.width === width && elementHTMLRef.current.style.height === height)){
                elementHTMLRef.current.style.width = `calc(${width}px + 2 * ${borderThickness})`;
                elementHTMLRef.current.style.height = `calc(${height}px + 2 * ${borderThickness})`;
            }

            // Update body position and rotation
            elementHTMLRef.current.style.transformOrigin = 'top left';
            elementHTMLRef.current.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad) translate(-50%, -50%)`;
        },[body]);

        // On mount, clone the HTML element and add OverlayPassenger specific properties
        useEffect(()=>{
            if(!body) return console.warn('Physics body not yet initialized or was not provided. Cancelling HTML Element update')

            // const newElement = (
            //     <div ref={elementHTMLRef} className={style.passenger}>
            //         {elementHTML}
            //     </div>
            // )
            const newElement = cloneElement(
                elementHTML,
                {
                    ref: elementHTMLRef, 
                    className: `${elementHTML.props.className ? elementHTML.props.className+' ' : ''}${style.passenger}`,
                }
            );
            setElementHTMLState(newElement);
        },[elementHTML, body])

        // Intercept the MatterBody and place a callback function on the returned body
        useEffect(()=>{
            const currChild = Children.only(children);
            const newBodyDataHandler = (data)=>{
                currChild.props.bodyDataHandler(data);
                setBody(data);
            }
            const newBodyElement = cloneElement(Children.only(children),{ bodyDataHandler: newBodyDataHandler}) 
            setBodyElement(newBodyElement)
        },[children])
        
        // Initialize the coupling
        useEffect(()=>{
            if(!body) return console.warn('Physics body not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!engine) return console.warn('Engine not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!elementHTMLRef.current) return console.warn('HTML element not yet initialized or was not provided. Cancelling syncMatterBody')

            // Set the initial size of the element
            
            const {width, height} = body.getBounds();

            elementHTMLRef.current.style.width = `${width}px`;
            elementHTMLRef.current.style.height = `${height}px`;

            // Transform the image and match position before every update
            Events.on(engine,'beforeUpdate', syncHTML)

            // Cleanup
            return ()=>{
                Events.off(engine,'beforeUpdate', syncHTML)
            }
        },[body, engine, elementHTMLState, syncHTML])

    return (<>
        {elementHTMLState}
        {bodyElement}
    </>);
}