// TODO: A Canvas element where i can enter in array of skills and it will create a canvas of floating orbs.
// Each orb will float around with initial momentum and elastically collide with other orbs
// Orbs of similar categories will have an attractive force
// Orbs of differing categories will have a repulsive force
// Make sure there's a maximum speed so that things don't get out of hand
// The mouse will serve as a repulsive force

/* See matter.js */
// https://brm.io/matter-js/

/*  Format of data input will be array of json objects [...Object]
    Objects will be in the following format 
    {
        Description: HTML
        ImageURL: https://example.com
        Category: Webdev
    }
*/

import { useEffect, useRef } from 'react'
import { Engine, Render, Runner, Mouse, Composite, World, Events, Bodies } from 'matter-js'

import style from '../styles/components/SkillsCanvas.module.css'

import useResizeEffect from '../utilities/react-utils/useResizeEffect'

const COLORS = {
    black: '#14110F',
    darkGrey: '#333333',
    grey: '#7E7F83',
    lightGrey: '#DDD',
    beige: '#D9C5B2',
    white: '#F3F3F4',
    green: '#3B6D45',
}

function Component(props){

    const scene = useRef();
    const engine = useRef(Engine.create({ gravity: { y: 0.05 } }))
    const runner = useRef(Runner.create());
    const render = useRef(null);
    const mouse = useRef(null);
    
    const itemQueued = useRef(false);
    const timer = useRef(0);

    // Ensure the canvas is always the same size as its parent
    useResizeEffect(()=>{
        ()=>{ 
            const width = scene.current.parentNode.clientWidth;
            const height = scene.current.parentNode.clientHeight;

            render.current.bounds.max.x = width;
            render.current.bounds.max.y = height;
            render.current.options.width = width;
            render.current.options.height = height;
            render.current.canvas.width = width;
            render.current.canvas.height = height;
            Render.setPixelRatio(render.current, window.devicePixelRatio); // added this
        }
    }, [],{debounce: 30})
  
    useEffect(() => {

      const currEngine = engine.current;
      const currRunner = runner.current;

      if(render.current === null){
        render.current = Render.create({
            element: scene.current,
            engine: engine.current,
            options: {
              width: scene.current.parentNode.clientWidth,
              height: scene.current.parentNode.clientHeight,
              wireframes: false,
              background: 'transparent',
              pixelRatio: window.devicePixelRatio,
            }});
      }
      const currRender = render.current;

      if(mouse.current === null){
        mouse.current = Mouse.create(scene.current);
      }

      const cw = scene.current.parentNode.clientWidth
      const ch = scene.current.parentNode.clientHeight
      const [x, y] = normPosition(currRender, 0.5,0.5);
      //Create bodies
      const items = [ /* Format is.. (centerPositionX, centerPositionY, Width, Height) */
        // Bodies.rectangle(x,y,200,200, {isStatic: false, render: {fillStyle: COLORS.grey}}), 
        // Bodies.rectangle(450,50,80,80, {isStatic: false, render: {fillStyle: 'transparent', strokeStyle: COLORS.beige, lineWidth: '5'}}), 
        // Bodies.rectangle(450,50,80,80, {isStatic: false, render: {fillStyle: 'white'}}), 
        // Bodies.rectangle(0,ch,cw*2,50, {isStatic: true, render: {fillStyle: '#222'}})
      ]

      Events.on(currEngine, 'afterUpdate',()=>{
        if(!itemQueued.current){
            const [x] = normPosition(currRender, Math.random(),Math.random())
            const randomSize = Math.random()*10+2;
            //Composite.add(currEngine.world, Bodies.rectangle(x,0,randomSize,randomSize, {isStatic: false, render: {fillStyle: COLORS.grey}}));
            itemQueued.current = true;

            // console.log(currEngine.world.bodies.length);
            //console.log(mouse.current.position);
        }
        timer.current = timer.current+1;

        if(timer.current >= 5){
            itemQueued.current = false;
            timer.current = 0;
        }

      })

      //Add bodies to world
      Composite.add(currEngine.world, items);

      //Render the bodies
      Render.run(currRender);
  
    //   /* Provides the game loop and continuously updates the engine */
    Runner.run(currRunner, currEngine);

    /* Custom Runner */
    //   update();
    //   function update(){
    //     Engine.update(currEngine,1000/60);
    //     requestAnimationFrame(update);
    //   }
  
      return () => {
        console.log('Clearing Engine');
        Render.stop(currRender);
        World.clear(currEngine.world);
        Runner.stop(currRunner);
        Engine.clear(currEngine);
        currRender.canvas.remove();
        currRender.canvas = null;
        currRender.context = null;
        currRender.textures = {};
        Events.off(currEngine);

        render.current = null;
      }
    }, [])
  
    return (
        <div ref={scene} className={style.skillsCanvas}/>
    )
}

function normPosition(render,x,y){
    //Given a scene and a normalized position within it, returns the new co-ordinate
    const width = render.options.width;
    const height = render.options.height;
    return [width*x, height*y];
}
// Component.propTypes = {
// };

// Component.defaultProps = {
// };

export default Component;