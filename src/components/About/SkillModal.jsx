import { useEffect, useRef, useState, forwardRef } from "react"
import { PropTypes } from "prop-types";

import style from '../../styles/components/SkillModal.module.css'

const SkillModal = forwardRef(function SkillModalRef({modalStateHandler}, ref){
    const backdropRef = useRef();
    const modalRef = useRef();

    const [modalData, setModalData] = useState(null);
    
    useEffect(()=>{
        const closeModal = ()=>{
            modalRef.current.close();
            modalStateHandler();
        };

        const showModal = (data)=>{
            setModalData(data);
            modalRef.current.showModal();
        }

        const currModal = modalRef.current;
        const currBackdrop = backdropRef.current;
        currBackdrop.addEventListener('mousedown', closeModal);
        // currModal.addEventListener('mousedown', closeModal);

        ref.current = {
            closeModal,
            showModal,
        }

        return ()=>{
            currBackdrop.removeEventListener('mousedown', closeModal);
            // currModal.removeEventListener('mousedown', closeModal);
        }
    },[modalStateHandler, ref])
    
    return (
        <dialog className={style.dialogContainer} ref={modalRef}>
            <div className={style.interactableBackdrop} ref={backdropRef}></div>
            <div className={style.modal}>
                <h1 className={style.title}>{(modalData) ? <a href={modalData.link}>{modalData.title}</a> : null}</h1>
                <p className={style.length}>{(modalData) ? modalData.length : null}</p>
                <p className={style.description}>{(modalData) ? modalData.description : null}</p>
                <div className={style.closeText}>Click anywhere outside or press ESC to close</div>
            </div>
        </dialog>
    )
})

SkillModal.propTypes = {
    modalState: PropTypes.bool,
    modalStateHandler: PropTypes.func,
}

SkillModal.defaultProps = {
    modalState: false,
    modalStateHandler: ()=>{}
}

export default SkillModal;