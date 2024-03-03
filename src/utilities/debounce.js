// Used to ignore repeated calls of a function if it occurs faster than the provided interval
// Essentially its a low-pass filter
// Referened from here: https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
function debounce(func, interval){
    let timer;
    if(!isNaN(parseInt(interval))){
        return (params) => {
            if(timer) clearTimeout(timer);
            timer = setTimeout(func, interval, params);
        }
    } else {
        console.warn('Invalid input provided for debounce (number as Number or String). Please enter a number if you want to use debounce functionality.')
        return func;
    }
}

export default debounce;