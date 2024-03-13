import { useEffect, useState, Children, cloneElement, isValidElement } from "react";
import PropTypes from 'prop-types'

Loader.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
    onLoadHandler: PropTypes.func.isRequired
};

export default function Loader({id, children, onLoadHandler}){

    const [childrenLoaded, setLoader] = useState({});
    const [elements, setElements] = useState(null);

    //Recursively go through the children and load them
    useEffect(()=>{
        
         //BASE CASE, NO CHILDREN.
        if(Children.count(children) == 0) {
            setElements(children);
            onLoadHandler();
            return;
        }

        //BASE CASE. Children Loaded has already been set. Check to see if all the children are loaded
        if(Object.keys(childrenLoaded).length > 0) {
            const loadedValues = Object.values(childrenLoaded);
            if(!loadedValues.includes(false)){
                onLoadHandler(); //All children are loaded, therefore call onLoadHandler
            }
            return; //Regardless, return afterwards
        }


        //BASE CASE. Length of childrenloaded is 0, and object has children. Therefore need to go through each and check
        const childArray = Children.toArray(children);
        let childIndex = 0;
        const childrenWithLoaders = [];
        const array = childArray.map((child)=>{
            const subID = `${id}_${childIndex++}`; //Give the child a subID, increment the childIndex
            const count = (isValidElement(child.props.children)) ? Children.count(child.props.children) : 0; // Get the number of children 
            const childWithLoader = (count <= 0) ? null : //If it has children, then need to load the grandchildren too
            (
                cloneElement(child,null,(
                    <Loader  id={subID} onLoadHandler={()=>{
                        const currState = {...childrenLoaded}; //NOTE: This might be a bug in lexical scoping. Fix it you find issues later
                        currState[subID] = true;
                        setLoader(currState); 
                    }}>
                        {child.props.children}
                    </Loader>
                ))
            ); //ISSUE IS HERE
            

            if(!childWithLoader) return child;

            const obj = {};
            obj[subID] = false;
            childrenWithLoaders.push(obj);
            return childWithLoader;
        });

        //Check if we can set the component to loaded early
        if(childrenWithLoaders.length <= 0){
            onLoadHandler();
        } else {
            setLoader(Object.assign({...childrenLoaded},...childrenWithLoaders))
        }

        //Elements to display on the page
        setElements(array);
    },[id, children, onLoadHandler, childrenLoaded])
    return elements;
}