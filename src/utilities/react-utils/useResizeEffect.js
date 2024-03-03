/* This is a custom hook made to do something whenever window is resized */

import { useEffect, useRef} from "react"
import debounce from "../debounce";

const defaultOptions = {
    runInitial: true,
    debounce: 30
}

export default function useResizeEffect(fn, dependencies, options = defaultOptions){    
    const callback = useRef(null);

    //Over-write default options with any specifics given by the user
    options = Object.assign(defaultOptions, options);

    //Run the callback at least once when the hook is loaded and option is provided
    useEffect(()=>{
        if(options.runInitial) window.dispatchEvent(new Event('resize'));
    },[options]);

    //Apply debounce to the callback, if it is provided
    useEffect(() => {
        callback.current = callback.current || (Object.hasOwn(options,'debounce') ? debounce(fn, options.debounce) : fn);

        /* Add event listener */
        window.addEventListener('resize',callback.current)

        return () => { window.removeEventListener('resize',callback.current);}
    // Lint disable because it doesn't like spread array dependencies??
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fn, options, ...dependencies])
}
