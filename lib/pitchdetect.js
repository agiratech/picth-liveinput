window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var audioCtx = null;
var mediaStreamSource = null;
var rafID = null;
var j = 0;
var waveCanvas = null;

window.onload = function() {
	audioContext = new AudioContext();
	audioCtx = document.getElementById( "waveform" );
	canvasCtx = audioCtx.getContext("2d");
};
function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    mediaStreamSource.connect( analyser );
    updatePitch();
}
function toggleLiveInput() 
{
    canvasCtx.clearRect(0, 0, audioCtx.width, audioCtx.height);
    canvasCtx.beginPath();
    j = 0;
    buflen = 1024;
	buf = new Float32Array( buflen );
	document.getElementById('toggleLiveInput').disabled = true;
	document.getElementById('toggleLiveInputStop').disabled = false;
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        //analyser = null;
        isPlaying = false;
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame( rafID );
    }
    getUserMedia(
    	{
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream);
}
function stop()
{
    document.getElementById('toggleLiveInput').disabled = false;
	document.getElementById('toggleLiveInputStop').disabled = true;
    //waveCanvas.closePath();
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    window.cancelAnimationFrame( rafID );
    return "start";
}
function updatePitch() 
{
	analyser.fftSize = 1024;
	analyser.getFloatTimeDomainData(buf);
	canvasCtx.strokeStyle = "red";
	for (var i=0;i<2;i+=2) 
 	{
		x = j*5;
		if(audioCtx.width < x)
		{
			x = audioCtx.width - 5;		
			previousImage = canvasCtx.getImageData(5, 0, audioCtx.width, audioCtx.height);
			canvasCtx.putImageData(previousImage, 0, 0);
			canvasCtx.beginPath();
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "red";
			prex = prex - 5;
			canvasCtx.lineTo(prex,prey);
			prex = x;
			prey = 128+(buf[i]*128);
			canvasCtx.lineTo(x,128+(buf[i]*128));
			canvasCtx.stroke();
		
		}
		else
		{
			prex = x;
			prey = 128+(buf[i]*128);
			canvasCtx.lineWidth = 2;
			canvasCtx.lineTo(x,128+(buf[i]*128));
			canvasCtx.stroke();
		}
		j++;
 	}
 	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( updatePitch );
}
function error() {
    alert('Stream generation failed.');
}