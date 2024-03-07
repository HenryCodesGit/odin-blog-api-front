//TODO a 'Driver' React component that takes a single child. This component will set any physics component in the linked Overlay equal to the position of this component
import { Children, useState, useContext, useEffect, cloneElement, useRef } from 'react';
import PropTypes from 'prop-types';

import { Body } from 'matter-js';

import style from './MatterOverlay.module.css'

import MatterContext from "./MatterContext";
import useResizeEffect from '../react-utils/useResizeEffect';

MatterOverlayDriver.propTypes = {
    elementHTML: PropTypes.element, //Matterbody is the physics component to be associated with the HTML element
    children: function(props, propName, componentName) {
        if(Children.count(props[propName]) < 1) return new Error(`${componentName} must have a child element`)

        try {  Children.only(props[propName]) } 
        catch { return new Error(`${componentName} can only take in one child element!`);}
      },
}

MatterOverlayDriver.defaultProps = {
}


//TODO: Replace isStatic and scaleonResize properties of bodies to isStatic:true and scaleOnResize: false.
// Have them as isStatic:false and scaleonResize: true breaks functionality of this component.
//TODO: Have a setting to set the type of polygon to create, and a setting to scale the polygon to the html element
//TODO: Scale the polygon based on the getBoundingClientRect() from html
export default function MatterOverlayDriver({elementHTML, children}){

        const { render } = useContext(MatterContext);

        const [bodyElement, setBodyElement] = useState(null)
        const [body, setBody] = useState(null)

        const [elementHTMLState, setElementHTMLState] = useState(null)
        const elementHTMLRef = useRef(null);

        function syncMatterBody(){
            if(!body) return console.warn('Physics body not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!render) return console.warn('Renderer not yet initialized or was not provided. Cancelling syncMatterBody')
            if(!elementHTMLRef.current) return console.warn('HTML element not yet initialized or was not provided. Cancelling syncMatterBody')

            const canvas = render.element.querySelector('canvas');
            

            //Position the body relative to the HTML element
            const sizeOverlay = canvas.getBoundingClientRect();  //Should be the same as canvas size
            const sizeElement = elementHTMLRef.current.getBoundingClientRect(); //Get size of the HTML element

            const elementX = sizeElement.x - sizeOverlay.x + sizeElement.width / 2;
            const elementY = sizeElement.y - sizeOverlay.y + sizeElement.height / 2;

            //Position the body relative to the world
            Body.setPosition(body, {x: elementX, y: elementY})
        }

        useEffect(()=>{
            //On mount, clone the HTML element and add a reference to it
            const newElement = cloneElement(
                elementHTML,
                {
                    ref: elementHTMLRef, 
                    className: `${elementHTML.props.className ? elementHTML.props.className+' ' : ''}${style.driver}`
                }
            );
            setElementHTMLState(newElement);

            //Intercept the MatterBody and place a callback function on the returned body
            //TODO: Need to make sure we don't overwrite the old bodyDatahandler if there is one. Instead combine the functions together.
            const newBodyElement = cloneElement(Children.only(children),{ bodyDataHandler: (data) => setBody(data)}) 
            setBodyElement(newBodyElement)
        },[elementHTML, children])

        //On resize, 
        useResizeEffect(
            syncMatterBody, // Callback
            ()=>{}, // No cleanup needed
            [elementHTML, body, render], // No dependencies 
            {debounce: 100, runInitial: true} // Throttle the function call
        )

    return (<>
        {elementHTMLState}
        {bodyElement}
    </>);
}