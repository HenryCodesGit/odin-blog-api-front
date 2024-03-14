import { useEffect, useRef } from "react"
import { PropTypes } from "prop-types";

import style from '../../styles/components/HomeModal.module.css'

HomeModal.propTypes = {
    modalVisible: PropTypes.bool,
}

HomeModal.defaultProps = {
    modalVisible: false,
}
export default function HomeModal({modalVisible}){
    const modalRef = useRef();
    const backdropRef = useRef();

    
    const closeModal = ()=>{modalRef.current.close()};
    useEffect(()=>{

        const currModal = modalRef.current;
        const currBackdrop = backdropRef.current;
        currBackdrop.addEventListener('mousedown', closeModal);
        currModal.addEventListener('mousedown', closeModal);

        return ()=>{
            currBackdrop.removeEventListener('mousedown', closeModal);
            currModal.removeEventListener('mousedown', closeModal);
        }
    },[])
    
    useEffect(()=>{
        if(modalVisible) modalRef.current.showModal()
        else modalRef.current.close();

    },[modalVisible])
    return (
        <dialog className={style.dialogContainer} ref={modalRef}>
            <div className={style.interactableBackdrop} ref={backdropRef}></div>
            <div className={style.modal}>
                You can interact with the background. Try it out!
                <div className={style.closeText}>Click anywhere to close</div>
            </div>
        </dialog>
    )
}