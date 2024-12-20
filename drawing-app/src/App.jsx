import { useEffect, useRef, useState } from 'react'

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('black');
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [drawingMode, setDrawingMode] = useState('freehand'); 
  const [startPosition, setStartPosition] = useState(null);

  const scaleFactor = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * scaleFactor;
    canvas.height = window.innerHeight * scaleFactor;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(scaleFactor, scaleFactor);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = 5;
    contextRef.current = context;

  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  const getMousePosition = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);
    return { x, y };
  };

  const startDrawing = (event) => {
    const { x, y } = getMousePosition(event);
    setStartPosition({ x, y });
    setIsDrawing(true);

    if (drawingMode === 'freehand') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    }
  };

  const finishDrawing = (event) => {
    if (!isDrawing) return;

    const { x, y } = getMousePosition(event);
    const context = contextRef.current;
    context.strokeStyle = color;

    if (drawingMode === 'line') {

      context.beginPath();
      context.moveTo(startPosition.x, startPosition.y);
      context.lineTo(x, y);
      context.stroke();
    } else if (drawingMode === 'rectangle') {

      const width = x - startPosition.x;
      const height = y - startPosition.y;
      context.strokeRect(startPosition.x, startPosition.y, width, height);
    } else if (drawingMode === 'circle') {

      const radius = Math.sqrt((x - startPosition.x) ** 2 + (y - startPosition.y) ** 2);
      context.beginPath();
      context.arc(startPosition.x, startPosition.y, radius, 0, Math.PI * 2);
      context.stroke();
    }

    setIsDrawing(false);
  };

  const draw = (event) => {
    if (!isDrawing || drawingMode !== 'freehand') return;

    const { x, y } = getMousePosition(event);
    const context = contextRef.current;

    context.strokeStyle = isEraserActive ? 'white' : color;
    context.lineWidth = isEraserActive ? 20 : 5;
    context.lineTo(x, y);
    context.stroke();
  };

  const activateEraser = () => {
    setIsEraserActive(true);
    setDrawingMode('freehand'); 
  };

  const activateColor = (newColor) => {
    setIsEraserActive(false);
    setColor(newColor);
  };

  const changeMode = (mode) => {
    setDrawingMode(mode);
    setIsEraserActive(false);
  };

  return (
    <>
      <div style={{ display: 'flex', margin: '2px', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 'lighter' }}>Start Drawing!</h1>
        <button
          style={{ padding: '2px', margin: '5px', textAlign: 'center', width: '100px', height: '30px', backgroundColor: 'white', border: '1px solid black', borderRadius: '25px' }}
          onClick={reloadPage}
        >
          Clear Canvas
        </button>

        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', gap: '5px' }}>
          <button style={{ padding: '15px', backgroundColor: 'black' }} onClick={() => activateColor('black')}></button>
          <button style={{ padding: '15px', backgroundColor: 'red' }} onClick={() => activateColor('red')}></button>
          <button style={{ padding: '15px', backgroundColor: 'blue' }} onClick={() => activateColor('blue')}></button>
          <button style={{ padding: '15px', backgroundColor: 'green' }} onClick={() => activateColor('green')}></button>
          <button style={{ padding: '10px', marginLeft: '10px', backgroundColor: 'lightgray', border: '1px solid black', borderRadius: '5px', cursor: 'pointer' }} onClick={activateEraser}>Eraser</button>
          <input type='color' value={color} onChange={(e) => activateColor(e.target.value)} style={{ marginLeft: '10px', width: '40px', height: '40px', border: 'none', cursor: 'pointer' }} />
        </div>

        {/* Shape Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
          <button onClick={() => changeMode('freehand')}>Freehand</button>
          <button onClick={() => changeMode('line')}>Line</button>
          <button onClick={() => changeMode('rectangle')}>Rectangle</button>
          <button onClick={() => changeMode('circle')}>Circle</button>
        </div>
      </div>

      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        onMouseLeave={finishDrawing}
        style={{ border: "1px solid black" }}
      />
    </>
  );
}

export default App;
