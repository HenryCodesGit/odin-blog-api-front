import PropTypes from 'prop-types'
import { useContext, useState, useEffect } from "react";
import { Events, Mouse, MouseConstraint, Composite} from 'matter-js';

import MatterContext from './MatterContext'
import enableTouchScroll from "../enableTouchScroll";
import useResizeEffect from '../react-utils/useResizeEffect';

MatterMouse.propTypes = {
    mouseDownHandler: PropTypes.func,
    mouseUpHandler: PropTypes.func,
    mouseMovehandler: PropTypes.func,
}

MatterMouse.defaultProps = {
    mouseDownHandler: ()=>{},
    mouseUpHandler: ()=>{},
    mouseMoveHandler: ()=>{},
}

// Makes it possible to translate mouse interaction into the engine
export default function MatterMouse({mouseDownHandler, mouseUpHandler, mouseMoveHandler, children}){

    const {engine, render} = useContext(MatterContext);
    const [mouse, setMouse] = useState(null);

        //On resize, 
        useResizeEffect(
            ()=> mouse.pixelRatio = window.devicePixelRatio,
            ()=>{},  // Cleanup
            [mouse], // Dependency
            {debounce: 100, runInitial: false} // Throttle the function call
        );
    
    useEffect(()=>{
        if(!engine || !render) return console.warn('The engine or renderer has not been initialized yet or is null. Cancelling initialization of MatterMouse');
        console.log('MatterMouse initialized');

        const canvas = render.element.querySelector('canvas');
    
        // Mouse and its constraint has to initiate after the other refs are created
        const _mouse = Mouse.create(canvas);
        _mouse.pixelRatio = window.devicePixelRatio; // This is needed because the matterJS Library has a bug with selection.
        
        const _mouseConstraint = MouseConstraint.create(engine, { mouse: _mouse });
    
        // Creating the mouse prevents scroll events from occuring, so need to manually put it back in
        const windowScroll = (event) => window.scrollBy(event.deltaX, event.deltaY);
        canvas.addEventListener('mousewheel', windowScroll); //Mouse scroll
        const touchScroll = enableTouchScroll(canvas); // Touch scrolling

        Events.on(_mouseConstraint,'mousedown',mouseDownHandler);
        Events.on(_mouseConstraint,'mouseup',mouseUpHandler);
        Events.on(_mouseConstraint,'mousemove',mouseMoveHandler);
        
        //Settings persistent states of mouse object
        setMouse(_mouse);
        return ()=>{
            Events.off(_mouseConstraint);
            canvas.removeEventListener('mousewheel', windowScroll);
            touchScroll.cleanup();
            Composite.remove(engine.world, _mouseConstraint)
        }   
    },[engine, render, mouseDownHandler, mouseUpHandler, mouseMoveHandler]);

    return children;
}