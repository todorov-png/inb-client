import axios from 'axios';
import { encrypt } from '@/lib/encryption.js';
import { setCookie, getCookie } from '@/lib/cookie.js';

export default {
  state() {
    return {
      user: {
        id: null,
        token: null,
        username: null,
        email: null,
        role: null,
        team: null,
        permissions: [],
      },
    };
  },
  getters: {
    getUserToken(state) {
      return state.user.token;
    },
    getUser(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async createUser({ commit }, user) {
      try {
        const response = await axios({
          url: `${process.env.VUE_API_URL}/api/registration`,
          method: 'post',
          data: user,
        });
        //TODO если приходит юзер то регистрируем иначе ошибки
        console.log('createUser', response.data.user);
        if (response.data.user) {
          commit('setUser', response.data.user);
        } else {
          // throw { message: response.data.message };
        }

        // const token = response.data.token;

        // setCookie('userToken', token);
      } catch (e) {
        console.log('createUser', e);
        // if (e.response?.data?.message) {
        //   throw { message: e.response.data.message };
        // } else {
        //   throw { message: 'Error, try again!' };
        // }
      }
    },
    async authUser({ commit }, data) {
      try {
        const user = await axios({
          url: `${process.env.VUE_API_URL}/api/users/auth`,
          method: 'post',
          // headers: {
          //   'Authorization': 'Bearer [token]'
          // },
          data: { data: encrypt(data) },
        });
        if (user.data) {
          commit('setUser', user.data);
          setCookie('userToken', user.data.token);
        } else {
          throw { message: 'Wrong login or password!' };
        }
      } catch (e) {
        if (e && e.message) {
          throw { message: e.message };
        } else {
          throw { message: 'Error, try again!' };
        }
      }
    },
    async checkAuth({ getters, commit }) {
      if (getters.getUserToken) return true;
      const userToken = getCookie('userToken');
      if (!userToken) return false;
      try {
        const user = await axios({
          url: `${process.env.VUE_API_URL}/api/users/user/${userToken}`,
          method: 'get',
        });
        commit('setUser', user.data);
      } catch {
        return false;
      }
      return true;
    },
    // async updateUser({ commit }, user) {
    //   try {
    //     await axios({
    //       url: `${process.env.VUE_API_URL}/api/users/user/${user.token}`,
    //       method: 'put',
    //       data: { data: encrypt(user) },
    //     });
    //     commit('setUser', user);
    //   } catch (e) {
    //     throw { message: 'Error, try again!' };
    //   }
    // },
  },
};
