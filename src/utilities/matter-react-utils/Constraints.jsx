import { Constraint } from 'matter-js'

function gravity(options){
    const bodyA = options.bodyA;
    const bodyB = options.bodyB;

    // Overwrite other properties in gravityConstraint with constraintOptions, though
    const gravityConstraint = {
        damping: 0.01,
        get stiffness(){ 

            /* Custom getter, force will depend on distance between the two particles, like gravity */
            const posX = [bodyA.position.x, bodyB.position.x];
            const posY = [bodyA.position.y, bodyB.position.y];

            //Radius betwen two points,
            let r = Math.sqrt((posX[0] - posX[1]) ** 2 + (posY[0] - posY[1]) ** 2);
            
            //Don't allow 0 r because then infinite force
            r = Math.max(5, r);

            //If Max length property exists
            let brokenMultiplier = 1;
            if(Object.hasOwn(options,'maxLength') && r > options.maxLength) brokenMultiplier = 0;

            //Minimum force to prevent attracted bodies from not moving if they're too far away
                /* Ignoring mass. Just adjust gravitational constant instead */
            const springConstant = brokenMultiplier * Math.max(this._G / (r ** 3), 0.0001)
            

            return springConstant;
        }, 
        set stiffness(name){ this._G = (this._G) ? name : 2000; },
        get length(){ 
            // if(this._length) return this._length;
            if(!bodyA || !bodyB) return 0; //Fallback length

            //Default length is the average of the width and height of the largest body
            // Need to use fallback in case someone initiates this without using MatterBody
            const A = Object.hasOwn(bodyA,'getBounds') ? bodyA.getBounds() : {width: bodyA.bounds.max.x - bodyA.bounds.min.x, height: bodyA.bounds.max.y - bodyA.bounds.min.y}
            const areaA = A.width * A.height;

            const B = Object.hasOwn(bodyB,'getBounds') ? bodyB.getBounds() : {width: bodyB.bounds.max.x - bodyB.bounds.min.x, height: bodyB.bounds.max.y - bodyB.bounds.min.y}
            const areaB = B.width * B.height;

            if(areaA > areaB) return ((A.width + A.height) >> 1)
            else return ((B.width + B.height) >> 1)
        },
        set length(value){
            // this._length = value;
        },
    };
    
    options = Object.assign(gravityConstraint, options)
    
    return Constraint.create(options);
}

function spring(options){
    // Overwrite other properties in gravityConstraint with constraintOptions, though
    const spring = {
        get stiffness(){ 
            return this._stiffness
        }, 
        set stiffness(name){ this._stiffness=name;},
    };
    
    options = Object.assign({...spring}, options)
    return Constraint.create(options);
}

export default {
    gravity,
    spring,
}
