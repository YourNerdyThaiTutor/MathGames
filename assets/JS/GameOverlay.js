function launchGame(gameUrl) {
    // 1. Create the overlay
    const overlay = document.createElement('div');
    overlay.id = 'gameOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: white; z-index: 10000; border: none;
    `;

    // 2. Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = gameUrl;
    iframe.style.cssText = `width: 100%; height: 100%; border: none;`;

    // 3. Prevent the background page from scrolling
    document.body.style.overflow = 'hidden';

    // 4. The "Listener" function
    const handleGameMessage = (event) => {
        if (event.data === 'closeIframe') {
            // Remove the overlay
            document.body.removeChild(overlay);
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
            // Stop listening (cleanup)
            window.removeEventListener('message', handleGameMessage);
            
            console.log("The game was finished and closed!");
        }
    };

    // 5. Start listening and add to page
    window.addEventListener('message', handleGameMessage);
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
}

// To start the game, you'd call:
// launchGame('tenframe_game.html');