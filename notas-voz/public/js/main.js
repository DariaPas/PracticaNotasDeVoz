//import { recordFn } from "/js/recordButton.js";

//const liRecordButton = document.getElementById("recordbtn");
//liRecordButton.innerHTML = recordFn();

//let audioChunks = [];
//let mediaRecorder;


//import {v4 as uuidv4} from "./public/utils/uuid/v4.js";

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
        this.mediaRecorder;
        this.audioChunks = [];
    }
    
    async init(){
      // Permissions to record audio 
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      //this.recordLogic(stream)
      this.initRecord(stream);
      this.initAudio();
    }
    
    recordLogic( stream ) {
       const record_button = document.getElementById('recordbtn')
       record_button.addEventListener('click', () => {
          this.initRecord(stream)
       })
    }

    initButtons(){
      create_button('buttons')
    }

    initAudio(){
        let audio = this.audio;
        
        onloadedmetadata=(e)=> {
          console.log(onloadedmetadata);
        }
        ondurationchange=(e)=> {
          console.log(ondurationchange);
        }
        ontimeupdate=(e)=> {
          console.log(ontimeupdate);
        }
        onended=(e)=> {
          console.log(onended);
        }

        document.getElementById('playbtn').addEventListener('click', () => {
          if(this.audio.paused || this.audio.currentTime==0){
            this.playAudio(); 
          }else{
            this.stopAudio();
          }
        });
    }
    
    loadBlob(audioBlob) {
       const audioURL = URL.createObjectURL(audioBlob)
       this.audio.src = audioURL
    }

    initRecord(stream){
     this.mediaRecorder= new MediaRecorder(stream);

      console.log(stream)
      console.log(this.mediaRecorder)


      this.mediaRecorder.ondataavailable=(e)=> {
        if(this.audioChunks.length>0) {
          this.audioChunks.pop();
        }
        console.log("estoy aqui3")
        this.audioChunks.push(e.data);
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio= document.getElementById('audioPlayer');
        this.audio.src = audioUrl;
        console.log("estoy aqui2")
      };

      
      document.getElementById('recordbtn').addEventListener('click', () => {
        if(document.getElementById('recordbtn').textContent=="Record") {
         this.record();
        }
        else {
          this.stopRecording();
        }
      });

    }
    
    setState(state) {
      this.state = Object.assign({}, this.state, state);
      this.render();
    }

    render() {
      if(this.mediaRecorder.state=='recording') {
        document.getElementById('playbtn').disabled=true;
      }
      else if(this.mediaRecorder.state=='paused') {
        if(this.audioChunks.length>0) {
          document.getElementById('playbtn').disabled=false;
        }
      }
      else if(this.mediaRecorder.state=='inactive') {
        if(this.mediaRecorder.mimeType!='' || this.audioChunks.length>0) {
          document.getElementById('playbtn').disabled=false;
        }
      }
      /*else if(this.mediaRecorder.state=='playing') {
        document.getElementById('playbtn').textContent="Stop audio"
        this.setState(this.audio.ontimeupdate);
      }*/
    }

    record(){
       
        this.mediaRecorder.start();
        console.log("grabando");
        console.log(this.mediaRecorder);
        this.setState('recording');
        document.getElementById('recordbtn').textContent="Stop recording"
    }
    
    stopRecording(){
        this.mediaRecorder.stop();
        console.log("parado");
        console.log(this.mediaRecorder);
        this.setState('inactive');
        document.getElementById('recordbtn').textContent="Record";
    }
    
    playAudio(){
      this.audio.play();
     // this.setState('playing');
     document.getElementById('playbtn').textContent="Stop audio"
    }
    
    stopAudio(){
      this.audio.pause();
      document.getElementById('playbtn').textContent="Play audio"
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

//document.getElementById('recordbtn').addEventListener('click', () =>myApp.record());
      
//document.getElementById('stop-btn').addEventListener('click', () => myApp.stopRecording());

//document.getElementById('playbtn').addEventListener('click', () => myApp.playAudio());
//document.getElementById('recor')