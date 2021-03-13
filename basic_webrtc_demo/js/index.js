audioInputSelect = document.getElementById("audio_input");
audioOutputSelect = document.getElementById("audio_output");
videoInputSelect = document.getElementById("video_input");
videoSelect = document.getElementById("video_input");
// Constraints for User Media
const constraints = {

    'audio': true
}
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

// API access to connect media inputs (Camera, Mic, etc.)
var media_devices = navigator.mediaDevices

// Helper Function to create tags with properties
function create(type, props, parent) {
    var el = document.createElement(type);
    for (var p in props) {
        el[p] = props[p];
    }
    if (parent) {
        parent.appendChild(el);
    }
    return el;
}
// Testing media devices
navigator.mediaDevices.enumerateDevices()
    .then((data) => {
        console.log('Working', data);
    })
    .catch((err) => {
        console.log('error getting MediaDeviceInfo list', err);
    });

function queryDevice(devices) {
    var aud_in_count = 0,
        aud_out_count = 0,
        vid_in_count = 0;
    devices.forEach(function (device) {
        console.log(device);
        if (device.kind == "audioinput") {
            aud_in_count += 1;
            create("option", {
                value: device.deviceId,
                id: "audio_in_" + aud_in_count
            }, audio_input);
            const text = document.createTextNode(aud_in_count + ": " + device.label);
            document.getElementById("audio_in_" + aud_in_count).appendChild(text);
        } else if (device.kind == "audiooutput") {
            aud_out_count += 1;
            create("option", {
                value: device.deviceId,
                id: "audio_out_" + aud_out_count
            }, audio_output);
            const text = document.createTextNode(aud_out_count + ": " + device.label);
            document.getElementById("audio_out_" + aud_out_count).appendChild(text);
        } else if (device.kind == "videoinput") {
            vid_in_count += 1;
            create("option", {
                value: device.deviceId,
                id: "video" + vid_in_count
            }, video_input);
            const text = document.createTextNode(vid_in_count + ": " + device.label);
            document.getElementById("video" + vid_in_count).appendChild(text);
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    });
}

media_devices.enumerateDevices().then(queryDevice);