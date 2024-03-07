function normalizedPosition(renderElement,x,y){
    //Given a scene and a normalized position within it, returns the new co-ordinate
    return [
        renderElement.clientWidth * x, 
        renderElement.clientHeight * y
    ];
}

function normalizedWidth(renderElement, width){
    return renderElement.clientWidth * width;
}

function normalizedHeight(renderElement, height){
    return renderElement.clientHeight * height;
}

function normalizedVertices(renderElement, vertexArray){
    return vertexArray.map(({x, y})=>{
        const [newX, newY] = normalizedPosition(renderElement,x,y)
        return {newX, newY}
    });
}


export {
    normalizedPosition,
    normalizedWidth,
    normalizedHeight,
    normalizedVertices
}