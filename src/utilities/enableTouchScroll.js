export default function enableTouchScroll(element){
    // Creating the mouse prevents touch drag from occurring, so need to manually put it back in
    let touchStartY;

    function scroll(touchEvent){
        touchEvent.preventDefault();        
        window.scrollBy({
        top: touchStartY-touchEvent.changedTouches[0].pageY,
        left: 0,
        behaviour: 'smooth'
        });
    }

    function update(touchEvent){
        touchEvent.preventDefault();
        touchStartY = touchEvent.changedTouches[0].pageY;
    }
    element.addEventListener('touchmove', scroll);
    element.addEventListener('touchstart', update);

    return {
        cleanup: ()=>{
            element.removeEventListener('touchmove', scroll);
            element.removeEventListener('touchstart', update);
        },
    }
}