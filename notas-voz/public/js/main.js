//codigo de la aplicacion
/*
document.getElementById('startPauseBtn').addEventListener('click', toggleRecording);

document.getElementById('stopBtn').addEventListener('click', stopRecording);

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

async function toggleRecording() {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = document.getElementById('audioPlayer');
      audioPlayer.src = audioUrl;
    };

    mediaRecorder.start();
    isRecording = true;
    document.getElementById('startPauseBtn').textContent = 'Pause Recording';
    document.getElementById('stopBtn').disabled = false;
  } else {
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      document.getElementById('startPauseBtn').textContent = 'Resume Recording';
    } else if (mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      document.getElementById('startPauseBtn').textContent = 'Pause Recording';
    }
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('startPauseBtn').textContent = 'Start Recording';
    isRecording = false;
  }
}
*/

import { recordFn } from "/js/recordButton.js";

const liRecordButton = document.getElementById("liRecordButton");
liRecordButton.innerHTML = recordFn();

class App {

    audio;
    blob;
    state;

    constructor() {
        this.audio;
        this.blob;
        this.state;
    }
    
    async init(){
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.initAudio();
        this.initRecord(stream);
    }
    
    initAudio(){
        let audio=new this.audio;
    }
    
    loadBlob() {

    }
    
    initRecord(){

    }
    
    record(){

    }
    
    stopRecording(){

    }
    
    playAudio(){

    }
    
    stopAudio(){

    }

    upload(){

    }
    
    deleteFile(){

    }
}
