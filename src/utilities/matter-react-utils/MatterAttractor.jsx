import PropTypes from 'prop-types';
import { Children, useEffect, useState, useContext, cloneElement} from 'react';

import { Body, Composite, Events, Constraint} from 'matter-js'

import Constraints from '../matter-react-utils/Constraints'

import MatterContext from './MatterContext';

MatterAttractor.propTypes = {
    attractorID: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        ]).isRequired,
    isMain: PropTypes.bool,
    maxLength: PropTypes.number,
    children: function(props, propName, componentName) {
        if(Children.count(props[propName]) < 1) return new Error(`${componentName} must have a child element`)

        try {  Children.only(props[propName]) } 
        catch { return new Error(`${componentName} can only take in one child element!`);}
      },
    bodyDataHandler: PropTypes.func,
    bodyParams: PropTypes.object,
    constraintCallback: PropTypes.func,
    constraintOptions: PropTypes.object
    
}

MatterAttractor.defaultProps = {
    maxLength: null,
    isMain: true,
    constraintCallback: Constraints.gravity,
    bodyDataHandler: ()=>{},
}

// TODO: Add 'maxDistance' option so constraints are only added up to a certain limit -> relative distance, absolute distance
// TODO: Also add 'maxConstraints' to limit number of objects that can be pulled at a time
export default function MatterAttractor({ attractorID, isMain, maxLength, constraintCallback, constraintOptions, children, bodyDataHandler, bodyParams}){
    const { engine } = useContext(MatterContext)

    const [element, setElement] = useState(null)
    const [body, setBody] = useState(null);

    // Intercept the input element and clone it with custom props. Then, it will set the body state
    useEffect(()=>{
        const currElement = Children.only(children);

        // Intercept body parameters and add on top the ones passed in, if specified
        let newBodyParams = Object.assign({...currElement.props.bodyParams}, bodyParams)

        //Specifically add more details to the dataHandler
        const newBodyDataHandler = (data) => {
            currElement.props.bodyDataHandler(data); //Any existing dataHandlers on the element
            bodyDataHandler(data); //Run the bodyDataHandler that was passed in
            setBody(data) //Used by this MatterAttractor
        }

        const newElement = cloneElement(currElement,{bodyParams: newBodyParams, bodyDataHandler: newBodyDataHandler}) 
        setElement(newElement);
    },[children, attractorID, isMain, bodyParams, bodyDataHandler])

    // Once body state has been set, add attractor parameters
    useEffect(()=>{
        if(!body) return console.warn('Body has not yet been passsed into MatterAttractor, or is null. Cancelling useEffect function call');
        Body.set(body, 'attractor', { isMain, id: attractorID })
    },[body, isMain, attractorID])

    // Create the constraints for all bodies in the world that adhere to the same attractor ID
    useEffect(()=>{
        if(!body) return;

        const constraints = [];
        const callbacks = [];
        //Based on this new body that was added, constrain it to all the relevant bodies (ones with the same attractorID and type of attraction)
        engine.world.bodies.forEach(constrainWorldBody);
        function constrainWorldBody(worldBody){
                if( //Return if any of the following below are true
                    !Object.hasOwn(worldBody,'attractor') ||  //Not an attractor
                    !(worldBody.attractor.isMain || body.attractor.isMain) || //Both are not main attractors
                    worldBody.attractor.id !== attractorID ||  //The two bodies have different attractor types
                    worldBody.id === body.id //The two bodies are the same body.
                ) return;
            
                // set body options between the body and the body existing in the world that was found
                let options = Object.assign({...constraintOptions}, { bodyA: worldBody, bodyB: body})
                const constraint = constraintCallback.bind(this)(options);
                constraints.push(constraint);
                Composite.add(
                    engine.world, 
                    constraint,
                );

                //If max length property is applied..;
                if(maxLength == null) return;

                //Define callback to check its length every update and delete the constraint if long enough
                const callback = ()=>{
                    const {x: aX, y: aY} = Constraint.pointAWorld(constraint);
                    const {x: bX, y: bY} = Constraint.pointBWorld(constraint);
                    const len = Math.sqrt((aX-bX) **2 + (aY-bY) **2);
                    
                    if(len <= maxLength) return;
                    Composite.remove(engine.world,constraint);
                    Events.off(engine, 'afterUpdate', callback)
                }
                callbacks.push(callback);

                //Set listener to delete constraints
                Events.on(engine, 'afterUpdate', callback);
        }

        return ()=> {
            Composite.remove(engine.world, constraints)
            if(callbacks) callbacks.forEach((callback)=>{
                Events.off(engine,'afterUpdate', callback)
            })
        }
    },[attractorID,body,constraintOptions, constraintCallback, engine, maxLength])

    return(<>
        {element}
    </>)

}