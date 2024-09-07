<template>
  <div>
    <FaceCamera @face-captured="handleFaceCaptured" />
    <FaceComparison :faceEncoding="capturedFaceEncoding" />
  </div>
</template>

<script>
import FaceCamera from './components/FaceCamera.vue';
import FaceComparison from './components/FaceComparison.vue';


export default {
  name: 'FaceAttendance',
  components: {
    FaceCamera,
    FaceComparison
  },
  data() {
    return {
      capturedFaceEncoding: ''
    };
  },
  methods: {
    handleFaceCaptured(encoding) {
      this.capturedFaceEncoding = encoding;
    }
  }
};
</script>