(function(){
'use strict';

// Audio
var runSound = new Audio("forest/audio/run.mp3"); runSound.loop = true;
var jumSound = new Audio("forest/audio/jump.mp3");
var deadSound = new Audio("forest/audio/dead.mp3");

// Elements
var boy = document.getElementById("boy");
var background = document.getElementById("background");
var scoreElem = document.getElementById("score");
var endScreen = document.getElementById("end");
var endScoreElem = document.getElementById("endScore");

// Interval IDs
var idleIntervalId=0, runIntervalId=0, jumpIntervalId=0, moveBackgroundIntervalId=0, boxIntervalId=0, deadIntervalId=0;

// Counters
var idleImageNumber=1, runImageNumber=1, jumpImageNumber=1, deadImageNumber=1;

// Layout
var boyMarginTop=300, backgroundPositionX=0, score=0;
var boxesCount=8, boyX=50;

// --- Idle animation ---
function idleAnimation(){
    idleImageNumber++; if(idleImageNumber>10) idleImageNumber=1;
    boy.src = "forest/images/idle_"+idleImageNumber+".png";
}
function idleAnimationStart(){ clearInterval(idleIntervalId); idleIntervalId=setInterval(idleAnimation,200); }

// --- Run animation ---
function runAnimation(){
    runImageNumber++; if(runImageNumber>10) runImageNumber=1;
    boy.src = "forest/images/run_"+runImageNumber+".png";
}
function runAnimationStart(){
    if(runIntervalId) return;
    runIntervalId=setInterval(runAnimation,100);
    clearInterval(idleIntervalId);
    try{ runSound.play(); }catch(e){}
}

// --- Jump animation ---
function jumpAnimation(){
    jumpImageNumber++;
    if(jumpImageNumber<=6) boyMarginTop-=40; else boyMarginTop+=40;
    boy.style.marginTop = boyMarginTop+"px";

    if(jumpImageNumber>10){
        jumpImageNumber=1; clearInterval(jumpIntervalId); jumpIntervalId=0; runImageNumber=0; runAnimationStart();
    }
    boy.src="forest/images/jump_"+jumpImageNumber+".png";
}
function jumpAnimationStart(){
    if(jumpIntervalId) return;
    clearInterval(idleIntervalId); clearInterval(runIntervalId); runIntervalId=0;
    try{ runSound.pause(); }catch(e){}
    jumpIntervalId=setInterval(jumpAnimation,100);
    try{ jumSound.play(); }catch(e){}
}

// --- Background movement ---
function moveBackground(){ backgroundPositionX-=25; background.style.backgroundPositionX=backgroundPositionX+"px"; score++; scoreElem.innerHTML=score; }

// --- Boxes creation ---
function createBoxes(){
    document.querySelectorAll(".box").forEach(e=>e.remove());
    var boxMarginLeft=1400;
    for(let i=0;i<boxesCount;i++){
        var box=document.createElement("div"); box.className="box"; box.id="box"+i; box.style.marginLeft=boxMarginLeft+"px";
        background.appendChild(box);
        boxMarginLeft += Math.floor(Math.random()*600+600);
    }
}

// --- Box animation ---
function boxAnimation(){
    var boxes = document.querySelectorAll(".box");
    var maxRight = Math.max(...Array.from(boxes).map(b=>parseInt(getComputedStyle(b).marginLeft)));
    for(let box of boxes){
        let newLeft=parseInt(getComputedStyle(box).marginLeft)-25;
        box.style.marginLeft=newLeft+"px";

        if(newLeft<-200){ box.style.marginLeft=maxRight+Math.floor(Math.random()*600+600)+"px"; maxRight=parseInt(box.style.marginLeft); }

        if(newLeft<=boyX+50 && newLeft+50>=boyX){ if(boyMarginTop>=300) stopGameAndPlayDead(); }
    }
}

// --- Dead / Stop ---
function stopGameAndPlayDead(){
    clearInterval(boxIntervalId); boxIntervalId=0;
    clearInterval(runIntervalId); runIntervalId=0; try{runSound.pause();}catch(e){}
    clearInterval(jumpIntervalId); jumpIntervalId=0;
    clearInterval(moveBackgroundIntervalId); moveBackgroundIntervalId=0;

    clearInterval(deadIntervalId); deadImageNumber=1;
    deadIntervalId=setInterval(boyDeadAnimation,100);
    try{ deadSound.play(); }catch(e){}
}

function boyDeadAnimation(){
    deadImageNumber++;
    if(deadImageNumber>=11){ deadImageNumber=10; endScreen.style.visibility="visible"; endScoreElem.innerHTML=score; clearInterval(deadIntervalId); return; }
    boy.src="forest/images/dead_"+deadImageNumber+".png";
}

// --- Key Controls ---
function keyCheck(event){
    var key = event.keyCode;
    if(key===13){ runAnimationStart(); if(!moveBackgroundIntervalId) moveBackgroundIntervalId=setInterval(moveBackground,100); if(!boxIntervalId) boxIntervalId=setInterval(boxAnimation,100); }
    if(key===32){ jumpAnimationStart(); if(!moveBackgroundIntervalId) moveBackgroundIntervalId=setInterval(moveBackground,100); if(!boxIntervalId) boxIntervalId=setInterval(boxAnimation,100); event.preventDefault(); }
}

// --- Start Game ---
function startGame(){
    var startScreen=document.getElementById("startScreen"); if(startScreen) startScreen.style.display="none";
    runAnimationStart();
    if(!moveBackgroundIntervalId) moveBackgroundIntervalId=setInterval(moveBackground,100);
    if(!boxIntervalId) boxIntervalId=setInterval(boxAnimation,100);
}

// --- Initialize ---
window.addEventListener("load", function(){
    boy.style.marginTop=boyMarginTop+"px"; scoreElem.innerHTML=0; createBoxes(); idleAnimationStart();
    document.addEventListener("keydown", keyCheck);
});

window.startGame=startGame;
window.reload=()=>location.reload();

})();
