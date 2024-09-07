import { createStore } from 'vuex';

export default createStore({
  state: {
    faceEncoding: '',
    checkType: 'checkin', // Default check type
  },
  mutations: {
    updateFaceEncoding(state, encoding) {
      state.faceEncoding = encoding;
    },
    updateCheckType(state, type) {
      state.checkType = type;
    }
  },
  actions: {
    updateFaceEncoding({ commit }, encoding) {
      commit('updateFaceEncoding', encoding);
    },
    updateCheckType({ commit }, type) {
      commit('updateCheckType', type);
    }
  },
  getters: {
    faceEncoding: state => state.faceEncoding,
    checkType: state => state.checkType
  }
});
