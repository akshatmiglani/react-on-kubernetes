import { useEffect, useRef, useState } from 'react'

function App() {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing,setIsDrawing] = useState(false); 
  const [color,setColor]=useState('black');
  const [isEraserActive, setIsEraserActive] = useState(false);

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
    context.strokeStyle = color;
    context.lineWidth=5;
    contextRef.current = context;

  },[])

  const reloadPage = () => {
    window.location.reload()
  }

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
    contextRef.current.strokeStyle = isEraserActive ? 'white':color;
    contextRef.current.lineWidth= isEraserActive ? 20:5;
    contextRef.current.lineTo(x,y);
    contextRef.current.stroke();  
 
  }

  const activateEraser=()=>{
    setIsEraserActive(true);
  }

  const activateColor=(newColor)=>{
    setIsEraserActive(false);
    setColor(newColor);
  }

  return (
    <>
    <div style={{display:'flex', margin:'2px', alignItems:'center', justifyContent:'center'}}>
      <h1 style={{textAlign:'center', fontFamily:'monospace', fontWeight:'lighter'}}>Start Drawing!</h1>
      <button style={{padding:'2px', margin:'5px', textAlign:'center', width:'100px', height:'30px', backgroundColor:'white', border:'1px solid black',borderRadius:'25px'}} onClick={reloadPage}>Clear Canvas </button>

      <div style={{display: 'flex', flexDirection:'flex-row', marginLeft:'10px',gap:'5px'}}>
        <button style={{padding:'15px', backgroundColor:'black'}} onClick={()=>activateColor('black')}></button>
        <button style={{padding:'15px', backgroundColor:'red'}} onClick={()=>activateColor('red')}></button>
        <button style={{padding:'15px', backgroundColor:'blue'}} onClick={()=>activateColor('blue')}></button>
        <button style={{padding:'15px', backgroundColor:'green'}} onClick={()=>activateColor('green')}></button>

        <button style={{padding:'10px',marginLeft:'10px',backgroundColor:'lightgray',border:'1px solid black', borderRadius:'5px',cursor:'pointer'}} onClick={activateEraser}>Eraser</button>
        <input type='color' value={color} onChange={(e)=> activateColor(e.target.value)} style={{marginLeft:'10px', width:'40px',height:'40px', border:'none', cursor:'pointer'}} />
      
      </div>
    </div>  
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
