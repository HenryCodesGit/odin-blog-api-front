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
//TODO: Have a setting to set the type of polygon to create, and a setting to scale the polygon to the html element.
//CURRENTLY ONLY WORKS FOR RECTANGLES. (See line ~100);
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
            if(!elementHTMLState) return console.warn('HTML element not yet initialized or was not provided. Cancelling syncMatterBody')

            const canvas = render.element.querySelector('canvas');

            //Position the body relative to the HTML element
            const sizeOverlay = canvas.getBoundingClientRect();  //Should be the same as canvas size
            const sizeElement = elementHTMLRef.current.getBoundingClientRect(); //Get size of the HTML element

            const elementX = sizeElement.x - sizeOverlay.x + sizeElement.width / 2;
            const elementY = sizeElement.y - sizeOverlay.y + sizeElement.height / 2;

            //Position the body relative to the world
            Body.setPosition(body, {x: elementX, y: elementY})
        }

        //On mount, clone the HTML element and add a reference to it
        useEffect(()=>{
            
            const newElement = cloneElement(
                elementHTML,
                {
                    ref: elementHTMLRef, 
                    className: `${elementHTML.props.className ? elementHTML.props.className+' ' : ''}${style.driver}`
                }
            );
            setElementHTMLState(newElement);
        },[elementHTML, children])


        //On mount, clone the body element and add reference to it. NOTE: This must occur after the HTML element is initialized,
        //Due to it requiring elementHTMLRef to be instantiated first
        useEffect(()=>{
            if(!elementHTMLState) return;
            
            const currentBodyElement = Children.only(children);

            //Over-write settings for child components if using overlay driver

            //Position the body relative to the HTML element
            // TODO: Maybe refactor because I reused it twice now.
            const sizeOverlay = render.element.querySelector('canvas').getBoundingClientRect();  //Should be the same as canvas size
            const sizeElement = elementHTMLRef.current.getBoundingClientRect(); //Get size of the HTML element

            const elementX = sizeElement.x - sizeOverlay.x + sizeElement.width / 2;
            const elementY = sizeElement.y - sizeOverlay.y + sizeElement.height / 2;

            const addDataHandler = { bodyDataHandler: (data) => setBody(data) }
            const addResizability = Object.assign(
                {...currentBodyElement.props.bodyParams}, 
                 { scaleOnResize: { //Force scaling to match the HTML element. Do not scale position because position of element may change
                        position: false,
                        width: true, 
                        height: true, 
                        reference: elementHTMLRef.current
                    },
                    width: sizeElement.width,
                    height: sizeElement.height,
                    x:  elementX,
                    y:  elementY
                 }
            );
            const newBodyElement = cloneElement(currentBodyElement,Object.assign({}, addDataHandler, { bodyParams: addResizability }))
            setBodyElement(newBodyElement);
        },[render, children, elementHTMLState]);

        //On resize, 
        useResizeEffect(
            syncMatterBody, // Callback
            ()=>{}, // No cleanup needed
            [elementHTMLState, body, render], // No dependencies 
            {debounce: 100, runInitial: true} // Throttle the function call
        )

    return (<>
        {elementHTMLState}
        {bodyElement}
    </>);
}