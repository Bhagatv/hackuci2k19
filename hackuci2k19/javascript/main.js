

//receives parameters passed into the URL///////////////////////////////////////////////////////////////////////////
	var urlParams = new URLSearchParams(window.location.search);
	var time = 0;
	var id = urlParams.get("id");
	var youtube_player_state = -1;
	var empty = {};
	var timestamp_to_imgur = {};
	timestamp_to_imgur[id] = {};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize Firebase
  // TODO: Replace with your project's customized code snippet

  	var config = {
          "apiKey": "AIzaSyALHsoFjWeyBkIH0Ta2npk1VhDljU6axCk",
          "authDomain": "hackuci2019-71642.firebaseapp.com",
          "databaseURL": "https://hackuci2019-71642.firebaseio.com",
          "storageBucket": "hackuci2019-71642.appspot.com",
        		};
  	firebase.initializeApp(config);

 	var database = firebase.database().ref();

 	database.child("yt_urls").child('summary').on("value", function(snap){
		var summary = snap.val();
		console.log(summary);
	});

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
//img.src = canvas.toDataURL();




var link;
var lol = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];


$.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'post',
    headers: {
        Authorization: 'Client-ID 040e94cc45d44df'
    },
    data: {
        image: lol
    },
    dataType: 'json',
    success: function(response) {
        if(response.success) {
            link = response.data.link;
            timestamp_to_imgur[id][currentTime] = link;
            console.log(timestamp_to_imgur);
        }
    }
});



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


produce_end_results = (response) => {

	let personalData = [response.anger.avg, response.contempt.avg, response.disgust.avg, response.fear.avg, response.happiness.avg, response.neutral.avg, response.sadness.avg, response.surprise.avg];
	let high_happy_url = response.happiness.highest.img_url;
	let high_happy_timestamp = response.happiness.highest.timestamp;

	let high_sadness_url = response.sadness.highest.img_url;
	let high_sadness_timestamp = response.sadness.highest.timestamp;
/////PERSONAL BAR GRAPH/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var ctx = document.getElementById("personalBarGraph").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness", "Neutral", "Sadness", "Surprise"],
        datasets: [{
            label: 'Personal Bar Graph',
            data: personalData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                	min: 0,
           			max: 1,
                    beginAtZero:true
                }
            }]
        }
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//SUMMARY GRAPH////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	new Chart(document.getElementById("summarySpiderGraph"), {
    type: 'radar',

    data: {
      labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness", "Neutral", "Sadness", "Surprise"],
      datasets: [
        {
          label: "You",
          fill: true,
          backgroundColor: "rgba(179,181,198,0.2)",
          borderColor: "rgba(179,181,198,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(179,181,198,1)",
          data: personalData
        }, {
          label: "HackUCI",
          fill: true,
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          data: [0.1,0.1,0.2,0.2,0.1,0.1,0.1,0.1]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'You vs. HackUCI'
      }
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Set highest happiness and sadness moments
console.log("High URL: " + high_happy_url);
console.log("Sad URL: " + high_sadness_url);
document.getElementById("highHappy").src = high_happy_url;
document.getElementById("highSadness").src = high_sadness_url;



}


run_capture = (state) => {
	console.log(state);
	if(state == 0){
		clearInterval(t);
		$.ajax({
    url: 'http://60debd7d.ngrok.io/',
    type: 'post',
    data: JSON.stringify(timestamp_to_imgur),
    dataType: 'json',
    success: function(response) {

            console.log(JSON.stringify(response));
        	produce_end_results(response);
    }
});
	}
	else if(state == 1){
	let currentTime = Math.trunc(player.getCurrentTime());
	console.log("currenTime: "+ currentTime);
	let mod = currentTime % 4;

	if(time < 30)
	mod = currentTime % 2;

	//DEMONSTRATION PURPOSES
	mod = currentTime % 8;


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
