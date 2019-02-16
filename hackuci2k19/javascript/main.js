//receives parameters passed into the URL///////////////////////////////////////////////////////////////////////////
	var urlParams = new URLSearchParams(window.location.search);
	var time = 0;
	var id = urlParams.get("id");
	var youtube_player_state = -1;
	var timestamp_to_imgur = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//VIDEO CANVAS////////////////////////////////////////////////////////////////////////////////////////////////
      		var video = document.querySelector("#videoElement");
var img = document.querySelector("#screenshot");
var snapshots = [];
if (navigator.mediaDevices.getUserMedia) {       
    navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(error) {
    console.log(error);
  });
}
var canvas;
capture = (video, img, currentTime) => {
canvas = document.createElement('canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
var ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//console.log(canvas.toDataURL());
img.src = canvas.toDataURL();




var link;
var lol = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
/**
$.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'post',
    headers: {
        Authorization: 'Client-ID c5034654d9f801a'
    },
    data: {
        image: lol
    },
    dataType: 'json',
    success: function(response) {
        if(response.success) {
            link = response.data.link;
        }
    }
});
**/


}

//VIDEO CANVAS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//YOUTUBE API CODE////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '487',
          width: '800',
          videoId: id,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
      		time = player.getDuration();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.


      function onPlayerStateChange(event) {
      	youtube_player_state = event.data;
      }
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

run_capture = (state) => {
	console.log(state);
	if(state == 0){
		clearInterval(t);
	}
	else if(state == 1){
	let currentTime = Math.trunc(player.getCurrentTime());
	console.log("currenTime: "+ currentTime);
	let mod = currentTime % 4;

	console.log("mod: " + mod);

	//every 4 seconds, perform a capture 
		if(mod == 0)
		{
			capture(video, img, currentTime);
		}

	}
	

}

var t = setInterval(function () {run_capture(youtube_player_state) },1000);




//ON SEARCH////////////////////////////////////////////////////////////////////////////////////////////////////////////
$( "#searchClicked" ).click(function(){


	var inputText = $("#search").val();
	var url = new URL(inputText);
	console.log(url.searchParams.get("v"));
	window.location.replace('/main.html?id=' + url.searchParams.get("v"));
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



