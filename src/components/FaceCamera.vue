<template>
  <div>
    <video ref="video" autoplay muted></video>
    <canvas ref="canvas"></canvas>
    <input v-model="employeeId" placeholder="Enter Employee ID" />
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

      let intervalId;

      const checkRecognition = async () => {
        if (this.recognitionDone) return; // Jika sudah dikenali, tidak perlu melanjutkan

        const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);

        faceapi.draw.drawDetections(this.canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);

        // Filter detections based on confidence level
        const validDetections = resizedDetections.filter(detection => {
          return detection.detection.score > 0.8; // Threshold untuk confidence
        });

        if (validDetections.length > 0) {
          const encoding = validDetections[0].descriptor;
          this.faceEncoding = JSON.stringify(Array.from(encoding));

          if (!this.recognitionDone) {
            this.recognitionDone = true; // Tandai bahwa pengenalan wajah sudah dilakukan

            this.toast.success("Face detected!");

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
            }

            this.toast.info("Windows will be closed. Thank you for initializing your face. Have a good day.");

            // Tambahkan delay sebelum menutup aplikasi
            setTimeout(() => {
              window.close(); // Kirim perintah untuk menutup aplikasi
            }, 10000); // 10000 ms (10 detik) untuk memberi waktu tampilan toast

            // Hentikan interval setelah pengenalan berhasil
            clearInterval(intervalId);
          }
        }
      };

      // Jalankan `checkRecognition` setiap 100 ms
      intervalId = setInterval(checkRecognition, 100);

      // Hentikan interval jika tidak ada pengenalan wajah selama 10 detik
      setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);
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
