import PropTypes from 'prop-types';
import { Children, useEffect, useState, useContext, cloneElement} from 'react';

import { Body, Constraint, Composite } from 'matter-js'

import MatterContext from './MatterContext';

MatterAttractor.propTypes = {
    attractorID: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        ]).isRequired,
    isMain: PropTypes.bool,
    children: function(props, propName, componentName) {
        if(Children.count(props[propName]) < 1) return new Error(`${componentName} must have a child element`)

        try {  Children.only(props[propName]) } 
        catch { return new Error(`${componentName} can only take in one child element!`);}
      },
    bodyDataHandler: PropTypes.func,
    bodyParams: PropTypes.object,
    constraintOptions: PropTypes.object
    
}

MatterAttractor.defaultProps = {
    isMain: true,
    constraintOptions: {},
    bodyDataHandler: ()=>{},
}

// TODO: Extract hardcoded sections and settings out into options object later on
// TODO: Add 'maxDistance' option so constraints are only added up to a certain limit -> relative distance, absolute distance
// TODO: Also add 'maxCOnstraints' to limit number of objects that can be pulled at a time


/* 
    bodyType, bodyParams, bodyDataHandler
*/
export default function MatterAttractor({ attractorID, isMain, constraintOptions, children, bodyDataHandler, bodyParams}){
    const { engine } = useContext(MatterContext)

    const [element, setElement] = useState(null)
    const [body, setBody] = useState(null);

    // Set the body once it is passed in properly
    useEffect(()=>{
        //when body is passed call this useEffect
        if(!body) return console.warn('Body has not yet been passsed into MatterAttractor, or is null. Cancelling useEffect function call');
            
        //Setting the custom attractor settings for the body
        Body.set(body, 'attractor', { isMain, id: attractorID })
    },[body, isMain, attractorID])
    

    useEffect(()=>{
        const currElement = Children.only(children);

        //Intercept body parameters and add on top the ones passed in, if specified
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

    // Create the constraints for the bodies
    useEffect(()=>{
        if(!body) return;

        const constraints = [];
        //Based on this new body that was added, constrain it to all the relevant bodies (ones with the same attractorID and type of attraction)
        engine.world.bodies.forEach((engineBody)=>{
            if( //Return if any of the following below are true
                !Object.hasOwn(engineBody,'attractor') ||  //Not an attractor
                !(engineBody.attractor.isMain || body.attractor.isMain) || //Both are not main attractors
                engineBody.attractor.id !== attractorID ||  //The two bodies have different attractor types
                engineBody.id === body.id //The two bodies are the same body.
            ) return;
        
            // Overwrites any default body options in case it was set in error
            let options = Object.assign({...constraintOptions}, { bodyA: engineBody, bodyB: body})

            // By default will use gravitational model unless it is over-written with a specific stiffness property in the options
            // Overwrite other properties in gravityConstraint with constraintOptions, though
            if(!Object.hasOwn(options, 'stiffness')) {
                const gravityConstraint = {
                    damping: 0,
                    get stiffness(){ 
                        /* Custom getter, force will depend on distance between the two particles, like gravity */
                        const posX = [this.bodyA.position.x, this.bodyB.position.x];
                        const posY = [this.bodyA.position.y, this.bodyB.position.y];
            
                        /* Ignoring mass because will be implementing constant mass between objects */
                        // Baking it in to the gravitational constant
                        let r = Math.sqrt((posX[0] - posX[1]) ** 2 + (posY[0] - posY[1]) ** 2);
                        
                        //Don't allow 0 r because then infinite forse
                        r = Math.max(1, r);
                        const springConstant = this._G / (r ** 3)
                        
                        
                        return springConstant;
                    }, 
                    set stiffness(name){ this._G = (this._G) ? name : 2000; },
                    get length(){ 
                        if(this._length) return this._length;   //If length is provided
                        if(!this.bodyA || !this.bodyB) return 0; //Fallback length

                        //Default length is the average of the width and height of the largest body
                        const boundsA = this.bodyA.bounds;
                        const widthA = boundsA.max.x - boundsA.min.x;
                        const heightA = boundsA.max.y - boundsA.min.y;
                        const areaA = widthA * heightA;

                        const boundsB = this.bodyB.bounds;
                        const widthB = boundsB.max.x - boundsB.min.x;
                        const heightB = boundsB.max.y - boundsB.min.y;
                        const areaB = widthB * heightB;

                        if(areaA > areaB) return (widthA + heightA) >> 1
                        else return (widthB + heightB) >> 1;
                    },
                    set length(value){
                        this._length = value;
                    },
                    render: {
                        visible: true,
                    }
                };
                options = Object.assign(gravityConstraint, options)
            }
            const newConstraint = Constraint.create(options);
            constraints.push(newConstraint);

            Composite.add(
                engine.world, 
                newConstraint,
            );
        });

        // //Call the body handler function in case anything has a use for it
        // bodyDataHandler(body);

        return ()=>{
            Composite.remove(engine.world, constraints);
        }
    },[attractorID,body,constraintOptions, engine])

    return(<>
        {element}
    </>)

}