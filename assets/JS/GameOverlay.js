let score = 0, missed = 0 ;
var gameName = "game";
var resting = ["birdie_batcher","bubblePop","colorHopper","colorPop","commander_chaos","dino_dance","emoji_match","emojiParty","monsterMunch","orb","pattern_path","planetPainter","simon_party","starCatcher","stompParty","unicycle_balance","zenGarden"];

function setGameName(name){
    gameName = name;
    // Fallback to 0 if the item doesn't exist yet
    score = Number(localStorage.getItem(gameName + 'Wins')) || 0;
    missed = Number(localStorage.getItem(gameName + 'Losses')) || 0;
}

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
function gradeMessage(grade){
    if(grade>90){
        return "That's an A. Amazing job!!";
    }
    else if(grade>80){
        return "That's a B. You did well.";
    }
    else if(grade>70){
        return "That's a C. Maybe try again and you'll do better next time.";
    }
    else if(grade>60){
        return "That's a D, for disappointment. Try again, and do better.";
    }
    else{
        return "F...ummm. Do it again until you're not embarrassing me.";
    }
}
function gradeScore(){
    var grade = (score/(score+missed))*100;
    var g = grade.toFixed(2);
    document.getElementById("gradeMsg").innerText = "Grade: "+ g +" % "+gradeMessage(g);
    return g ;
}

function showScore(){
    if(score===null){
        score = 0;
    }
    if(missed===null){
        missed = 0;
    }
    document.getElementById("scoreboard").innerText = "score: "+ score +"   missed: "+missed;
}
function randomGame(){
    return resting[Math.floor(Math.random() * resting.length)];
}
function correct(){
    score++;
    localStorage.setItem(gameName+'Wins', score);
    if (score!=0 && score%10 === 0 && score!=100) {
        launchGame("../restingGames/"+randomGame()+".html");
    }
    else if (score === 100) {
        document.getElementById("certName").innerText = prompt("100 WINS! Enter name for certificate:");
        gradeScore();
        localStorage.setItem(gameName+'Wins', 0);
        localStorage.setItem(gameName+'Losses', 0);
        window.print();
    }
}

function wrong(){
    missed++;
    localStorage.setItem(gameName+'Losses', missed);
}

// To start the game, you'd call:
// launchGame('tenframe_game.html');