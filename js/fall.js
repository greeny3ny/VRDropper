console.log("fall loaded!");

AFRAME.registerComponent('player_fall',
{
  schema:
  { 
    jointCubeSize: {
      type: 'float',
      default: 0.275
    },
	box_id:
	{
		type: 'int'
	}
  },
  init: function ()
  {
    var self = this;
    var object = self.el.object3D;
	
    object.addBehavior(new altspace.utilities.behaviors.JointCollisionEvents
                       ({
      joints: [['Head', 'Center', 0]], jointCubeSize: self.data.jointCubeSize
    }));
	
	//joints enter
    object.addEventListener('jointcollisionenter', handleJoin);		
    function handleJoin(event)
    {
		console.log("box " + self.data.box_id);
		if (self.data.box_id===2 && started){
			
			document.querySelector('#topPlatform').setAttribute('position','15 59.9 15');
			
			finaltime = time;
			times[0] = user;
			times[1] = finaltime;
			//Avoid database being added with junk data
			if (finaltime > 10){
				writeUserTimes();
			}
			console.log("end");
			started = false;
		}	
		if (self.data.box_id === 1 && !started){
			time = 0;
			console.log("ticky");
			started = true;
			
			setTimeout(spawnDrop, 5000);
		}		
    }// end function handle join
	
	//joint collision leave
    object.addEventListener('jointcollisionleave', handleLeave);
    function handleLeave(event)
    {
    }//end function handle leave
  }
}); //end base collision

var time = 0;
var finaltime = 0;
var started = false;

var user;
var times=[];
var leaderBoard = [];
getUser1();

setInterval(tick, 100);
function tick(){
	time+=0.1;
	time = Math.round(time*10)/10;
	if (started){
		//document.querySelector('#time1').setAttribute('n-text','text: Time alive : ' + time);
		document.querySelector('#time2').setAttribute('n-text','text: Time alive : ' + time);
	}
	else 
	{
		//document.querySelector('#time1').setAttribute('n-text','text: Time alive : ' + finaltime);
		document.querySelector('#time2').setAttribute('n-text','text: Time alive : ' + finaltime);
	}
}

//drops spawn after 5 seconds
function spawnDrop(){
	console.log("dropping spawn!");
	document.querySelector('#topPlatform').setAttribute('position','15 -10 15');
}

function writeUserTimes(){
	console.log("writing user times");
	DB_REF.child("times").push({times:times});
}

var isMod = false;
function getUser1(){
	altspace.getUser().then(function(user1){
		console.log(user1);
		user = user1.displayName;
		isMod = user1.isModerator;
		console.log(user);
		console.log(isMod);
	});
}

var test = [];
var counter = 0;
var top5_board = "";
var board = "";
function readFBTimes(){
	console.log("reading times...");
	DB_REF.child("times").on("child_added", function(snapshot){
		leaderBoard = snapshot.val();
		test[counter] = leaderBoard;
		counter ++;
		console.log("counter" + counter);
	});
	DB_REF.on("value", function(snap) {
		console.log("promise over");
		updateLeaderboard();
	});
}
function updateLeaderboard(){
	board="Longest survival:";
	//SORT TEST TIMES
	sortTimes();
	for (var i=test.length-1; i>=0;i--){
	console.log(test[i].times);
	board = board + "\n" + (test.length-i) + ": " + test[i].times[0] + " " + test[i].times[1];
	}
	document.querySelector('#leaderboard').setAttribute('n-text','fontSize:4; text:' + board);
};
function sortTimes(){
	var swapped;
	do {
	swapped = false;
	for (var i=0; i<(test.length-1);i++){
		console.log("sorting");
		//bubble sort for now - should upgrade to quicksort for efficiency
		if (test[i].times[1] > test[i+1].times[1]){
			var temp = test[i];
			test[i] = test[i+1];
			test[i+1] = temp;
			swapped = true;
		}		
	}//end for
	} while (swapped);
	for (var i =0; i<test.length;i++){
		console.log(test[i].times[1]);
	}
}
