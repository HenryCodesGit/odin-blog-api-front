import { PropTypes } from 'prop-types'

import { useEffect, useContext } from 'react'

import { Composite, Bodies, Events } from 'matter-js'

import MatterContext from './MatterContext'
import { normalizedPosition } from './MatterCanvasUtils'

const COLORS = {
    black: '#14110F',
    darkGrey: '#333333',
    grey: '#7E7F83',
    lightGrey: '#DDD',
    beige: '#D9C5B2',
    white: '#F3F3F4',
    green: '#3B6D45',
  }

// MatterBody.propTypes = {}

// TODO: Pull out the hardcoded values in this function to make it more abstract later.
// TODO: Give option to spawn a specific body by specifying body as the child of the Matter Emitter
export default function MatterEmitter(){
    const { engine, render } = useContext(MatterContext);

    useEffect(()=>{
        if(!render){ 
            console.warn('Render argument for MatterEmitter not provided or is null. Cancelling MatterBody creation');
            return;
        } else {
            console.log('Body created successfully');
        }

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
            const particle = Bodies.polygon(x,-30,particleSides,randomSize, {isStatic: false, render: {fillStyle: 'transparent', strokeStyle: COLORS.grey, lineWidth: 1,}, airFriction: 0.5, timeScale: 0.125});
            particlesActive.push(particle);

            /* TEST. SEEING ATTRACTOR RELATED THING */
            particle.attractor = {
              id: 'mouse',
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