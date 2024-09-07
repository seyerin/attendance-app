<template>
  <div>
    <input v-model="employeeId" placeholder="Enter Employee ID" />
    <select v-model="checkType">
      <option value="checkin">Check-in</option>
      <option value="checkout">Check-out</option>
    </select>
    <button @click="handleFaceComparisonAndRecord">Compare and Record</button>
    <div v-if="comparisonResult">
      <p>Comparison Result: {{ comparisonResult }}</p>
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
      checkType: 'checkin',
      comparisonResult: '', // Menyimpan hasil perbandingan
    };
  },
  computed: {
    ...mapGetters(['faceEncoding']), // Ambil faceEncoding dari Vuex
  },
  methods: {
    async handleFaceComparisonAndRecord() {
      if (!this.employeeId || !this.faceEncoding || !this.checkType) {
        console.error('Employee ID, face encoding, or check type is missing.');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8002/face_recognition/compare_and_record', {
          employee_id: this.employeeId,
          face_encoding: this.faceEncoding,
          check_type: this.checkType,
        }, {
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY_HERE',
            'Content-Type': 'application/json'
          }
        });

        if (response.data.match) {
          this.comparisonResult = 'Face matched and recorded successfully!';
        } else {
          this.comparisonResult = 'Face did not match.';
        }
      } catch (error) {
        console.error('Error comparing and recording face encoding:', error);
        this.comparisonResult = 'Error comparing face.';
      }
    },
  },
};
</script>

<style scoped>
/* Tambahkan gaya CSS jika diperlukan */
</style>
