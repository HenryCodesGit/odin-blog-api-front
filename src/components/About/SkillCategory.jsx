// Matter-React-Utils
import MatterAttractor from '../../utilities/matter-react-utils/MatterAttractor';
import MatterBody from "../../utilities/matter-react-utils/MatterBody"
import MatterOverlayPassenger from '../../utilities/matter-react-utils/MatterOverlayPassenger';
// MatterJS
import { Constraint } from 'matter-js'
// React
import { Children, useRef, useState, cloneElement, useEffect, useMemo} from "react"
import PropTypes from 'prop-types'
// Styling
import style from '/src/styles/components/SkillCategory.module.css'
import Constraints from '../../utilities/matter-react-utils/Constraints';
// uuid
import { v4 as uuidv4} from 'uuid'

SkillCategory.propTypes = {
}

export default function SkillCategory({text, attractorID}){
    const nameRef = useRef();

    const [template, setTemplate] = useState();
    const [passenger, setPassenger] = useState();
    const [uuid] = useState(uuidv4());
    const newID = useMemo(()=>{
        let id = (typeof attractorID === 'string' || typeof attractorID === 'number') ? [attractorID] : attractorID;
        id = [`${uuid}`, ...id]
        return id;
    },[attractorID, uuid])

    useEffect(()=>{
        const child = (<div><h1 className={style.category}>{text}</h1></div>)
       
        const template = cloneElement(child, {className: style.template, ref:nameRef, 'aria-hidden': true})
        const passenger = cloneElement(child,{className: style.passenger})
        setTemplate(template);
        setPassenger(passenger);
    },[text])

    useEffect(()=>{

    },[attractorID])

    return (<>
        {template}
        <MatterAttractor attractorID={newID[0]} isMain={true}>
            <MatterBody 
            bodyType='circle' 
            bodyParams={{
                syncToHTML: {
                    size: true,
                    position: true,
                    reference: nameRef,
                },
                normalized:{ radius: 0.1, position:{ x: 0.5, y: 0.5,}},
                options: {
                    isStatic: true,
                    isSensor: true,
                    render: {visible: false, lineWidth: 2, strokeStyle: 'red', fillStyle: 'transparent',},
                }
            }} />
        </MatterAttractor>
        <MatterOverlayPassenger elementHTML={passenger}>
            <MatterAttractor attractorID={newID} isMain={true} constraintCallback={Constraint.create} constraintOptions={{length: 0, damping: 0.02, stiffness: 0.001, render: {visible: false}}}>
                <MatterBody 
                bodyType='circle' 
                bodyParams={{
                    syncToHTML: {
                        size: true,
                        reference: nameRef,
                    },
                    lockRotation: true,
                    normalized:{ radius: 0.1, position:{ x: 0.5, y: 0.5,}},
                    options: {
                        render: {visible: false},
                        isStatic: false,
                        fillStyle: 'transparent',
                        friction: 0,
                    }
                }} />
            </MatterAttractor>
        </MatterOverlayPassenger>
    </>)
}