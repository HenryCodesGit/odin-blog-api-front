import { PropTypes } from 'prop-types'
import { useEffect, useContext, useState, forwardRef} from 'react'

import { Composite, Body, Bodies, Sleeping, Events} from 'matter-js'
import MatterContext from './MatterContext'
import { normalizedPosition, normalizedWidth, normalizedHeight, normalizedVertices } from './MatterCanvasUtils'
import useResizeEffect from '../react-utils/useResizeEffect'
import { width } from '@mui/system'

//Wrapping the functions into a single 'CreateBody' with new syntax
const CreateBody = {
    'circle': ({x,y,radius,options,maxSides}) => Bodies.circle(x,y,radius,options,maxSides),
    'fromVertices': ({x,y,vertexSets,options,flagInternal,removeCollinear,minimumArea,removeDuplicatePoints}) => {
       return Bodies.fromVertices(x,y,vertexSets,options,flagInternal,removeCollinear,minimumArea,removeDuplicatePoints);   
    },
    'polygon': ({x, y, sides, radius, options}) => Bodies.polygon(x, y, sides, radius, options),
    'rectangle': ({x,y,width,height,options}) => Bodies.rectangle(x,y,width,height,options),
    'trapezoid': ({x, y, width, height, slope, options}) => Bodies.trapezoi(x, y, width, height, slope, options),
    'custom': body=>body // Custom type means the body has been created elsewhere and is just being passed in. Therefore just return it
}

MatterBody.propTypes = {
    bodyType: PropTypes.oneOf(['circle','fromVertices','polygon','rectangle','trapezoid','custom']).isRequired,
    bodyParams: PropTypes.object,  // TODO: Custom validator to ensure proper shape of parameter object coming in
    bodyDataHandler: PropTypes.func
}

MatterBody.defaultProps = {
    bodyDataHandler: ()=>{},
}
/*
*   This function also accepts custom bodyParameters as well:
*   Definition of the MatterBody object has no reference to the scene its in, so it may be useful to provide

*   normalized: {
*       position: {x,y}         Number [0-1] location to place in terms of fraction of total canvas width/height respectively
*       width:                  Number [0-1] width of object in terms of fraction of total canvas width
*       height:                 Number [0-1] width of object in terms of fraction of total canvas height
        radius:                 Number [0-1] width of object in terms of fraction of total canvas width
*       vertexSets[{x,y} ...]   Each object in the array follows x, y rules as described above
*   }
    syncToHTML: {
        position:               Boolean to state whether or not the object should scale to fit the canvas size on resize
        size:                   Boolean to state whether or not the object should scale to fit the canvas size on resize
        reference:              The reference element for scaling. By default it is the canvas, but can be anything
    }
    keepRelativeWorldDims:{          
        position,               Boolean to state whether or not the obejct should retain its relative position in space if the window moves
                                This option is mutually exclusive with syncToHTML.position, with syncToHTML taking priority
        size                    Boolean to state whether or not the obejct should retain its relative size in space if the window moves
                                This option is mutually exlusive with syncToHTML.size, with syncToHTML taking priority
    }
*/

