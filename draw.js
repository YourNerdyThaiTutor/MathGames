// Update JS to use these new specific IDs
    const gDrawCanvas = document.getElementById('gemini-draw-canvas');
    const gCtx = gDrawCanvas.getContext('2d');
    const gSizeSlider = document.getElementById('gemini-draw-sizeSlider');
    const gSizeLabel = document.getElementById('gemini-draw-sizeValue');
    const gColorPicker = document.getElementById('gemini-draw-colorPicker');
    const gMenu = document.getElementById('gemini-draw-controls');
    
    let gDrawing = false;
    let gIsEnabled = false; // Start OFF so you can browse the page first
    let gIsEraser = false;

    function gResize() {
        gDrawCanvas.width = window.innerWidth;
        gDrawCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', gResize);
    gResize();

    // Menu logic
    document.getElementById('gemini-draw-menuToggle').onclick = () => gMenu.classList.toggle('gemini-draw-hidden');

    document.getElementById('gemini-draw-toggleBtn').onclick = (e) => {
        gIsEnabled = !gIsEnabled;
        e.target.textContent = gIsEnabled ? 'Mode: Drawing' : 'Mode: Off';
        e.target.classList.toggle('gemini-draw-active');
        gDrawCanvas.classList.toggle('gemini-draw-active-mode');
    };

    document.getElementById('gemini-draw-eraserBtn').onclick = (e) => {
        gIsEraser = !gIsEraser;
        e.target.textContent = gIsEraser ? '🧽 Eraser: ON' : '🧽 Eraser: OFF';
        e.target.classList.toggle('gemini-draw-active');
    };

    document.getElementById('gemini-draw-clearBtn').onclick = () => {
        if(confirm("Clear drawing?")) gCtx.clearRect(0, 0, gDrawCanvas.width, gDrawCanvas.height);
    };

    gSizeSlider.oninput = () => gSizeLabel.textContent = gSizeSlider.value;

    // Drawing functionality
    function gStart(e) { if (gIsEnabled) { gDrawing = true; gDraw(e); } }
    function gStop() { gDrawing = false; gCtx.beginPath(); }

    function gDraw(e) {
        if (!gDrawing || !gIsEnabled) return;

        const baseSize = parseInt(gSizeSlider.value);
        const isWacomEraser = e.pointerType === 'pen' && (e.buttons === 32);

        if (gIsEraser || isWacomEraser) {
            gCtx.globalCompositeOperation = 'destination-out';
            gCtx.lineWidth = baseSize * 2;
        } else {
            gCtx.globalCompositeOperation = 'source-over';
            gCtx.strokeStyle = gColorPicker.value;
            gCtx.lineWidth = e.pressure > 0 ? e.pressure * (baseSize * 2) : baseSize;
        }

        gCtx.lineCap = 'round';
        gCtx.lineJoin = 'round';
        gCtx.lineTo(e.clientX, e.clientY);
        gCtx.stroke();
        gCtx.beginPath();
        gCtx.moveTo(e.clientX, e.clientY);
    }

    gDrawCanvas.addEventListener('pointerdown', gStart);
    gDrawCanvas.addEventListener('pointermove', gDraw);
    gDrawCanvas.addEventListener('pointerup', gStop);
    gDrawCanvas.addEventListener('pointerout', gStop);