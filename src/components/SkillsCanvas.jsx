import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterOverlay from'../utilities/matter-react-utils/MatterOverlay';
import MatterOverlayDriver from '../utilities/matter-react-utils/MatterOverlayDriver';
import MatterOverlayPassenger from '../utilities/matter-react-utils/MatterOverlayPassenger';
import MatterAttractor from '../utilities/matter-react-utils/MatterAttractor';

import style from '../styles/components/SkillsCanvas.module.css'

import image from '../assets/icons/matter-logo.svg'

// TODO: Skills will be arranged in this structure:
/*
---WEB DEV
- HTML, CSS, JS, REACT, EXPRESS, NODE, MONGO, POSTGRESQL, GIT

-GAME PROGAMMING
-UNITY (C#), matterJS?

---ENGINEERING DESIGN
AUTOCAD, SOLIDWORKS, MATLAB, COMSOL

----HANDS ON
-SCIENTIFIC INSTRUMENT OPERATION AND TROUBLESHOOTING, ELECTRONIC COMPONENT REPAIR, ADDITIVE MANUFACTURING DESIGN AND OPERATION

---HOBBIES
-ROCKCLIMBING, SNOWBOARDING, VIDEOGAMES, BOARD GAMES, ANIME

*/

// Headings will become static rigid bodies that will become linked to HTML elements above the canvas. 
// If the HTML element moves because of flex or resizing, the rigid body moves as well
// Purpose of this is so that it is accessible.
// Or maybe isntead have accessible only html elements that are hidden from normal DOM?

// Skills inside will become free floating rigid body elements inside the canvas, also linked to an HTML element, but instead it has position: absolute.

//TODO: Size of hexagons will resize to fit canvas -> Canvas will resize to fit page due to its styling
//TODO: Clicking and dragging the headings will momentarily change them to position:absolute and remove them from the default flow?

// export default function SkillsCanvas(){

//     const scene = useRef();
//     const engine = useRef(Engine.create({ 
//       gravity: { y: 0 },
//       constraintIterations: 2,
//       positionIterations: 6,
//       velocityIterations: 4,
//     }));
//     const runner = useRef(Runner.create({
//       delta: 1000/60,
//       isFixed: true
//     }));

//     const mouse = useRef()
//     const mouseConstraint = useRef()

//     const overlayRef = useRef();
//     const buttonRef = useRef();
//     const circleRef = useRef();
//     const imageRef = useRef();
    
//     //On resize, 
//     useResizeEffect(
//       ()=> {
//         console.log('Checking skills canvas');
//         mouse.current.pixelRatio = window.devicePixelRatio; //Need to reset mouse pixel ratio as it might change (i.e. moving window between screens)

//         //Setting engine item relative to HTML
//         const overlayBounds = overlayRef.current.getBoundingClientRect();
//         const buttonBounds = buttonRef.current.getBoundingClientRect();
//         const buttonX = buttonBounds.x - overlayBounds.x + buttonBounds.width/2;
//         const buttonY = buttonBounds.y - overlayBounds.y + buttonBounds.height/2;
//         Body.setPosition(circleRef.current, {x: buttonX, y:buttonY})

//       },
//       ()=>{}, // No cleanup needed
//       [], // No dependencies 
//       {debounce: 100, runInitial: true} // Throttle the function call
//     )
    
//     useEffect(()=>{
//         const currEngine = engine.current;
//         const world = currEngine.world;
//         const canvas = scene.current.querySelector('canvas')

//         // Mouse and its constraint has to initiate after the other refs are created
//         mouse.current = Mouse.create(canvas);
//         mouse.current.pixelRatio = window.devicePixelRatio; // This is needed because the matterJS Library has a bug.
//         mouseConstraint.current = MouseConstraint.create(engine.current, { mouse: mouse.current });

//         // Creating the mouse prevents scroll events from occuring, so need to manually put it back in
//         canvas.onmousewheel = (event) => { window.scrollBy(event.deltaX, event.deltaY);} // Mouse wheel
//         const touchScroll = enableTouchScroll(canvas); // Touch events

//         const overlayBounds = overlayRef.current.getBoundingClientRect();
//         const buttonBounds = buttonRef.current.getBoundingClientRect();

//         const buttonX = buttonBounds.x - overlayBounds.x + buttonBounds.width/2;
//         const buttonY = buttonBounds.y - overlayBounds.y + buttonBounds.height/2;

//         circleRef.current = MatterAttractor.create(
//           Bodies.circle(
//             buttonX,buttonY,25, //X, Y, Radius
//             { isStatic: true, render: { fillStyle: '#222'}}
//           ),
//           1, // Attractor id
//           true // Attracting body
//         );
//         MatterAttractor.addToWorld(world, circleRef.current);

