import { PropTypes } from 'prop-types'

import { useEffect, useContext } from 'react'

import { Composite, Bodies, Events } from 'matter-js'

import MatterContext from './MatterContext'
import { normalizedPosition } from './MatterCanvasUtils'

// MatterBody.propTypes = {}

// TODO: Pull out the hardcoded values in this function to make it more abstract later.
// TODO: Give option to spawn a specific body by specifying body as the child of the Matter Emitter
export default function MatterEmitter(){
    const { engine, render } = useContext(MatterContext);

    useEffect(()=>{
        if(!render) return console.warn('Render argument for MatterEmitter not provided or is null. Cancelling MatterBody creation');

        // Add falling snow effect
        const particlesActive = [];
        let itemQueued = false;
        let timer = 0;
        const emitParticles = ()=>{
          // Add particles
          if(!itemQueued){
            const [x] = normalizedPosition(render.element, Math.random(),Math.random())
            const randomSize = Math.random()*10+2;
            const particleSides = Math.random()*3+3;
            const particle = Bodies.polygon(x,-1*render.element.clientHeight,particleSides,randomSize, {isStatic: false, render: {fillStyle: '#e3d5ca', strokeStyle: '#7E7F83', lineWidth: 4,}, sleepThreshold: 240});
            particlesActive.push(particle);

            /* TEST. SEEING ATTRACTOR RELATED THING */
            // TODO: Remove this once feature has been properly implemented
            particle.attractor = {
              id: new Set(['mouse']),
              isMain: false,
            }

            Composite.add(engine.world, particle);
            itemQueued = true;
          }

            //Iterate through active particles and delete the ones that are no longer existing
            for(let i = particlesActive.length-1; i>=0; i-=1){
              if(particlesActive[i].position.y > render.element.clientHeight + 10){
                Composite.remove(engine.world, particlesActive[i]);
                particlesActive.splice(i,1);
              }
            }
            timer += 1;
            if(timer < 30) return;

            itemQueued = false;
            timer = 0;
        }

        Events.on(engine, 'afterUpdate',emitParticles);

        return ()=>{
          console.log('Cleaning up emitter');
            Events.off(engine, 'afterUpdate',emitParticles);

            //Search the world for the body and delete all particles
            for(let i = particlesActive.length-1; i>=0; i-=1){
                Composite.remove(engine.world, particlesActive[i]);
                particlesActive.splice(i,1);
            }
        }

    },[engine, render]);

    return null;
}