var THREEx = THREEx || {}

// shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

/**
 * Grab camera
 * @constructor
 */
THREEx.WebcamGrabbing = function(){
        var domElement        = document.createElement('video')
        domElement.setAttribute('autoplay', true)

	domElement.style.zIndex = -1;
        domElement.style.position = 'absolute'

	domElement.style.top = '0px'
	domElement.style.left = '0px'
	domElement.style.width = '100%'
	domElement.style.height = '100%'

        function onResize(){
                // is the size of the video available ?
                if( domElement.videoHeight === 0 )   return

                var videoAspect = domElement.videoWidth / domElement.videoHeight
                var windowAspect = window.innerWidth / window.innerHeight
        }

        window.addEventListener('resize', function(event){
                onResize()
        })

        // just to be sure - resize on mobile is funky to say the least
        setInterval(function(){
                onResize()
        }, 500)

        // get the media sources
        navigator.mediaDevices.enumerateDevices().then(function(sourceInfos) {
                // define getUserMedia() constraints
                var constraints = {
                        video: true,
                        audio: false,
                }
                // to mirror the video element when it isnt 'environment'
                // domElement.style.transform   = 'scaleX(-1)'

                // it it finds the videoSource 'environment', modify constraints.video
                for (var i = 0; i != sourceInfos.length; ++i) {
                        var sourceInfo = sourceInfos[i];
                        if(sourceInfo.kind == "videoinput") {
                                constraints.video = {
                                        optional: [{sourceId: sourceInfo.id}]
                                }
                                // not to mirror the video element when it is 'environment'
                                // domElement.style.transform   = ''
                        }
                }

                // try to get user media
                navigator.getUserMedia( constraints, function(stream){
                        domElement.src = URL.createObjectURL(stream);
                }, function(error) {
                        console.error("Cant getUserMedia()! due to ", error);
                });
        });

	this.domElement = domElement
}
