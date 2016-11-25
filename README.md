Web Audio API provides features to handle audio in web. One of the most interesting features of the Web Audio API is the ability to extract frequency, waveform, and other data from your audio source, which can then be used to create visualizations. This sample explains how, and provides a couple of basic use cases.

Example:


Before start to extract data we need to access the user media input (Like: Mic).


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


getUserMedia using secure connection so it won't work on HTTP. We should use HTTPS.


To extract audio data, we need to create an AnalyserNode. Using AudioContext.createAnalyser() method.


var aCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = aCtx.createAnalyser();


To connect audio source we need to use createMediaStreamSource method in AudioContext.


function gotStream(stream) 
{
source = aCtx.createMediaStreamSource(stream);
source.connect(analyser);
analyser.connect(distortion);
updatePitch();
}


The analyser node will then return audio data using a Fast Fourier Transform (fft) in a certain frequency domain, depending on what you specify as the AnalyserNode.fftSize property value (if no value is specified, the default is 2048.)


For capturing audio data, we can use the collection methods AnalyserNode.getFloatFrequencyData() and AnalyserNode.getByteFrequencyData() to capture audio frequency and AnalyserNode.getByteTimeDomainData() and AnalyserNode.getFloatTimeDomainData() to capture waveform data. These methods will copy the data to specified UnitArray() or FloatArray based on methods. Here we going to user AnalyserNode.getFloatTimeDomainData() so we using float array to copy data.


analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Float32Array(bufferLength);


To retrieve the data and copy to our array, we have call the data collection method, with the array passed as it's argument. For example:


analyser.getByteTimeDomainData(dataArray);


We now have the audio data, and now for visualize we need canvas HTML5 element.


<canvas id="wavecanvas" width="800" height="180"></canvas>


Let's look below example:


Creating a waveform with liveinput:


To create oscilloscope visualisation we need to setup the buffer.


analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength)


Next, we need to create and clear canvas:


wavecanvas = document.getElementById( "wavecanvas" );
canvasCtx = avgformcanline.getContext("2d");


canvasCtx.clearRect(0, 0, wavecanvas.width, wavecanvas.height);


We now define the updatePitch() function:


function updatePicth()
{
	......
	......
}


We use requestAnimationFrame() to keep looping the drawing:


updatePicthVisual = requestAnimationFrame(updatePicth);


Here the updatePitch() will do the audio analyzing and will draw the wave line.


function updatePitch() 
{
	updatePicthVisual = requestAnimationFrame(updatePicth);
	analyser.fftSize = 1028;
	analyser.getFloatTimeDomainData( dataArray );
	canvasCtx.strokeStyle = "red";
	for (var i=0;i<512;i+=2)
 	{
		x = j*5;
		if(DEBUGCANVAS.width < x)
		{
			x = DEBUGCANVAS.width - 5;		
			previousImage = canvasCtx.getImageData(5, 0, DEBUGCANVAS.width, DEBUGCANVAS.height);
			canvasCtx.putImageData(previousImage, 0, 0);
			canvasCtx.beginPath();
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = "red";
			prex = prex - 5;
			canvasCtx.lineTo(prex,prey);
			prex = x;
			prey = 128+(dataArray[i]*128);
			canvasCtx.lineTo(x,128+(dataArray[i]*128));
			canvasCtx.stroke();
		
		}
		else
		{
			prex = x;
			prey = 128+(dataArray[i]*128);
			canvasCtx.lineWidth = 2;
			canvasCtx.lineTo(x,128+(dataArray[i]*128));
			canvasCtx.stroke();
		}
		j++;
 	}
}
