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
            const springConstant = brokenMultiplier * Math.max(this._G / (r ** 3), 0.000025)
            

            return springConstant;
        }, 
        set stiffness(name){ this._G = (this._G) ? name : 2000; },
        get length(){ 
            if(this._length) return this._length;   //If length is provided
            if(!bodyA || !bodyB) return 0; //Fallback length

            //Default length is the average of the width and height of the largest body
            const boundsA = bodyA.bounds;
            const widthA = boundsA.max.x - boundsA.min.x;
            const heightA = boundsA.max.y - boundsA.min.y;
            const areaA = widthA * heightA;

            const boundsB = bodyB.bounds;
            const widthB = boundsB.max.x - boundsB.min.x;
            const heightB = boundsB.max.y - boundsB.min.y;
            const areaB = widthB * heightB;

            if(areaA > areaB) return (widthA + heightA) >> 1
            else return (widthB + heightB) >> 1;
        },
        set length(value){
            this._length = value;
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
