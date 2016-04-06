(function(){
    var w = 800, h = 600;
    var phase;
    var turn;
    var player;
    var player_name = [];
    var player_cost = [];
    var player_hand1 = [];
    var player_hand2 = [];
    var player_lost1 = [];
    var player_lost2 = [];
    var playerAI = [];
    var deck = [];
    var card_name = ["公爵","刺客","女伯","大使","船長"];
    var act_name = ["収入","援助","クー","徴税","暗殺","交換","強奪"];
    var on_mouse;

    var char = new Image();

    var title_c;
    var wait = [];

    var requestId;
    var canvas = document.getElementById('canvas');
    canvas.addEventListener("click", onClick, false);
    canvas.addEventListener('mousemove', onMove, false);
    var ctx = canvas.getContext('2d');
	
    init();
	requestId = window.requestAnimationFrame(renderTitle); 

	function init(){
		tc();
		turn = 0;
		phase = 0;
		player = 3;
		on_mouse = -1;
		for(var i = 0; i<100; i++)
			wait[i] = 0;
	}

	function tc(){
		var r = (Math.floor(Math.random()*10)).toString(16);
		var g = (Math.floor(Math.random()*10)).toString(16);
		var b = (Math.floor(Math.random()*10)).toString(16);
		title_c = '#'+r+g+b;
	}

	function setInitDeck(){
		for(var i = 0; i<5; i++){
			deck[i*3] = i;
			deck[i*3+1] = i;
			deck[i*3+2] = i;
		}
		var setdeck = [];
		for(var i in deck)
			setdeck[i] = -1;
		var cnt = 0;
		var rnd;
		while(true){
			if(cnt>14)break;
			rnd = Math.floor(Math.random()*15);
			if(setdeck[rnd]==-1){
				setdeck[rnd] = deck[cnt];
				deck[cnt] = -1;
				cnt++;
			}
		}
		for(var i in deck)
			deck[i] = setdeck[i];
	}

	function setPlayerInfo(){
		for(var i = 0; i<player+1; i++){
			player_cost[i] = 2;
			player_hand1[i] = deck[i*2];
			player_hand2[i] = deck[i*2+1];
			player_lost1[i] = false;
			player_lost2[i] = false;
		}
	}

	function setAI(){

	}
/*
	function bg(c){
		ctx.fillStyle = c;
		ctx.fillRect(0,0,w,h);
	}
*/
	function bg(c){
		var grad  = ctx.createLinearGradient(h,0,0,w);
		grad.addColorStop(0,'#ccc');
		grad.addColorStop(0.7,c);
		ctx.fillStyle = grad;
		ctx.fillRect(0,0,w,h);
	}

	function renderTitle(){
		var grad  = ctx.createLinearGradient(h,0,0,w);
		grad.addColorStop(0,'#fff');
		grad.addColorStop(0.7,title_c);
		ctx.fillStyle = grad;
		ctx.fillRect(0,0,w,h);

		var a = wait[0]/100;
		var t = ["C","o","u","p"];
		var s = [w-770,w-570,w-390,w-210];
		ctx.font= 'bold 280px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 20;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		for(var i in t){
			a = (wait[0]+i*5)/100;
			if(a>1)a=1;
			var asin = (1-a)*Math.abs(Math.sin(Math.PI*2*a));
			ctx.strokeText(t[i],s[i],380*(1-asin),650);
			ctx.fillText(t[i],s[i],380*(1-asin));
		}

		if(a>0.9){
			ctx.globalAlpha = 10*(a-0.9);
		}else{
			ctx.globalAlpha = 0;
		}
		var str = "- start -";
		var margin = w - 20*str.length;
		ctx.font= 'bold 40px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		ctx.strokeText(str,margin/2,500,510);
		ctx.fillText(str,margin/2,500);
		ctx.globalAlpha = 1.0;

		if(on_mouse!=-1 && wait[0]==100){
			if(wait[1]<20)wait[1]+=2;
			var wa = wait[1]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(w/2*(1-wa),450,w*wa,70);
			ctx.globalAlpha = 1.0;
		}else{
			if(wait[1]>0)wait[1]-=2;
		}

		if(wait[0]<100)
			wait[0]+=2;

		requestId = window.requestAnimationFrame(renderTitle);
	}

	function renderMain(){
		bg('#4a4');
		//side bar
		ctx.fillStyle = '#afa';
		ctx.fillRect(600,0,200,h);

		//play button
		ctx.fillStyle = '#5a5';
		ctx.fillRect(610,530,180,60);
		
		//player sum button
		ctx.fillStyle = '#5a5';
		ctx.fillRect(620,310,160,50);
		ctx.fillRect(620,380,160,50);
		ctx.fillRect(620,450,160,50);

		//detail
		ctx.fillStyle = '#5a5';
		ctx.fillRect(610,10,180,280);

		ctx.fillStyle = '#afa';
		for(var i = 0; i<3; i++){
			if(i<player+1){
				ctx.fillRect(30+i*190,80,160,220);
				ctx.fillRect(30+i*190,80,160,220);
			}
			if(i+3<player+1){
				ctx.fillRect(30+i*190,330,160,220);
				ctx.fillRect(30+i*190,330,160,220);
			}
		}

		var str = "PLAY";
		ctx.font= 'bold 40px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		ctx.strokeText(str,645,575,510);
		ctx.fillText(str,645,575);
		ctx.font= 'bold 30px Meiryo';
		str = "player : "+(player+1);
		ctx.strokeText(str,20,40,510);
		ctx.fillText(str,20,40);

		ctx.font= 'bold 20px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.fillStyle = '#fff';
		str = "SHUFFLE";
		ctx.strokeText(str,655,342,510);
		ctx.fillText(str,655,342);
		str = "PLAYER +";
		ctx.strokeText(str,655,412,510);
		ctx.fillText(str,655,412);
		str = "PLAYER -";
		ctx.strokeText(str,655,482,510);
		ctx.fillText(str,655,482);

		//on_mouse
		if(on_mouse==0){
			if(wait[2]<20)wait[2]+=2;
			var wa = wait[2]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(700-90*wa,530,180*wa,60);
		}else if(on_mouse==1){
			if(wait[3]<20)wait[3]+=2;
			var wa = wait[3]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(700-80*wa,380,160*wa,50);
		}else if(on_mouse==2){
			if(wait[4]<20)wait[4]+=2;
			var wa = wait[4]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(700-80*wa,450,160*wa,50);
		}else{
			if(wait[2]>0)wait[2]-=2;
			if(wait[3]>0)wait[3]-=2;
			if(wait[4]>0)wait[4]-=2;
		}
		ctx.globalAlpha = 1.0;

		requestId = window.requestAnimationFrame(renderMain);
	}

	function renderPlay(){
		bg('#4a4');
		//side bar
		ctx.fillStyle = '#afa';
		ctx.fillRect(600,0,200,h);

		//play button
		ctx.fillStyle = '#5a5';
		ctx.fillRect(610,530,180,60);

		//detail
		ctx.fillStyle = '#5a5';
		ctx.fillRect(610,10,180,280);

		//action board
		ctx.fillStyle = '#255';
		ctx.fillRect(0,480,600,120);

		//action
		ctx.font= 'bold 20px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		var ox = 0, oy = 0;
		for(var i in act_name){
			if(i==on_mouse){
				ox = 1;
				oy = 1;
			}else{
				ox = 0;
				oy = 0;
			}
			ctx.fillStyle = '#aee';
			ctx.fillRect(5+85*i-ox,485-oy,80,110);

			ctx.fillStyle = '#fff';
			ctx.strokeText(act_name[i],12+85*i-ox,510-oy,510);
			ctx.fillText(act_name[i],12+85*i-ox,510-oy);
		}

		//deck
		ctx.fillStyle = '#255';
		ctx.fillRect(265,190,70,100);

		//play board
		ctx.fillStyle = '#255';
		ctx.fillRect(215,360,80,110);
		ctx.fillRect(305,360,80,110);
		//upper opponent
		if(player==1 || player==3 || player==5){
			ctx.fillRect(235,20,60,90);
			ctx.fillRect(305,20,60,90);
		}
		//lr center
		if(player==3){
			ctx.fillRect(20,195,60,90);
			ctx.fillRect(90,195,60,90);

			ctx.fillRect(450,195,60,90);
			ctx.fillRect(520,195,60,90);
		}
		//lr upper
		if(player==2 || player==4 || player==5){
			ctx.fillRect(20,115,60,90);
			ctx.fillRect(90,115,60,90);

			ctx.fillRect(450,115,60,90);
			ctx.fillRect(520,115,60,90);
		}
		//lr lower
		if(player==4 || player==5){
			ctx.fillRect(20,275,60,90);
			ctx.fillRect(90,275,60,90);

			ctx.fillRect(450,275,60,90);
			ctx.fillRect(520,275,60,90);
		}

		var str = "QUIT";
		ctx.font= 'bold 40px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		ctx.strokeText(str,645,575,510);
		ctx.fillText(str,645,575);

		var t = [card_name[player_hand1[0]],card_name[player_hand2[0]]];
		ctx.font= 'bold 20px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		ctx.strokeText(t[0],225,385,510);
		ctx.fillText(t[0],225,385);
		ctx.strokeText(t[1],315,385,510);
		ctx.fillText(t[1],315,385);

		//on_mouse
		ctx.fillStyle = '#00f';
		ctx.globalAlpha = 0.3;
		if(on_mouse==10){
			ctx.fillRect(610,530,180,60);
		}
		ctx.globalAlpha = 1.0;

		requestId = window.requestAnimationFrame(renderPlay);
	}

	function playAction(){

	}

	function hit(x,y,sx,sy,ex,ey){
		var v = false;
		if(sx<x && x<ex && sy<y && y<ey)
			v = true;
		return v;
	}

	function onClick(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		console.log("click "+x+" "+y);

		if(hit(x,y,0,0,20,20)){
			setInitDeck();
			setPlayerInfo();
		}

		if(phase==0){
			if(on_mouse == 0){
				phase = 1;
				window.cancelAnimationFrame(requestId);
				requestId = window.requestAnimationFrame(renderMain); 
			}
		}else if(phase==1){
			if(on_mouse==0){
				phase = 2;
				setInitDeck();
				setPlayerInfo();
				window.cancelAnimationFrame(requestId);
				requestId = window.requestAnimationFrame(renderPlay); 
			}else if(on_mouse==1){
				if(player<5)player++;
			}else if(on_mouse==2){
				if(player>1)player--;
			}
		}else if(phase==2){
			if(hit(x,y,610,530,790,590)){
				phase = 1;
				window.cancelAnimationFrame(requestId);
				requestId = window.requestAnimationFrame(renderMain); 
			}
		}

	}

	function onMove(e){
		var rect = e.target.getBoundingClientRect();
		var x =  Math.round(e.clientX - rect.left);
		var y =  Math.round(e.clientY - rect.top);
		//console.log(x+" "+y);

		if(phase==0){
			if(hit(x,y,300,450,500,520)){
				on_mouse = 0;
			}else if(!hit(x,y,0,450,w,520)){
				on_mouse = -1;
			}
		}else if(phase==1){
			if(hit(x,y,610,530,790,590)){
				on_mouse = 0;
			}else if(hit(x,y,620,380,780,430)){
				on_mouse = 1;
			}else if(hit(x,y,620,450,780,500)){
				on_mouse = 2;
			}else{
				on_mouse = -1;
			}
		}else if(phase==2){
			if(hit(x,y,610,530,790,590)){
				on_mouse = 10;
			}else{
				on_mouse = -1;
			}
			for(var i in act_name){
				if(hit(x,y,5+i*85,485,80+i*85,595))
					on_mouse = i;
			}
		}
	}	
})();