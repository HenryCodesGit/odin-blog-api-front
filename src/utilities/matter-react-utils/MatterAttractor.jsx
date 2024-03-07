import PropTypes from 'prop-types';
import { Children, useEffect, useState, useContext, cloneElement} from 'react';

import { Constraint, Composite } from 'matter-js'

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
    constraintOptions: PropTypes.object
}

MatterAttractor.defaultProps = {
    isMain: true,
    constraintOptions: {},
}

// TODO: Extract hardcoded sections and settings out into options object later on
export default function MatterAttractor({ attractorID, isMain, constraintOptions, children}){

    const { engine } = useContext(MatterContext)

    const [element, setElement] = useState(null)
    const [body, setBody] = useState(null);

    useEffect(()=>{
        const element = Children.only(children);
        const newElement = cloneElement(element,{ bodyDataHandler: (data) => setBody(data)})
        setElement(newElement)

    },[children, attractorID, isMain])

    useEffect(()=>{
        //when body is passed call this useEffect
        if(!body) return console.warn('Body has not yet been passsed into MatterAttractor, or is null. Cancelling useEffect function call');
        if(!engine) return  console.warn('Engine has not yet been passsed into MatterAttractor, or is null. Cancelling useEffect function call');
        if(!element) return console.warn('Element has not yet been instantiated, cancelling useEffect function call');
            
        //Setting the custom attractor settings for the body
        body.attractor = { isMain, id: attractorID };

        //Update all existing attractors to constrain them together
        const constraints = [];
        engine.world.bodies.forEach((engineBody)=>{
            //Search conditions
            if(
                !(Object.hasOwn(engineBody,'attractor') && 
                engineBody.attractor.isMain && 
                engineBody.attractor.id === attractorID && 
                engineBody.id !== body.id)
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
                        const r = ((posX[0] - posX[1])^2 + (posY[0] - posY[1])^2)*0.5;
            
                        const MIN = 0;
                        const MAX = 0.0005;
                        const springConstant = Math.max(
                            MIN,
                            Math.min(
                                Math.abs(this._G / (r^3)),
                                MAX
                            )
                        );
                        
                        return springConstant;
                    }, 
                    set stiffness(name){ this._G = (this._G) ? name : 0.005; },
                    length: 0,
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

        return ()=>{
            //Cleanup
            constraints.forEach((constraint)=>{
                Composite.remove(engine.world, constraint);
            })
        }

    },[engine, body, element, isMain, attractorID, constraintOptions])

    return(<>
        {element}
    </>)

}