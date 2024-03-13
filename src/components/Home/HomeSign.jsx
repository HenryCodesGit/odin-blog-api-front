// React
import { useEffect, useRef, useState, useContext } from "react";
// Matter-React Utils
import MatterBody from '../../utilities/matter-react-utils/MatterBody';
import MatterAttractor from '../../utilities/matter-react-utils/MatterAttractor'
import MatterOverlayPassenger from '../../utilities/matter-react-utils/MatterOverlayPassenger'
import MatterContext from "../../utilities/matter-react-utils/MatterContext";
//MatterJS
import { Events, Constraint, Body } from 'matter-js'
// Styling
import style from '../../styles/components/HomeSign.module.css'


export default function HomeSign(){

    const [component, setComponent] = useState(null)
    const [body, setBody] = useState(null)
    const nameRef = useRef(null);
    const { engine, render } = useContext(MatterContext);

    useEffect(()=>{
        //Making the name section itself
        const profileHTML = (
            <div className={`${style.profile}`} style={{pointerEvents: 'none'}}>
            <p className={`${style.title}`}>Henry Ma</p>
            <p className={style.description}>MOTIVATED // DILIGENT // VERSATILE // ..ALSO LOVES DOGS</p>
            </div>
        );
    
        const profileName = (
            <div className={`${style.profile}`} style={{pointerEvents: 'none', visibility: 'hidden', ariaHidden: 'true'}} ref={nameRef}>
            <p className={`${style.title}`}>Henry Ma</p>
            <p className={style.description}>MOTIVATED // DILIGENT // VERSATILE // ..ALSO LOVES DOGS</p>
            </div>
        )

        setComponent (
            <>
              <div className={style.section}>
                  {profileName}
                  <MatterAttractor attractorID='profile' isMain={true}>
                    <MatterBody {...{
                      bodyType: 'rectangle',
                      bodyParams:{
                        syncToHTML: {
                          size: true,
                          position: true,
                          reference: nameRef,
                        },
                        normalized:{
                          position: {x: 0.5, y: 0.5},
                          width: 0.33,
                          height: 0.33,
                        },
                        options: { isStatic: true, render: {visible: false, fillStyle:'#0F05'}, isSensor: true}
                      }
                    }}/>
                  </MatterAttractor>
              </div>
              <MatterOverlayPassenger elementHTML={profileHTML}>
                <MatterAttractor attractorID='profile' isMain={false} maxLength={3} constraintCallback={Constraint.create} constraintOptions={{angularStiffness: 1, stiffness: 0.04,length: 1, render:{visible: false}}}>
                  <MatterBody {...{
                    bodyType: 'rectangle',
                    bodyParams:{
                      syncToHTML: {
                        size: true,
                        reference: nameRef,
                      },
                      keepRelativeWorldDims:{
                        position: true,
                      },
                      normalized:{
                        position: {x: 0.5, y: 0.5},
                        width: 0.5,
                        height: 0.33,
                      },
                      options: { isStatic: false, render: {visible: false, fillStyle: '#00F9'}, timeScale: 2, restitution: 0.8, mass: 0.5}
                    },
                    bodyDataHandler: (data)=>{setBody(data)}
                  }}/>
                </MatterAttractor>
              </MatterOverlayPassenger>
            </>
          )
    },[])

    useEffect(()=>{
        if(!body) return;
        
        function keepOnScreen(){
            const factorOfSafety = 2;
            if(body.position.x > factorOfSafety * render.element.clientWidth || body.position.y > factorOfSafety * render.element.clientHeight){
                Body.setAngle(body,0)
                Body.setPosition(body,{x: render.element.clientWidth*0.5, y: -1*render.element.clientHeight})
            }
        }

        Events.on(engine,'afterUpdate', keepOnScreen);

        return ()=>{
            Events.off(engine,'afterUpdate',keepOnScreen);
        }


    },[body, render, engine])

    return component
}