//codigo de la aplicacion
/*
document.getElementById('startPauseBtn').addEventListener('click', toggleRecording);

document.getElementById('stopBtn').addEventListener('click', stopRecording);

let mediaRecorder;

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

let audioChunks = [];

const create_button = (id) => {
  const button = document.createElement('button')
  const container = document.getElementById(id)
  button.innerHTML = 'Hello'


  container.appendChild(button)
}

class App {


    constructor() {
        this.audio;
        this.blob;
        this.state;
    }
    
    async init(){
      // Permissions to record audio 
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.recordLogic(stream)

    }
    
    recordLogic( stream ) {
       const record_button = document.getElementById('recordbtn')
       record_button.addEventListener('click', () => {
          this.initRecord(stream)
       })
    }

    initButtons(){
      create_button('dasha-code')
    }

    initAudio(){
        let audio = this.audio;
        audio.play();
    }
    
    loadBlob(audioBlob) {
       const audioURL = URL.createObjectURL(audioBlob)
       this.audio.src = audioURL
    }

    initRecord(stream){
      let mediaRecorder= new MediaRecorder(stream);

      console.log(stream)
      console.log(mediaRecorder)


      mediaRecorder.ondataavailable=(e)=> {
        audioChunks.push(e.data);
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioUrl
      };

      mediaRecorder.start()


      document.getElementById('stop-btn').addEventListener('click', () => mediaRecorder.stop())
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