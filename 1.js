(function () {
    'use strict';

    // Audio
    var runSound = new Audio("audio/run.mp3"); runSound.loop = true;
    var jumSound = new Audio("audio/jump.mp3");
    var deadSound = new Audio("audio/dead.mp3");

    var boy = document.getElementById("boy");
    var background = document.getElementById("background");
    var scoreElem = document.getElementById("score");
    var endScreen = document.getElementById("end");
    var endScoreElem = document.getElementById("endScore");

    var idleIntervalId=0, runIntervalId=0, jumpIntervalId=0, moveBackgroundIntervalId=0, boxIntervalId=0, deadIntervalId=0;
    var idleImageNumber=1, runImageNumber=1, jumpImageNumber=1, deadImageNumber=1;
    var boyMarginTop=355, backgroundPositionX=0, score=0;
    var boxesCount=8, boyX=50;

    function idleAnimation(){
        idleImageNumber++; if(idleImageNumber>10) idleImageNumber=1;
        boy.src = "https://github.com/KavinduChathuranga2006/drago-run-2d-game/blob/main/images/idle_" + idleImageNumber + ".png";
    }
    function idleAnimationStart(){ clearInterval(idleIntervalId); idleIntervalId=setInterval(idleAnimation,200); }

    function runAnimation(){
        runImageNumber++; if(runImageNumber>10) runImageNumber=1;
        boy.src = "images/run_" + runImageNumber + ".png";
    }
    function runAnimationStart(){
        if(runIntervalId) return;
        runIntervalId=setInterval(runAnimation,100);
        clearInterval(idleIntervalId);
        try{ runSound.play(); }catch(e){}
    }

    function jumpAnimation(){
        jumpImageNumber++;
        if(jumpImageNumber<=6){ boyMarginTop-=40; }else{ boyMarginTop+=40; }
        boy.style.marginTop = boyMarginTop + "px";

        if(jumpImageNumber>10){
            jumpImageNumber=1;
            clearInterval(jumpIntervalId);
            jumpIntervalId=0;
            runImageNumber=0;
            runAnimationStart();
        }
        boy.src = "images/jump_" + jumpImageNumber + ".png";
    }
    function jumpAnimationStart(){
        if(jumpIntervalId) return;
        clearInterval(idleIntervalId);
        clearInterval(runIntervalId); runIntervalId=0;
        try{ runSound.pause(); }catch(e){}
        jumpIntervalId=setInterval(jumpAnimation,100);
        try{ jumSound.play(); }catch(e){}
    }

    function moveBackground(){
        backgroundPositionX-=25;
        background.style.backgroundPositionX = backgroundPositionX + "px";
        score++; scoreElem.innerHTML = score;
    }

    function createBoxes(){
        var boxMarginLeft = 1400;
        for(var i=0;i<boxesCount;i++){
            var box=document.createElement("div");
            box.className="box"; box.id="box"+i;
            box.style.marginLeft = boxMarginLeft + "px";
            background.appendChild(box);
            boxMarginLeft += Math.floor(Math.random()*600+600);
        }
    }

    function boxAnimation(){
        var boxes = document.querySelectorAll(".box");
        for(var i=0;i<boxes.length;i++){
            var box=boxes[i];
            var boxMarginLeft = parseInt(getComputedStyle(box).marginLeft);
            boxMarginLeft-=25; box.style.marginLeft=boxMarginLeft+"px";

            if(boxMarginLeft<-200){
                var maxRight=Math.max(...Array.from(boxes).map(b=>parseInt(getComputedStyle(b).marginLeft)));
                boxMarginLeft = maxRight + Math.floor(Math.random()*600+600);
                box.style.marginLeft = boxMarginLeft + "px";
            }

            var boyTop=boyMarginTop;
            if(boxMarginLeft<=boyX+50 && boxMarginLeft+50>=boyX){
                if(boyTop>=300){ stopGameAndPlayDead(); }
            }
        }
    }

    function stopGameAndPlayDead(){
        clearInterval(boxIntervalId); clearInterval(runIntervalId);
        clearInterval(jumpIntervalId); clearInterval(moveBackgroundIntervalId);
        try{ runSound.pause(); }catch(e){}

        deadImageNumber=1; deadIntervalId=setInterval(boyDeadAnimation,100);
        try{ deadSound.play(); }catch(e){}
    }
    function boyDeadAnimation(){
        deadImageNumber++;
        if(deadImageNumber>=11){ deadImageNumber=10; endScreen.style.visibility="visible"; endScoreElem.innerHTML=score; clearInterval(deadIntervalId);}
        boy.src="images/dead_"+deadImageNumber+".png";
    }

    function keyCheck(event){
        var key = event.which||event.keyCode;
        if(key===13) startGame();
        if(key===32){
            if(!jumpIntervalId) jumpAnimationStart();
            if(!moveBackgroundIntervalId) moveBackgroundIntervalId=setInterval(moveBackground,100);
            if(!boxIntervalId) boxIntervalId=setInterval(boxAnimation,100);
            event.preventDefault();
        }
    }

    function startGame(){
        document.getElementById("startScreen").style.visibility="hidden";
        idleAnimationStart();
        runAnimationStart();
        moveBackgroundIntervalId=setInterval(moveBackground,100);
        boxIntervalId=setInterval(boxAnimation,100);
        try{ runSound.play(); }catch(e){}
    }

    function reload(){ location.reload(); }

    window.addEventListener("load", function(){
        boy.style.marginTop = boyMarginTop+"px";
        score=0; scoreElem.innerHTML=score;
        createBoxes(); idleAnimationStart();
        document.addEventListener("keydown", keyCheck);
    });

    window.startGame=startGame;
    window.reload=reload;

})();
