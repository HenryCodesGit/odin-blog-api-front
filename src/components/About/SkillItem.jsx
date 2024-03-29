// Matter-React-Utils
import MatterAttractor from '../../utilities/matter-react-utils/MatterAttractor';
import MatterBody from "../../utilities/matter-react-utils/MatterBody"
import MatterOverlayPassenger from '../../utilities/matter-react-utils/MatterOverlayPassenger';
// MatterJS
import { Constraint } from 'matter-js'
// React
import { Children, useRef, useState, cloneElement, useEffect} from "react"
import PropTypes from 'prop-types'
// Other components
import ImageLoader from '../Loading/ImageLoader';
import SkillModal from './SkillModal'
// Styling
import style from '/src/styles/components/SkillItem.module.css'
import Constraints from '../../utilities/matter-react-utils/Constraints';

export default function SkillItem({link, imageSRC, skillInfo, onClickHandler, attractorID}){
    const nameRef = useRef();

    const [template, setTemplate] = useState();
    const [passenger, setPassenger] = useState();

    useEffect(()=>{
        const child = (
            <div>
                <button className={style.itemButton} onClick={()=>{onClickHandler(skillInfo)}}>
                    < ImageLoader src={imageSRC} />
                </button>
            </div>
        )
        
        const template = cloneElement(child, {className: style.template, ref:nameRef, 'aria-hidden': true})
        const passenger = cloneElement(child,{className: style.passenger})
        setTemplate(template);
        setPassenger(passenger);
    },[imageSRC, onClickHandler, skillInfo])

    return (<>
        {template}
        <MatterOverlayPassenger elementHTML={passenger}>
            <MatterAttractor attractorID={attractorID} isMain={false} constraintOptions={{render: {visible: false}}}>
                <MatterBody 
                bodyType='circle' 
                bodyParams={{
                    syncToHTML: {
                        size: true,
                        reference: nameRef,
                    },
                    lockRotation: true,
                    normalized:{ radius: 0.01, position:{ x: 0.5, y: 0.5,}},
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