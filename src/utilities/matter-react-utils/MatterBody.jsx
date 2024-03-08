import { PropTypes } from 'prop-types'
import { useEffect, useContext, useState, forwardRef} from 'react'

import { Composite, Body, Bodies } from 'matter-js'
import MatterContext from './MatterContext'
import { normalizedPosition, normalizedWidth, normalizedHeight, normalizedVertices } from './MatterCanvasUtils'
import useResizeEffect from '../react-utils/useResizeEffect'

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
    scaleOnResize: {
        position:               Boolean to state whether or not the object should scale to fit the canvas size on resize
        width:                  Boolean to state whether or not the object should scale to fit the canvas size on resize
        height:                 Boolean to state whether or not the object should scale to fit the canvas size on resize
        reference:              The reference element for scaling. By default it is the canvas, but can be anything
    }             
*/

export default function MatterBody({bodyType, bodyParams, bodyDataHandler}){
    const { engine, render } = useContext(MatterContext)
    const [body, setBody] = useState(null);
    const [lastReferenceSize, setLastReferenceSize] = useState (null);
    const [referenceHTML, setReferenceHTML] = useState(null);

    useResizeEffect(()=> {
            if(!Object.hasOwn(bodyParams, 'scaleOnResize')) return;

            // Too lazy to type check everywhere, so just change all possible options to true
            if(bodyParams.scaleOnResize === true || typeof bodyParams.scaleOnResize === 'string' && bodyParams.scaleOnResize.toLowerCase() === 'true') {
                bodyParams.scaleOnResize = {
                    position:true,
                    width: true,
                    height: true,
                }
            }

            // Get the scale of the new scene compared to old one
            const scale = {
                x: referenceHTML.clientWidth / lastReferenceSize.width, 
                y: referenceHTML.clientHeight / lastReferenceSize.height
            }

            // Scale the width/height if at least one is listed as needing scaling
            if(Object.hasOwn(bodyParams.scaleOnResize, 'width') || Object.hasOwn(bodyParams.scaleOnResize, 'height')){
                Body.scale(body, scale.x, scale.y);
            }

            // Move the body to scaled position
            if(
                Object.hasOwn(bodyParams.scaleOnResize, 'position') && 
                (
                    bodyParams.scaleOnResize.position === true || 
                    typeof bodyParams.scaleOnResize.position == 'string' && bodyParams.scaleOnResize.position.toLowerCase() === 'true'
                )
            ){
                const position = {...body.position}; //Gives a vector {x, y}
                position.x = position.x * scale.x;
                position.y = position.y * scale.y;
                Body.setPosition(body, position);
            }
        },
        ()=>{}, // No cleanup needed
        [bodyType, bodyParams, engine, render, body, lastReferenceSize],
        {debounce: 100, runInitial: false} // Throttle the function call
    );

    useResizeEffect(() => {
        setLastReferenceSize({ width: referenceHTML.clientWidth, height: referenceHTML.clientHeight});
        }
    ,()=>{},[referenceHTML],{debounce: 100, runInitial: false})

    useEffect(()=>{
        if(!render) return console.warn('Render argument for MatterBody not provided or is null. Cancelling MatterBody creation')

        //Parse any custom parameters if they exist
        if(Object.hasOwn(bodyParams, 'normalized')){
            if(Object.hasOwn(bodyParams.normalized, 'width')) bodyParams.width = normalizedWidth(render.element, bodyParams.normalized.width);
            if(Object.hasOwn(bodyParams.normalized, 'height')) bodyParams.height = normalizedHeight(render.element, bodyParams.normalized.height);
            if(Object.hasOwn(bodyParams.normalized, 'radius')) bodyParams.radius = normalizedWidth(render.element, bodyParams.normalized.radius); //TODO: Option to scale radius based on either width or height
            if(Object.hasOwn(bodyParams.normalized, 'vertexSets')) bodyParams.vertexSets = normalizedVertices(render.element, bodyParams.normalized.vertexSets);
            if(Object.hasOwn(bodyParams.normalized, 'pos')){
                [bodyParams.x, bodyParams.y] = normalizedPosition(render.element,bodyParams.normalized.pos.x, bodyParams.normalized.pos.y)
            }
        }

        //Create the body
        const newBody = CreateBody[bodyType](bodyParams);

        //Add the body to the world
        Composite.add(engine.world, newBody);

        //Set the states for others that reference it
        setBody(newBody);

        const refHTML = (Object.hasOwn(bodyParams, 'scaleOnResize') && Object.hasOwn(bodyParams.scaleOnResize, 'reference')) ?
        bodyParams.scaleOnResize.reference : render.element;
        setLastReferenceSize({ width: refHTML.clientWidth, height: refHTML.clientHeight});
        setReferenceHTML(refHTML);

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

    return null;
}