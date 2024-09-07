<template>
  <div>
    <video ref="video" autoplay muted></video>
    <canvas ref="canvas"></canvas>
    <input v-model="employeeId" placeholder="Enter Employee ID" />
    <button @click="handleFaceRecognition">Recognize Face</button>
  </div>
</template>

<script >
import * as faceapi from 'face-api.js';
import axios from 'axios';

export default {
  name: 'FaceCamera',
  data() {
    return {
      video: null,
      canvas: null,
      employeeId: '', // Input dari pengguna untuk ID karyawan
      faceEncoding: '', // Face encoding untuk dikirim
    };
  },
  async mounted() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;

    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        this.video.srcObject = stream;
        this.video.addEventListener('loadedmetadata', () => {
          this.video.play();
          this.startFaceRecognition();
        });
      })
      .catch(err => console.error('Error accessing video stream:', err));
  },
  methods: {
    async startFaceRecognition() {
      const displaySize = { width: this.video.videoWidth, height: this.video.videoHeight };

      if (displaySize.width === 0 || displaySize.height === 0) {
        console.error('Invalid video dimensions:', displaySize);
        return;
      }

      faceapi.matchDimensions(this.canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        faceapi.draw.drawDetections(this.canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);

        if (detections.length > 0) {
          const encoding = detections[0].descriptor;
          this.faceEncoding = JSON.stringify(Array.from(encoding));
          this.$emit('face-recognized', this.faceEncoding);
        }
      }, 100);
    },
    async handleFaceRecognition() {

      console.log('Employee ID:', this.employeeId);
      console.log('Face Encoding:', this.faceEncoding);

      if (!this.employeeId || !this.faceEncoding) {
        console.error('Employee ID or face encoding is missing.');
        return;
      }
      
      try {
        const response = await axios.post('http://127.0.0.1:8002/face_recognition/create', {
        method: 'model.face.recognition.create_face_record_api',
        params: {
          employee_id: this.employeeId,
          face_encoding: this.faceEncoding,
        }
      });

        console.log('Data berhasil dikirim ke Trytond:', response.data);
      } catch (error) {
        console.error('Error mengirim data ke Trytond:', error);
      }
    },
  },
};
</script>

<style scoped>
video, canvas {
  width: 50%;
  height: auto;
}
</style>
