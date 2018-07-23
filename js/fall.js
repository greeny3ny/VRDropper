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
	    //console.log("start");
		
		
		if (self.data.box_id===2 && started){
		
			//upload time to database
		
			//if (finaltime >= 15){
			finaltime = time;
				//times[0] = user;
				//times[1] = finaltime;
				//console.log("final time = " + finaltime);
				//writeFirebase();
			//} 
		
			console.log("end");
			started = false;
		}	
		
		if (self.data.box_id === 1 && !started){
			time = 0;
			console.log("ticky");
			started = true;
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

setInterval(tick, 100);
function tick(){
	
	time+=0.1;
	time = Math.round(time*10)/10;
	if (started){
		document.querySelector('#time1').setAttribute('n-text','text: Time alive : ' + time);
		document.querySelector('#time2').setAttribute('n-text','text: Time alive : ' + time);
	}
	else 
	{
		document.querySelector('#time1').setAttribute('n-text','text: Time alive : ' + finaltime);
		document.querySelector('#time2').setAttribute('n-text','text: Time alive : ' + finaltime);
	}
	
	
}