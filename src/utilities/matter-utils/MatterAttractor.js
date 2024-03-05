import { Constraint, Composite } from 'matter-js'
// Returns an attractor that

//All this does is add a new property called attractorType
// IN the future maybe have options and stuff but for now this is time
function create(body, id, isMain = false, ){
    body.attractor = {
        isMain,
        id: parseInt(id,10)
    };
    
    return body;
}

// Iterates through the world bodies, and adds a constraint to every main attractor body with the same id
function addToWorld(world, attractor, constraintOptions = {}){

    //Add the attractor to the world
    Composite.add(world, attractor);

    //Update all existing attractors to constrain them together
    world.bodies.forEach((body)=>{
        //Search conditions
        if(!(Object.hasOwn(body,'attractor') && body.attractor.isMain && body.attractor.id === attractor.attractor.id && body.id !== attractor.id)) return;

        console.log('Adding constraint');
        
        // Overwrites any default body options in case it was set in error
        constraintOptions = Object.assign(constraintOptions, { bodyA: body, bodyB: attractor})

        // By default will use gravitational model unless it is over-written with a specific stiffness property in the options
        // Overwrite other properties in gravityConstraint with constraintOptions, though
        if(!Object.hasOwn(constraintOptions, 'stiffness')) {
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
                      Math.min(Math.abs(this._G / (r^3)),
                      MAX
                    ));
                    
                    return springConstant;
                  }, 
                  set stiffness(name){ this._G = (this._G) ? name : 0.005; },
                  length: 0,
                  render: {
                    visible: false,
                }
            }

            constraintOptions = Object.assign(gravityConstraint, constraintOptions)
        }

        Composite.add(
            world, 
            Constraint.create(constraintOptions)
        );
    })
}

export default {
    create,
    addToWorld
}