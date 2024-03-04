import { useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';

import useResizeEffect from '../react-utils/useResizeEffect'

import style from './MatterCanvas.module.css';

import { Engine, Runner, Render, World, Events} from 'matter-js'

const MatterCanvas = forwardRef(function MatterCanvasRef({ engine, runner, useCustomRunner, backgroundColor }, sceneRef) {

  /* Keep state of matterJS Engine components between renders */
  const scene = sceneRef;
  const render = useRef(null); // Can't set on instantiation because it depends on the scene ref being initialized with a parent first

  // Ensure the canvas is always the same size as its parent
  useResizeEffect(()=>{ 
    const width = scene.current.parentNode.clientWidth;
    const height = scene.current.parentNode.clientHeight;

    render.current.bounds.max.x = width;
    render.current.bounds.max.y = height;
    render.current.options.width = width;
    render.current.options.height = height;
    render.current.canvas.width = width;
    render.current.canvas.height = height;
    Render.setPixelRatio(render.current, window.devicePixelRatio);

    //
  },()=>{}, [scene, render],{debounce: 30})

  useEffect(() => {

    // On initial mount, need to create the renderer (Need to do it here because scene.current.parentNode does not exist yet)
    // TODO: Render options can be passed in?
    render.current = Render.create({
      element: scene.current,
      engine: engine,
      options: {
      width: scene.current.parentNode.clientWidth,
      height: scene.current.parentNode.clientHeight,
      wireframes: false,
      background: backgroundColor,
      pixelRatio: window.devicePixelRatio,
    }});

    // Setting shortcut references to the current mattrerJS variables
    const currRender = render.current;

    //Add bodies to world
    // Composite.add(currEngine.world, items);

    // Start the renderer
    Render.run(currRender);

    //Run the Physics Engine /w matterJS default Runner
    if(!useCustomRunner) Runner.run(runner, engine);

    /* Custom Runner */
    //   update();

    //   function update(){
    //     Engine.update(currEngine,1000/60);
    //     requestAnimationFrame(update);
    //   }

    return () => {
      Render.stop(currRender);
      World.clear(engine.world);
      if(!useCustomRunner) Runner.stop(runner);
      Engine.clear(engine);
      currRender.canvas.remove();
      currRender.canvas = null;
      currRender.context = null;
      currRender.textures = {};

      render.current = null;
    }
  }, [scene, engine, runner, useCustomRunner, backgroundColor])

  return <div ref={sceneRef} className={style.matterCanvas}/>
})

MatterCanvas.propTypes = {
  engine: PropTypes.object.isRequired,
  backgroundColor: PropTypes.string,
  useCustomRunner: PropTypes.bool,
  runner: function(props, propName, componentName){
    //If custom runner is used, ignore this
    if(!props.useCustomRunner) return;

    // Must have the runner property supplied, and its property must be of the type 'object'
    if (!Object.hasOwn(props, propName) || typeof props[propName] !== 'object'){
      return new Error(`Invalid prop '${propName}' supplied to '${componentName}'. If the 'useCustomRunner' property is false (default) then an instance of a matterJS Runner must be supplied`);
    }
  },
};

MatterCanvas.defaultProps = {
  backgroundColor: 'transparent',
  useCustomRunner: false,
};


/* ********************************************************** */

export default MatterCanvas;