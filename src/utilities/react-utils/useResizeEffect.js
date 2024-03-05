/* This is a custom hook made to do something whenever window is resized */

import { useEffect, useCallback } from "react"
import debounce from "../debounce";

const defaultOptions = {
    runInitial: false, //Note: run-initial can be used to run the useEffect immediately when the component loads. 
    debounce: 30
}

export default function useResizeEffect(fn, cleanup, dependencies, options){    
    //Over-write default options with any specifics given by the user
    options = Object.assign({...defaultOptions}, options);

    //Disabling linter rule because responsibility for dependencies is passed to 'dependencies' variable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memofn = useCallback(fn, dependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoCleanUp = useCallback(cleanup, dependencies);

    //Apply debounce to the callback, if it is provided
    useEffect(() => {
        const callback = (Object.hasOwn(options,'debounce') ? debounce(memofn, options.debounce) : memofn);

        if(options.runInitial){ callback() };

        /* Add event listener */
        window.addEventListener('resize',callback)

        return () => { 
            window.removeEventListener('resize',callback);
            memoCleanUp();
        }
    // Lint disable because it doesn't like spread array dependencies??
    }, [memofn, memoCleanUp, options]) /* [fn, options, ...dependencies] */
}
