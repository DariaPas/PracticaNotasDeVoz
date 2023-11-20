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

//import { recordFn } from "/js/recordButton.js";

//const liRecordButton = document.getElementById("recordbtn");
//liRecordButton.innerHTML = recordFn();

class App {

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
        let audio=this.audio;
    }
    
    loadBlob() {

    }
    
    initRecord(stream){
      let mediaRecorder=new MediaRecorder(stream);

      mediaRecorder.ondataavailable=(e)=> {
        //chunks.push(e.data);
        audioChunks.push(e.data);
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioUrl;

        audioPlayer.loadBlob(audioBlob);
      };
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
      this.setState({ uploading: true }); // estado actual: uploading
      const body = new FormData(); // Mediante FormData podremos subir el audio al servidor
      body.append("recording", this.blob); // en el atributo recording de formData guarda el audio para su posterior subida
      fetch("/api/upload/" + this.uuid, {
        method: "POST", // usaremos el método POST para subir el audio body,
      })
      .then((res) => res.json()) // el servidor, una vez recogido el audio, devolverá la lista de todos los ficheros a nombre del presente usuario (inlcuido el que se acaba de subir)
      .then((json) => {
        this.setState({
          files: json.files, // todos los ficheros del usuario
          uploading: false, // actualizar el estado actual
          uploaded: true, // actualizar estado actual
        });
      })
      .catch((err) => {
        this.setState({ error: true });
      });
    }
    
    deleteFile(){

    }
}

const myApp = new App();

myApp.init();