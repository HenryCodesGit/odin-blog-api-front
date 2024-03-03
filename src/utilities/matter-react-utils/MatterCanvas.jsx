import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import useResizeEffect from '../react-utils/useResizeEffect'

import style from './MatterCanvas.module.css';

import { Engine, Runner, Render, World, Bodies, Composite} from 'matter-js'

Component.propTypes = {
  options: PropTypes.shape({
    engine: PropTypes.object,
    runner: PropTypes.object
  })
};

const defaultOptions = {
    engine: { gravity: { y: 0} },
    runner: {}
  };

function Component({ options }) {

  //Merging default options with provided options so that default values aren't lost, and the ones that are provided are updated
  options = Object.assign(defaultOptions, options);

  /* Keep state of matterJS Engine components between renders */
  const scene = useRef();
  const engine = useRef(Engine.create(options.engine))
  const runner = useRef(Runner.create(options.runner));
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
  }, [],{debounce: 30})

  useEffect(() => {

    // On initial mount, need to create the renderer (Need to do it here because scene.current.parentNode does not exist yet)
    // TODO: Render options can be passed in?
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

    // Setting shortcut references to the current mattrerJS variables
    const currEngine = engine.current;
    const currRunner = runner.current;
    const currRender = render.current;

    //Add bodies to world
    // Composite.add(currEngine.world, items);

    // Start the renderer
    Render.run(currRender);

    //Run the Physics Engine /w matterJS default Runner
    Runner.run(currRunner, currEngine);

    /* Custom Runner */
    //   update();

    //   function update(){
    //     Engine.update(currEngine,1000/60);
    //     requestAnimationFrame(update);
    //   }

    return () => {
      Render.stop(currRender);
      World.clear(currEngine.world);
      Runner.stop(currRunner);
      Engine.clear(currEngine);
      currRender.canvas.remove();
      currRender.canvas = null;
      currRender.context = null;
      currRender.textures = {};

      render.current = null;
    }
  }, [])

  return <div ref={scene} className={style.matterCanvas}/>
}

export default Component;