<template>
  <div>
    <!-- Tambahkan elemen video untuk kamera -->
    <div>
      <video ref="video" autoplay></video>
    </div>

    <input v-model="employeeId" placeholder="Enter Employee ID" />
    <select v-model="checkType">
      <option value="" disabled>Select Check Type</option>
      <option value="checkin">Check-in</option>
      <option value="checkout">Check-out</option>
    </select>

    <!-- Perbandingan wajah akan otomatis dilakukan setelah checkType dipilih -->
    <div v-if="checkType && faceEncoding">
      <p>Face encoding detected. Checking face...</p>
    </div>

    <!-- Hasil perbandingan wajah ditampilkan di sini -->
    <div v-if="comparisonResult">
      <p>Comparison Result: {{ comparisonResult }}</p>
      <p v-if="detectionScore">Detection Score: {{ detectionScore }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'FaceComparison',
  data() {
    return {
      employeeId: '',
      checkType: '', // Kosongkan nilai default
      comparisonResult: '', // Menyimpan hasil perbandingan
      detectionScore: null, // Menyimpan nilai deteksi (confidence score)
    };
  },
  computed: {
    ...mapGetters(['faceEncoding']), // Ambil faceEncoding dari Vuex
  },
  watch: {
    // Watch untuk memeriksa perubahan pada checkType dan faceEncoding
    checkType(newVal) {
      if (newVal && this.faceEncoding) {
        this.performFaceComparison();
      }
    },
    faceEncoding(newVal) {
      if (this.checkType && newVal) {
        this.performFaceComparison();
      }
    }
  },
  mounted() {
    this.startVideo();
  },
  methods: {
    async startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = stream;
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    },

    async performFaceComparison() {
      if (!this.checkType) {
        alert('Please select a check type before comparing.');
        return;
      }

      if (!this.employeeId || !this.faceEncoding) {
        console.error('Employee ID or face encoding is missing.');
        return;
      }

      try {
        // Cek apakah wajah cocok dengan database
        const isFaceMatched = await this.checkFaceMatch();
        if (!isFaceMatched) {
          alert('Face did not match with the database.');
          return;
        }

        // Jika wajah cocok, lanjutkan ke perbandingan dan rekam
        const response = await axios.post('http://127.0.0.1:8002/face_recognition/compare_and_record', {
          employee_id: this.employeeId,
          face_encoding: this.faceEncoding,
          check_type: this.checkType,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.match) {
          this.comparisonResult = 'Face matched and recorded successfully!';
          this.detectionScore = response.data.detection_score; // Ambil nilai deteksi dari respons
        } else {
          this.comparisonResult = 'Face did not match.';
        }

        alert(`${this.comparisonResult} Detection Score: ${this.detectionScore ? this.detectionScore : 'N/A'}`);

      } catch (error) {
        console.error('Error comparing and recording face encoding:', error);
        this.comparisonResult = 'Error comparing face.';
        alert(this.comparisonResult);
      }
    },

    async checkFaceMatch() {
      if (!this.faceEncoding) {
        console.error('Face encoding is missing.');
        return false;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8002/face_recognition/match_face', {
          face_encoding: this.faceEncoding
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return response.data.match; // Assume response contains a boolean indicating a match
      } catch (error) {
        console.error('Error checking face match:', error);
        return false;
      }
    }
  },
};
</script>

<style scoped>
/* Tambahkan gaya CSS jika diperlukan */
</style>
