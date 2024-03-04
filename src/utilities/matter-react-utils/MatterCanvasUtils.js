function normalizedPosition(scene,x,y){
    //Given a scene and a normalized position within it, returns the new co-ordinate
    const width = scene.clientWidth;
    const height = scene.clientHeight;
    return [width*x, height*y];
}

export {
    normalizedPosition
}