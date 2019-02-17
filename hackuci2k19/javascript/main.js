

//receives parameters passed into the URL///////////////////////////////////////////////////////////////////////////
	var urlParams = new URLSearchParams(window.location.search);
	var time = 0;
	var id = urlParams.get("id");
	console.log(id);
	var youtube_player_state = -1;
	var empty = {};
	var timestamp_to_imgur = {};
	timestamp_to_imgur[id] = {};
  var summary = {};
  var summaryFound = false;
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

function pad(num) {
    var s = num+"";
    while (s.length < 5) s =  s + "0";
    return s + "%";
}

$(".emojiText").text("N/A");
  return_summary = () => {
 	database.child("yt_urls").child(id).child('summary').on("value", function(snap){
		summary = snap.val();
		console.log(snap.val());

    summary.anger = (Math.round(summary.anger * 10000) / 100);
    summary.contempt = (Math.round(summary.contempt * 10000) / 100);
    summary.disgust = (Math.round(summary.disgust * 10000) / 100);
    summary.fear = (Math.round(summary.fear * 10000) / 100);
    summary.happiness = (Math.round(summary.happiness * 10000) / 100);
    summary.neutral = (Math.round(summary.neutral * 10000) / 100);
    summary.sadness = (Math.round(summary.sadness * 10000) / 100);
    summary.surprise = (Math.round(summary.surprise * 10000) / 100);

    
    $("#angryEmoji").text(pad(summary.anger));
  $("#contemptEmoji").text(pad(summary.contempt));
  $("#disgustEmoji").text(pad(summary.disgust));
  $("#fearEmoji").text(pad(summary.fear));
  $("#happinessEmoji").text(pad(summary.happiness));
  $("#neutralEmoji").text(pad(summary.neutral));
  $("#sadEmoji").text(pad(summary.sadness));
  $("#surpriseEmoji").text(pad(summary.surprise));

  
	});
 }
 return_summary();




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
        Authorization: 'Client-ID df948eca61ead59'
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
          height: '400',
          width: '657',
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
  return_summary();
  let summaryData = [summary.anger, summary.content, summary.disgust, summary.fear, summary.happiness, summary.neutral, summary.sadness, summary.surprise];
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
		maintainAspectRatio : false,
        scales: {
            yAxes: [{
                ticks: {
                	min: 0,
           			max: 1,
					stepSize: 0.2,
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
          data: summaryData
        }
      ]
    },
    options: {
		maintainAspectRatio : false,
		scale: {
			ticks:{
				 stepSize: 0.2
			}
		},
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
document.getElementById("personal-bar-section").style.display = "flex";
document.getElementById("summary-radar-section").style.display = "flex";
document.getElementById("moments").style.display = "flex";
document.getElementById("navlink1").style.transition = "opacity 1s";
document.getElementById("navlink2").style.transition = "opacity 1s";
document.getElementById("navlink3").style.transition = "opacity 1s";
document.getElementById("navlink1").style.opacity = 1;
document.getElementById("navlink2").style.opacity = 1;
document.getElementById("navlink3").style.opacity = 1;

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
			if (jQuery.isEmptyObject(response['timestamps'])){
				alert("Cannot analyze your face. Please makes sure your area is free of reflections and refresh the page.")
			}
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
	mod = currentTime % 3;




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
