// Used to ignore repeated calls of a function if it occurs faster than the provided interval
// Essentially its a low-pass filter
// Referened from here: https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
function debounce(func, interval){
    let timer;
    return (params) => {
        if(timer) clearTimeout(timer);
        timer = setTimeout(func, interval, params);
    }
}

export default debounce;