export default function MatterBody({bodyType, bodyParams, bodyDataHandler}){
    const { engine, render } = useContext(MatterContext)
    const [body, setBody] = useState(null);
    const [lastCanvasSize, setLastCanvasSize] = useState(null);

    // useResizeEffect(
    //     ()=> {
    //         if(!Object.hasOwn(bodyParams, 'keepRelativeWorldDims')) return;
    //         if(!render) return;
    //         if(!body) return;
    //         if(!lastCanvasSize) return;

    //         //Getting the canvas element
    //         const element = render.element;
    //         const {width, height} = lastCanvasSize;

    //         // Get the scale of the new scene compared to old one
    //         const scale = { x: element.clientWidth / width,  y: element.clientHeight / height}

    //         // Scale the width/height if at least one is listed as needing scaling
    //         if(Object.hasOwn(bodyParams.keepRelativeWorldDims, 'size') && bodyParams.keepRelativeWorldDims.size){
    //             body.scaleLocal(scale.x,scale.y);
    //             console.log('Resize scale')
    //         }

    //         // Move the body to scaled position if it is listed
    //         if(Object.hasOwn(bodyParams.keepRelativeWorldDims, 'position') && bodyParams.keepRelativeWorldDims.position){
    //             console.log('Position scale')
    //             const position = {...body.position}; //Gives a vector {x, y}
    //             position.x = position.x * scale.x;
    //             position.y = position.y * scale.y;
    //             Body.setPosition(body, position);
    //         }
    //     },
    //     ()=>{}, // No cleanup needed
    //     [render, bodyType, bodyParams, body, lastCanvasSize],
    //     {debounce: 30, runInitial: false} // Throttle the function call
    // );

    // useResizeEffect(
    //     ()=> {
    //         if(!Object.hasOwn(bodyParams, 'keepRelativeWorldDims')) return;
    //         setLastCanvasSize({ width: render.element.clientWidth, height: render.element.clientHeight});
    //     },
    //     ()=>{}, // No cleanup needed
    //     [render, bodyType, bodyParams, body],
    //     {debounce: 100, runInitial: false} // Throttle the function call
    // );

    useEffect(()=>{
        if(!render) return console.warn('Render argument for MatterBody not provided or is null. Cancelling MatterBody creation')

        //Parse any custom parameters if they exist
        if(Object.hasOwn(bodyParams, 'normalized')){
            if(Object.hasOwn(bodyParams.normalized, 'width')) bodyParams.width = normalizedWidth(render.element, bodyParams.normalized.width);
            if(Object.hasOwn(bodyParams.normalized, 'height')) bodyParams.height = normalizedHeight(render.element, bodyParams.normalized.height);
            if(Object.hasOwn(bodyParams.normalized, 'radius')) bodyParams.radius = normalizedWidth(render.element, bodyParams.normalized.radius); //TODO: Option to scale radius based on either width or height
            if(Object.hasOwn(bodyParams.normalized, 'vertexSets')) bodyParams.vertexSets = normalizedVertices(render.element, bodyParams.normalized.vertexSets);
            if(Object.hasOwn(bodyParams.normalized, 'position')){
                [bodyParams.x, bodyParams.y] = normalizedPosition(render.element,bodyParams.normalized.position.x, bodyParams.normalized.position.y)
            }
        }

        //Create the body
        const newBody = CreateBody[bodyType](bodyParams);

        //Adding functions to get width and height information
        newBody.getBounds = ()=>{
            const lastRotation = newBody.angle;
            Body.setAngle(newBody, 0);
            const width = newBody.bounds.max.x - newBody.bounds.min.x;
            const height = newBody.bounds.max.y- newBody.bounds.min.y;
            Body.setAngle(newBody, lastRotation);
            return {width, height}
        }

        newBody.scaleLocal = (scaleX, scaleY)=>{
            const lastRotation = newBody.angle;
            Body.setAngle(newBody, 0);
            Body.scale(newBody,scaleX, scaleY);
            Body.setAngle(newBody, lastRotation);
        }

        //Add the body to the world
        Composite.add(engine.world, newBody);

        //Parameters that have to be set after instantiation:
        if(Object.hasOwn(bodyParams,'mass')) Body.setMass(newBody, bodyParams.mass);
        if(Object.hasOwn(bodyParams,'isSleeping')) Sleeping.set(newBody, bodyParams.isSleeping);

        //Set the states for others that reference it
        setBody(newBody);
        setLastCanvasSize({ width: render.element.clientWidth, height: render.element.clientHeight});

        //Pass the body upwards and call the bodyDataHandler function if its passed as a prop
        if(bodyDataHandler) bodyDataHandler(newBody);

        return ()=>{
            //Search the world for the body and delete it if the barrier still exists
            Composite.remove(engine.world, newBody, true)

            //NOTE: There is a currently a bug where body deletion sometimes doesn't trigger constraint deletion.
            //Can be replicated by re-saving MatterCanvas, with at least one MatterOverlayPassenger and MatterOVerlayDriver instantiated that have
            //Constraints between them,
            //For now, fixing it by deleting all constraints assocaited with a body wh en it is deleted, but is likely some other lifecycle problem.
            if(!newBody) return;

            const constraintsToRemove =  engine.world.constraints.filter((constraint)=>{
                return (constraint.bodyA.id === newBody.id || constraint.bodyB.id === newBody.id)
            });
            Composite.remove(engine.world,constraintsToRemove);
        }
    },[engine, render, bodyParams, bodyType, bodyDataHandler]);

    useEffect(()=>{
        if(!Object.hasOwn(bodyParams, 'syncToHTML')) return;
        if(!render) return console.warn('Render not yet set up. Cancelling')

        function syncToHTML(){
            if(!body) return;
           //Assuming it is a useRef that is passed in or an HTML element. TODO: Put it in the proptypes too
           let ref = bodyParams.syncToHTML.reference;
           if(!ref){
                ref = render.element.querySelector('canvas');
                if(!ref) return console.warn('Body trying to sync with non-existent HTML element, cancelling');
           }

           let element = (ref instanceof Node) ? ref : ref.current;
           if(element === null) return console.warn('Body trying to sync with non-existent HTML element, cancelling');

           //Getting the size of the body
           const {width, height} = body.getBounds();



           // Get the scale of the new scene compared to old one
           // Need to do it relative to its rotation angle
           const scale = {
               x: element.clientWidth / width,
               y: element.clientHeight / height,
           }

           // Scale the width/height if at least one is listed as needing scaling. Truthy = true
           if(Object.hasOwn(bodyParams.syncToHTML, 'size') && bodyParams.syncToHTML.size && scale.x !== 1 && scale.y !== 1){
               body.scaleLocal(scale.x, scale.y)
           }

           // Move the body to position of HTML
           if(Object.hasOwn(bodyParams.syncToHTML, 'position') && bodyParams.syncToHTML.position){
                //Position the body relative to the HTML element
                const sizeElement = element.getBoundingClientRect(); //Get size of the HTML element
                const x = sizeElement.x + (sizeElement.width >> 1);
                const y = sizeElement.y + (sizeElement.height >> 1);
                Body.setPosition(body, {x, y});
           }
        }

        Events.on(engine, 'afterUpdate', syncToHTML)

        return ()=>{
            Events.off(engine,'afterUpdate',syncToHTML);
        }
        //Set up sync scale every engine update
    },[engine, render, body, bodyParams])

    useEffect(()=>{
        function maintainWorldDims() {
            if(!Object.hasOwn(bodyParams, 'keepRelativeWorldDims')) return;
            if(!render) return;
            if(!body) return;
            if(!lastCanvasSize) return;

            //Getting the canvas element
            const element = render.element;
            const {width, height} = lastCanvasSize;

            //Don't bother with the rest if the size hasn't changed
            if(element.width === width && element.height === height) return;

            // Get the scale of the new scene compared to old one
            const scale = { x: element.clientWidth / width,  y: element.clientHeight / height}

            // Scale the width/height if at least one is listed as needing scaling
            if(Object.hasOwn(bodyParams.keepRelativeWorldDims, 'size') && bodyParams.keepRelativeWorldDims.size){
                body.scaleLocal(scale.x,scale.y);
            }

            // Move the body to scaled position if it is listed
            if(Object.hasOwn(bodyParams.keepRelativeWorldDims, 'position') && bodyParams.keepRelativeWorldDims.position){
                const position = {...body.position}; //Gives a vector {x, y}
                position.x = position.x * scale.x;
                position.y = position.y * scale.y;
                Body.setPosition(body, position);
            }
            setLastCanvasSize({ width: element.clientWidth, height: element.clientHeight});
        }
        Events.on(engine, 'afterUpdate', maintainWorldDims)

        return ()=>{
            Events.off(engine, 'afterUpdate', maintainWorldDims)
        }
        //Set up sync scale every engine update
    },[engine, render, body, bodyParams, lastCanvasSize])

    return null;
}