//         let boundingRect = imageRef.current.getBoundingClientRect();
//         let newParticle = Bodies.circle(0, 0, boundingRect.width/2, {isStatic: false, render: {fillStyle: '#0000', strokeStyle: '#222', lineWidth: 2}, friction: 0, frictionAir: 0.005});
//         newParticle = MatterAttractor.create(newParticle,1,false);
//         MatterAttractor.addToWorld(world,newParticle, {length: boundingRect.width})

//         //Set initial position of HTML element
//         //Setting HTML item relative to engine
//         const bodyPosition = newParticle.position;
//         const imageX = parseInt(bodyPosition.x,10);
//         const imageY = parseInt(bodyPosition.y,10);

//         //Calculate how fast transition must be to reach next spot in a single tick
//         imageRef.current.style.top = `${imageY}px`;
//         imageRef.current.style.left = `${imageX}px`;

//         // Move the image after every update
//         Events.on(currEngine,'afterUpdate',()=>{

//           //Setting HTML item relative to engine
//           const bodyPosition = newParticle.position;
//           const imageBounds = imageRef.current.getBoundingClientRect();
//           const imageX = parseInt(bodyPosition.x - imageBounds.width/2,10);
//           const imageY = parseInt(bodyPosition.y - imageBounds.height/2,10);

//           //Calculate how fast transition must be to reach next spot in a single tick
//           const tickTiming = 1000/60;
//           imageRef.current.style.transition= `transform calc(${tickTiming}ms) steps(1, jump-start)`; /* Make sure physics engine delta is set to the same amount. */
//           imageRef.current.style.transform = `translate(${imageX}px, ${imageY}px)`;
//         })


//         // // {isStatic: false, render: {fillStyle: color}, friction: 0.5, slop: 0.01, frictionAir: 0.03});
//         // const particleSize = 40;
//         // Events.on(mouseConstraint.current,'mousedown',(event)=>{
//         //   const {x,y} = event.mouse.mousedownPosition
//         //   let newParticle = Bodies.circle(x, y, particleSize, {isStatic: false, render: {fillStyle: '#000', strokeStyle: '#222', lineWidth: 2}, friction: 0, frictionAir: 0.005});
//         //   newParticle = MatterAttractor.create(newParticle,1,false);
//         //   MatterAttractor.addToWorld(world,newParticle, {length: particleSize * 2})
//         // });

//         return () => {
//           Events.off(currEngine);
//           Events.off(mouseConstraint.current);
//           World.clear(world); //Temporary delete after
//           touchScroll.cleanup();
//         }
//     },[]);

//     return (<>
//       <div className={style.overlay} ref={overlayRef}>
//         <button className={style.test} ref={buttonRef}>Example skill here later</button>
//         <a className={style.floatingCircle} href="https://google.ca" ref={imageRef}>
//           <img src={image}/>
//         </a>       
//       </div>
//       <MatterCanvas engine={engine.current} runner={runner.current} ref={scene} backgroundColor='transparent'/>
//     </>)
// }

export default function SkillsCanvas(){

    const engineParams = {
      backgroundColor: 'transparent',
      engineOptions: {
        gravity: { y: 0}
      }
    }

    const driverParams = {
      elementHTML: (<button>Example skill here later</button>)
    }

    const driverBodyParams = {
      bodyType: 'rectangle',
      bodyParams: {
        scaleOnResize: false,
        normalized:{
          pos: {x: 0.25, y: 0.25},
          width: 0.1,
          height: 0.1,
        },
        options: { isStatic: true}
      },
    }

    const passengerParams = {
      elementHTML: (<a className={style.floatingCircle} href="https://google.ca"><img src={image}/></a>)
    }

    const passengerBodyParams = {
      bodyType: 'circle',
      bodyParams: {
        scaleOnResize: false,
        normalized:{
          pos: {x: 0, y: 0},
          radius: 0.01,
        },
        options: { isStatic: false}
      }, 
    }

    return (
      <MatterCanvas {...engineParams}>
        <MatterOverlay>
          <MatterOverlayDriver {...driverParams}>
            <MatterAttractor attractorID='1' isMain={true}>
              <MatterBody {...driverBodyParams} />
            </MatterAttractor>
          </MatterOverlayDriver>
          <MatterOverlayPassenger {...passengerParams}>
            <MatterAttractor attractorID='1' isMain={false}>
              <MatterBody {...passengerBodyParams}/>
            </MatterAttractor>
          </MatterOverlayPassenger>
        </MatterOverlay>
      </MatterCanvas>
    )
}