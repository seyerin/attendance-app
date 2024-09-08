<template>
  <div class="flex flex-col items-center relative">
    <video ref="video" autoplay muted class="rounded-full w-64 h-64 object-cover"></video>
    <canvas ref="canvas" class="w-64 h-64 absolute top-0 left-0"></canvas>
    <input v-model="employeeId" placeholder="Enter Employee ID" class="mt-4 p-2 border rounded"/>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'FaceCamera',
  data() {
    return {
      video: null,
      canvas: null,
      employeeId: '', // Input dari pengguna untuk ID karyawan
      faceEncoding: '', // Face encoding untuk dikirim
      recognitionDone: false, // Menandakan jika pengenalan wajah sudah dilakukan
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  async mounted() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;

    // Memuat model-model dari face-api.js
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    // Mengakses kamera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        this.video.srcObject = stream;
      } catch (err) {
        console.error('Error accessing video stream:', err);
        this.toast.error("Failed to access camera. Please ensure your browser supports camera access.");
      }
    } else {
      console.error('getUserMedia is not supported in this browser.');
      this.toast.error("Camera access is not supported in this browser.");
    }
  },
  watch: {
    employeeId(newValue) {
      if (newValue) {
        console.log('Employee ID entered:', newValue); // Log employeeId
        this.startFaceRecognition();
      }
    }
  },
  methods: {
    async startFaceRecognition() {
      if (this.recognitionDone) return;

      const displaySize = { width: this.video.videoWidth, height: this.video.videoHeight };

      if (displaySize.width === 0 || displaySize.height === 0) {
        console.error('Invalid video dimensions:', displaySize);
        return;
      }

      faceapi.matchDimensions(this.canvas, displaySize);

      let intervalId;

      const checkRecognition = async () => {
        if (this.recognitionDone) return;

        const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        faceapi.draw.drawDetections(this.canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);

        const validDetections = resizedDetections.filter(detection => detection.detection.score > 0.8);

        if (validDetections.length > 0) {
          const encoding = validDetections[0].descriptor;
          this.faceEncoding = JSON.stringify(Array.from(encoding));

          if (!this.recognitionDone) {
            this.recognitionDone = true;

            this.toast.success("Face detected!");
            console.log('Employee ID:', this.employeeId);
            console.log('Face Encoding:', this.faceEncoding);

            try {
              const response = await axios.post('http://127.0.0.1:8002/face_recognition/create', {
                params: {
                  employee_id: this.employeeId,
                  face_encoding: this.faceEncoding,
                }
              });
              console.log('Data berhasil dikirim ke Trytond:', response.data);
            } catch (error) {
              console.error('Error mengirim data ke Trytond:', error);
              this.toast.error("Error sending data to the server.");
            }

            this.toast.info("Please close the window after you see this. Thank you and have a good day.");

            setTimeout(() => {
              window.close();
            }, 10000); 

            clearInterval(intervalId);
          }
        }
      };

      intervalId = setInterval(checkRecognition, 100);

      setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);
    },
  },
};
</script>

<style scoped>
video {
  border: 2px solid #ddd; 
  width: 50%;
  height: 50%;
  border-radius: 50%;
}

/* canvas {
  border: 2px solid #ddd;
} */
</style>
