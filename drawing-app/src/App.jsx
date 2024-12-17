import { useEffect, useRef, useState } from 'react'

function App() {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing,setIsDrawing] = useState(false); 

  const scaleFactor = 2;

  useEffect(()=>{
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * scaleFactor;
    canvas.height = window.innerHeight * scaleFactor;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d")
    context.scale(scaleFactor,scaleFactor);
    context.lineCap="round"
    context.strokeStyle = "black"
    context.lineWidh=5;
    contextRef.current = context;

  },[])

  const getMousePosition = (event) =>{

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);
    return { x, y };
  }
  
  const startDrawing = (event)=>{
    const {x, y} = getMousePosition(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x,y); 
    setIsDrawing(true);
  }

  const finishDrawing = ()=>{
    contextRef.current.closePath();
    setIsDrawing(false);   
  }

  const draw = (event)=>{

    if(!isDrawing){
      return;
    }
  
    const {x, y} = getMousePosition(event);
    contextRef.current.lineTo(x,y);
    contextRef.current.stroke();  
 
  }

  return (
    <>
      <canvas 
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        onMouseLeave={finishDrawing}
        style={{border:"1px solid black"}}
      />

    </>
  )
}

export default App
