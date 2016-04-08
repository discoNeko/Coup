(function(){
    var w = 800, h = 600;
    var phase;
    var turn;
    var cturn = [];
    var bturn = [];
    var str_act = [];
    var str_c = [];
    var str_b = [];
    var tp_act;
    var tp_tar;
    var target_card;
    var player_turn;
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
    var act_name = ["収入","援助","徴税","クー","暗殺","交換","強奪"];
    var act_choose;
    var select_discard;
    var on_mouse;
    var ds = [[],
    		  [3],
    		  [2,4],
    		  [1,3,5],
    		  [0,2,4,6],
    		  [0,2,3,4,6]];

    var char = new Image();

    var title_c;
    var wait = [];
    var pwait = [];
    var ppos = [];
    var pstr =[];

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
		player_turn = 0;
		phase = 0;
		player = 3;
		act_choose　= -1;
		select_discard = false;
		on_mouse = -1;
		for(var i = 0; i<100; i++){
			wait[i] = 0;
			pwait[i] = 0;
			ppos[i] = 0;
			pstr[i] = "";
		}
	}

	function reset(){
		turn = 0;
		act_choose　= -1;
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
		cturn.length = 0;
		bturn.length = 0;
		str_act.length = 0;
		str_c.length = 0;
		str_b.length = 0;
		player_name.length = 0;
		player_cost.length = 0;
		player_hand1.length = 0;
		player_hand2.length = 0;
		player_lost1.length = 0;
		player_lost2.length = 0;
		for(var i = 0; i<player+1; i++){
			cturn[i] = false;
			bturn[i] = false;
			str_act[i] = "";
			str_c[i] = "";
			str_b[i] = "";
			player_name[i] = "player"+i;
			player_cost[i] = 2;
			player_hand1[i] = deck[i*2];
			player_hand2[i] = deck[i*2+1];
			console.log(i+" "+card_name[player_hand1[i]]+" "+card_name[player_hand2[i]]);
			player_lost1[i] = false;
			player_lost2[i] = false;
		}
	}

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

		if(true){
			var a = wait[0];
			ctx.fillStyle = title_c;
			ctx.fillRect(-1500+a*25,20,1200,10);
			ctx.fillRect(770,1000-a*25,10,1200);

			//ctx.fillStyle = '#999';
			ctx.fillRect(20,-1500+a*25,10,1200);
			ctx.fillRect(1000-a*25,570,1200,10);
		}

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

		if(true){
			var wa = wait[0]/100;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(w/2*(1-wa),460,w*wa,50);
			ctx.globalAlpha = 1.0;
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
		}else{
			if(wait[1]>0)wait[1]-=2;
		}
		{
			var wa = wait[1]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(w/2*(1-wa),450,w*wa,70);
			ctx.globalAlpha = 1.0;
		}

		if(wait[0]<100)
			wait[0]+=2;

		requestId = window.requestAnimationFrame(renderTitle);
	}

	function renderTitleFade(){
		var grad  = ctx.createLinearGradient(h,0,0,w);
		grad.addColorStop(0,'#fff');
		grad.addColorStop(0.7,title_c);
		ctx.fillStyle = grad;
		ctx.fillRect(0,0,w,h);

		if(true){
			var a = wait[0];
			ctx.fillStyle = title_c;
			ctx.fillRect(-1500+a*25,20,1200,10);
			ctx.fillRect(770,1000-a*25,10,1200);

			//ctx.fillStyle = '#999';
			ctx.fillRect(20,-1500+a*25,10,1200);
			ctx.fillRect(1000-a*25,570,1200,10);
		}

		var a = wait[0]/100;
		var t = ["C","o","u","p"];
		var s = [w-770,w-570,w-390,w-210];
		ctx.font= 'bold 280px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 20;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		for(var i in t){
			var ho = 0;
			a = (wait[0]+i*5)/100;
			if(wait[0]<0){
				a = i*5/100;
				ho = wait[0];
			}
			if(a>1)a=1;
			var asin = (1-a)*Math.abs(Math.sin(Math.PI*2*a));
			ctx.strokeText(t[i],s[i],380*(1-asin)+ho*ho,650);
			ctx.fillText(t[i],s[i],380*(1-asin)+ho*ho);
		}

		if(true){
			var wa = wait[0]/100;
			if(wait[0]<0)wa = 0;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(w/2*(1-wa),460,w*wa,50);
			ctx.globalAlpha = 1.0;
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

		
		if(wait[1]>0)wait[1]-=2;
		{
			var wa = wait[1]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(w/2*(1-wa),450,w*wa,70);
			ctx.globalAlpha = 1.0;
		}

		if(wait[0]>-100)
			wait[0]+=-2;
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
			if(wait[3]>0)wait[3]-=2;
			if(wait[4]>0)wait[4]-=2;
		}else if(on_mouse==1){
			if(wait[3]<20)wait[3]+=2;
			if(wait[2]>0)wait[2]-=2;
			if(wait[4]>0)wait[4]-=2;
		}else if(on_mouse==2){
			if(wait[4]<20)wait[4]+=2;
			if(wait[2]>0)wait[2]-=2;
			if(wait[3]>0)wait[3]-=2;
		}else{
			if(wait[2]>0)wait[2]-=2;
			if(wait[3]>0)wait[3]-=2;
			if(wait[4]>0)wait[4]-=2;
		}
		{
			var wa = wait[2]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(700-90*wa,530,180*wa,60);

			wa = wait[3]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(700-80*wa,380,160*wa,50);

			wa = wait[4]/20;
			ctx.fillStyle = '#00f';
			ctx.globalAlpha = 0.3*wa;
			ctx.fillRect(700-80*wa,450,160*wa,50);
		}
		ctx.globalAlpha = 1.0;

		if(wait[0]>-100){
			if(wait[0]<0)ctx.globalAlpha = (100 + wait[0])/100;
	 		renderTitleFade();
			ctx.globalAlpha = 1.0;
		}
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
		if(phase==6 && act_choose==5){
			ctx.fillStyle = '#aee';
			ctx.fillRect(225,220,70,100);
			ctx.fillRect(305,220,70,100);
		}

		//play board
		ctx.fillStyle = '#255';
		ctx.fillRect(215,360,80,110);
		ctx.fillRect(305,360,80,110);
		ctx.fillRect(395,420,115,50);

		//upper opponent
		if(player==1 || player==3 || player==5){
			ctx.fillRect(235,30,60,90);
			ctx.fillRect(305,30,60,90);
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
			ctx.fillRect(20,105,60,90);
			ctx.fillRect(90,105,60,90);

			ctx.fillRect(450,105,60,90);
			ctx.fillRect(520,105,60,90);
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

		//my info
		var t = [card_name[player_hand1[0]],card_name[player_hand2[0]]];
		ctx.font= 'bold 20px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		ctx.strokeText(t[0],235,385,510);
		ctx.fillText(t[0],235,385);
		ctx.strokeText(t[1],325,385,510);
		ctx.fillText(t[1],325,385);
		ctx.strokeText(player_name[0],265,350,510);
		ctx.fillText(player_name[0],265,350);
		for(var i = 0; i<player_cost[0]; i++)
			ctx.fillRect(405+15*(i%6),430+15*Math.floor(i/6),10,10);
		if(player_lost1[0]){
			ctx.fillText("X",245,420);
		}
		if(player_lost2[0]){
			ctx.fillText("X",335,420);
		}

		//opponent info
		if(player==1){
			drawInfo(3,1);
		}else if(player==2){
			drawInfo(2,1);
			drawInfo(4,2);
		}else if(player==3){
			drawInfo(1,1);
			drawInfo(3,2);
			drawInfo(5,3);
		}else if(player==4){
			drawInfo(0,1);
			drawInfo(2,2);
			drawInfo(4,3);
			drawInfo(6,4);
		}else if(player==5){
			drawInfo(0,1);
			drawInfo(2,2);
			drawInfo(3,3);
			drawInfo(4,4);
			drawInfo(6,5);
		}

		if(act_choose!=-1){
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = '#a55';
			ctx.fillRect(5+act_choose*85,485,80,110);
			ctx.globalAlpha = 1.0;
		}

		//ポップアップメッセージの表示
		modWait();

		//on_mouse
		ctx.fillStyle = '#00f';
		ctx.globalAlpha = 0.3;
		if(on_mouse==10){
			ctx.fillRect(610,530,180,60);
		}
		if(act_choose==3 || act_choose==4 || act_choose==6){
			if(player==1){
				if(on_mouse==11)ctx.fillRect(235,0,140,100);

			}else if(player==2){
				if(on_mouse==11)ctx.fillRect(20,110,140,100);
				if(on_mouse==12)ctx.fillRect(450,110,140,100);

			}else if(player==3){
				if(on_mouse==11)ctx.fillRect(20,200,140,100);
				if(on_mouse==12)ctx.fillRect(235,0,140,100);
				if(on_mouse==13)ctx.fillRect(450,200,140,100);

			}else if(player==4){
				if(on_mouse==11)ctx.fillRect(20,280,140,100);
				if(on_mouse==12)ctx.fillRect(20,110,140,100);
				if(on_mouse==13)ctx.fillRect(450,110,140,100);
				if(on_mouse==14)ctx.fillRect(450,280,140,100);

			}else if(player==5){
				if(on_mouse==11)ctx.fillRect(20,280,140,100);
				if(on_mouse==12)ctx.fillRect(20,110,140,100);
				if(on_mouse==13)ctx.fillRect(235,0,140,100);
				if(on_mouse==14)ctx.fillRect(450,110,140,100);
				if(on_mouse==15)ctx.fillRect(450,280,140,100);
			}
		}
		ctx.globalAlpha = 1.0;

		//フレーム毎の処理
		calcTurn();
		
		//デバッグ表示
		if(true){
			ctx.fillStyle = '#fff';
			ctx.font= 'bold 18px Meiryo';
			ctx.lineWidth = 3;
			ctx.strokeText("turn "+turn,10,20,510);
			ctx.fillText("turn "+turn,10,20);
			ctx.strokeText("phase "+phase,10,40,510);
			ctx.fillText("phase "+phase,10,40);
			ctx.strokeText("act "+act_choose,10,60,510);
			ctx.fillText("act "+act_choose,10,60);
			ctx.strokeText("pwait[0] "+pwait[0],10,80,510);
			ctx.fillText("pwait[0] "+pwait[0],10,80);
		}

		requestId = window.requestAnimationFrame(renderPlay);
	}

	function calcTurn(){
		//turn!=player_turnのとき
		//一定時間経過後にplayAction()を実行し処理を進める
		//if(turn!=player_turn){
		wait[99]+=50;
		if(wait[99]>100){
			wait[99] = 0;
			if(phase==2 && turn!=player_turn){
				if(!player_lost1[turn] || !player_lost2[turn]){
					var a = playAI(turn,0);
					console.log("turn"+turn+" act"+a.act+" tar"+a.target);
					tp_act = a.act;
					tp_tar = a.target;
					playAction(tp_act,turn,tp_tar);
				}else{
					wait[99] = 100;
					turn++;
					if(turn>player)turn=0;	
				}
			}else if(phase==3 || phase==5){
				var v = true;
				//ダウトチェック
				for(var i in cturn){
					if(!v)break;
					var j = (parseInt(i) + parseInt(turn))%(player+1);
					if(cturn[j]){
						if(!player_lost1[j] || !player_lost2[j]){
							if(j==player_turn)break;
							if(playAI(j,1)){
								for(var l in cturn){
									cturn[l] = false;
									bturn[l] = false;
								}
								cplayer = j;
								var tar = turn;
								if(phase==5)
									tar = bplayer;
								if(doubtCheck(tar)){
									discard(tar);
								}else{
									discard(cplayer);
								}
								phase = 4;
							}
						}else{
							wait[99] = 100;
						}
						cturn[j] = false;
						v = false;
					}
				}
				//全員ダウトパス && ブロック済み
				if(!v && phase==5){

				}
				//ブロックチェック
				for(var i in bturn){
					if(!v)break;
					var j = (parseInt(i) + parseInt(turn))%(player+1);
					if(bturn[j]){
						if(!player_lost1[j] || !player_lost2[j]){
							if(j==player_turn)break;
							if(playAI(j,2)){
								for(var l in bturn){
									cturn[l] = true;
									bturn[l] = false;
								}
								cturn[j] = false;
								bplayer = j;
								phase = 5;
							}
						}else{
							wait[99] = 100;
						}
						bturn[j] = false;
						v = false;
					}
				}
				if(v)calcAction(tp_act,turn,tp_tar);
			}else if(phase==4){
				phase = 2;
			}
		}
	}

	function modWait(){
		for(var i = 0; i<100; i++){
			if(pwait[i]>0){
				pwait[i]+=2;
				drawPop(ppos[i],pstr[i],pwait[i],i);
			}
			if(pwait[i]>200)pwait[i]=0;
		}
	}

	function drawInfo(pos,n){
		ctx.font= 'bold 20px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		var t = [card_name[player_hand1[n]],card_name[player_hand2[n]]];
		var x = 0,　y = 0;
		if(pos==0){//r lower
			x = 30;	y = 300;
		}else if(pos==1){//r center
			x = 30;	y = 220;
		}else if(pos==2){//r upper
			x = 30;	y = 130;
		}else if(pos==3){//center
			x = 245; y = 55;
		}else if(pos==4){//l upper
			x = 460; y = 130;
		}else if(pos==5){//l center
			x = 460; y = 220;
		}else if(pos==6){//l lower
			x = 460; y = 300;
		}
		if(player_lost1[n]){
			ctx.strokeText(t[0],x,y,510);
			ctx.fillText(t[0],x,y);
			ctx.fillText("X",x+10,y+30);
		}
		if(player_lost2[n]){
			ctx.strokeText(t[1],x+70,y,510);
			ctx.fillText(t[1],x+70,y);
			ctx.fillText("X",x+80,y+30);
		}
		ctx.strokeText(player_name[n],x+20,y-35,510);
		ctx.fillText(player_name[n],x+20,y-35);
		for(var i = 0; i<player_cost[n]; i++)
			ctx.fillRect(x-10+15*i,y+70,10,10);
	}

	function drawPop(pos,str,sec,i){
		ctx.font= 'bold 20px Meiryo';
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 6;
		ctx.lineJoin = 'round';
		ctx.fillStyle = '#fff';
		var x = 0,　y = 0;
		if(pos==0){//r lower
			x = 30;	y = 300;
		}else if(pos==1){//r center
			x = 30;	y = 220;
		}else if(pos==2){//r upper
			x = 30;	y = 130;
		}else if(pos==3){//center
			x = 245; y = 55;
		}else if(pos==4){//l upper
			x = 460; y = 130;
		}else if(pos==5){//l center
			x = 460; y = 220;
		}else if(pos==6){//l lower
			x = 460; y = 300;
		}
		x += i*2;
		y += -50;
		if(sec>100)sec = 100;
		var a = sec/100;
		var asin = (1-a)*Math.abs(Math.cos(Math.PI*2*a));
		var k = 100*(1-asin);
		ctx.strokeText(str,x,y+k,510);
		ctx.fillText(str,x,y+k);
	}

	function discard(p){
		if(p!=player_turn){
			playAI(p,3);
		}else{
			phase = 7;
			playAI(player_turn,3);
		}
	}

	function exchange(p){
		if(p!=player_turn){
			playAI(p,4);
		}else{
			phase = 8;
		}
	}

	function playAction(n,p,t){
		if(n==2 || n==4 || n==5 || n==6){
			for(var i in cturn)
				cturn[i]=true;
			cturn[p] = false;
		}
		if(n==1){
			for(var i in bturn)
				bturn[i]=true;
			bturn[p] = false;
		}else if(n==4 || n==6){
			bturn[t]=true;
		}
		phase = 3;
	}

	function calcAction(n,p,t){
		console.log("calc: [ "+n+" ] "+p+" -> "+t);
		if(n==0){
			//収入
			player_cost[p]++;
		}else if(n==1){
			//援助
			player_cost[p]+=2;
		}else if(n==2){
			//徴税
			player_cost[p]+=3;
		}else if(n==3){
			//クー
			player_cost[p]-=7;
			discard(t);
		}else if(n==4){
			//暗殺
			player_cost[p]-=3;
			discard(t);
		}else if(n==5){
			//交換
			exchange(p);
		}else if(n==6){
			//強奪
			if(player_cost[t]>1){
				player_cost[p]+=2;
				player_cost[t]-=2;
			}else{
				player_cost[p]+=player_cost[t];
				player_cost[t]=0; 
			}
		}
		turn++;
		if(turn>player)turn=0;
		act_choose　= -1;
		phase = 2;
	}

	function doubtCheck(num){

	}

	function playAI(p,act){
		if(act==0){
			//行動選択
			//return = {act,target};
			var s = {act:0,target:-1};
			if(player_cost[p]>9){
				for(var i in player_lost1){
					if(i!=p && (!player_lost1[i] || !player_lost2[i])){
						s = {act:3,target:i};
						break;
					}
				}
			}
			for(var i in pwait){
				if(pwait[i]==0){
					pwait[i]++;
					ppos[i]=ds[player][p-1];
					pstr[i]=act_name[s.act];
					break;
				}
			}
			return s;
		}else if(act==1){
			//ダウトチェック
			//return = t/f;
			for(var i in pwait){
				if(pwait[i]==0){
					pwait[i]++;
					ppos[i]=ds[player][p-1];
					pstr[i]="doubt pass";
					break;
				}
			}
			return false;
		}else if(act==2){
			//ブロックチェック
			//return = t/f;
			for(var i in pwait){
				if(pwait[i]==0){
					pwait[i]++;
					ppos[i]=ds[player][p-1];
					pstr[i]="block pass";
					break;
				}
			}
			return false;
		}else if(act==3){
			//捨札選択
			if(!player_lost1[p]){
				player_lost1[p] = true;
			}else{
				player_lost2[p] = true;
			}
		}else if(act==4){
			//手札交換
		}
	}

	function canChoose(p,i){
		var v = true;
		if(i==3 && player_cost[p]<7)
			v=false;
		if(i==4 && player_cost[p]<3)
			v=false;
		if(i!=3 && player_cost[p]>9)
			v = false;
		return v;
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
			if(on_mouse==10){
				phase = 1;
				reset();
				window.cancelAnimationFrame(requestId);
				requestId = window.requestAnimationFrame(renderMain); 
			}
			if(turn==player_turn && act_choose==-1){
				for(var i in act_name){
					if(hit(x,y,5+85*i,485,85+85*i,595) && canChoose(0,i)){
						tp_act = i;
						tp_tar = -1;
						act_choose = i;
						if(i<3 || i==5){
							playAction(i,player_turn,-1);
						}else{
							phase = 6;
						}
					}
				}
			}		
		}else if(phase==6){
			if(on_mouse==10){
				phase = 1;
				reset();
				window.cancelAnimationFrame(requestId);
				requestId = window.requestAnimationFrame(renderMain); 
			}
			if(act_choose==3 || act_choose==4 || act_choose==6){
				//対象プレイヤー選択
				tp_tar = -1;
				if(player==1){
					if(hit(x,y,235,0,375,100))tp_tar = 1;
				}else if(player==2){
					if(hit(x,y,20,110,160,210))tp_tar = 1;
					if(hit(x,y,450,110,590,210))tp_tar = 2;
				}else if(player==3){
					if(hit(x,y,20,200,160,300))tp_tar = 1;
					if(hit(x,y,235,0,375,100))tp_tar = 2;
					if(hit(x,y,450,200,590,300))tp_tar = 3;
				}else if(player==4){				
					if(hit(x,y,20,280,160,380))tp_tar = 1;
					if(hit(x,y,20,110,160,210))tp_tar = 2;
					if(hit(x,y,450,110,590,210))tp_tar = 3;
					if(hit(x,y,450,280,590,380))tp_tar = 4;
				}else if(player==5){
					if(hit(x,y,20,280,160,380))tp_tar = 1;
					if(hit(x,y,20,110,160,210))tp_tar = 2;
					if(hit(x,y,235,0,375,100))tp_tar = 3;
					if(hit(x,y,450,110,590,210))tp_tar = 4;
					if(hit(x,y,450,280,590,380))tp_tar = 5;
				}
				if(tp_tar!=-1){
					playAction(tp_act,player_turn,tp_tar);
				}else{
					act_choose = -1;
					phase = 2;
				}
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
			on_mouse = -1;
			if(hit(x,y,610,530,790,590)){
				on_mouse = 10;
			}
			for(var i in act_name){
				if(hit(x,y,5+i*85,485,80+i*85,595))
					on_mouse = i;
			}
		}else if(phase==6){
			on_mouse = -1;
			if(hit(x,y,610,530,790,590)){
				on_mouse = 10;
			}
			if(act_choose!=-1){
				if(player==1){
					if(hit(x,y,235,0,375,100))on_mouse = 11;
				}else if(player==2){
					if(hit(x,y,20,110,160,210))on_mouse = 11;
					if(hit(x,y,450,110,590,210))on_mouse = 12;
				}else if(player==3){
					if(hit(x,y,20,200,160,300))on_mouse = 11;
					if(hit(x,y,235,0,375,100))on_mouse = 12;
					if(hit(x,y,450,200,590,300))on_mouse = 13;
				}else if(player==4){				
					if(hit(x,y,20,280,160,380))on_mouse = 11;
					if(hit(x,y,20,110,160,210))on_mouse = 12;
					if(hit(x,y,450,110,590,210))on_mouse = 13;
					if(hit(x,y,450,280,590,380))on_mouse = 14;
				}else if(player==5){
					if(hit(x,y,20,280,160,380))on_mouse = 11;
					if(hit(x,y,20,110,160,210))on_mouse = 12;
					if(hit(x,y,235,0,375,100))on_mouse = 13;
					if(hit(x,y,450,110,590,210))on_mouse = 14;
					if(hit(x,y,450,280,590,380))on_mouse = 15;
				}
			}
		}

	}	
})();