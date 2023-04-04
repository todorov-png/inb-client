import axios from 'axios';
import { encrypt } from '../../lib/encryption.js';

export default {
  state() {
    return {
      arrayLands: [],
      land: {},
    };
  },
  getters: {
    getAllLands(state) {
      return state.arrayLands;
    },
    getLand(state) {
      return state.land;
    },
    // getLandByTaskName: (state) => (nameTask) => {
    //   return state.arrayLands.find((land) => land.nameTask === nameTask);
    // },
    //         getTestName(state) {
    //             return state.land.name ? state.land.name : '';
    //         },
    //         getTestQuestions(state) {
    //             return state.land.questions ? state.land.questions : [];
    //         },
  },
  mutations: {
    setLand(state, land) {
      state.land = land;
    },
    setArrayLands(state, arrayLands) {
      state.arrayLands = arrayLands;
    },
  },
  actions: {
    async fetchAllLands({ commit }) {
      try {
        const arrayLands = await axios({
          url: `${process.env.VUE_API_URL}/api/lands`,
          method: 'get',
        });
        if (arrayLands.data) {
          commit('setArrayLands', arrayLands.data);
        }
      } catch (e) {
        if (e && e.message) {
          throw { message: e.message };
        } else {
          throw { message: 'Error, try again!' };
        }
      }
    },
    async fetchLand({ commit }, nameTask) {
      try {
        const searchNameTask = encrypt(nameTask);
        const land = await axios({
          url: `${process.env.VUE_API_URL}/api/lands/${searchNameTask}`,
          method: 'get',
        });
        if (land.data) {
          commit('setLand', land.data);
        }
      } catch (e) {
        if (e && e.message) {
          throw { message: e.message };
        } else {
          throw { message: 'Error, try again!' };
        }
      }
    },
  },
};
