import axios from 'axios';
import AuthService from '@/services/AuthService';
import { IUser } from '@/models/IUser';
import { AuthResponse } from '@/models/response/AuthResponse';
import { API_URL } from '@/http';

export default {
  state() {
    return {
      user: {} as IUser,
      isAuth: false as boolean,
      isLoading: false as boolean,
    };
  },
  getters: {
    getStatusLoading(state: any) {
      return state.isLoading;
    },
    // getUserToken(state) {
    //   return state.user.token;
    // },
    getUser(state: any) {
      return state.user;
    },
  },
  mutations: {
    setLoading(state: any, bool: boolean) {
      state.isLoading = bool;
    },
    setAuth(state: any, bool: boolean) {
      state.isAuth = bool;
    },
    setUser(state: any, user: IUser) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }: any, userData: any) {
      try {
        const { email, password } = userData;
        const response = await AuthService.login(email, password);
        localStorage.setItem('token', response.data.accessToken);
        commit('setAuth', true);
        commit('setUser', response.data.user);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: 'Error, try again!' };
      }
    },

    async registration({ commit }: any, userData: any) {
      try {
        const { username, email, password, repeatPassword } = userData;
        const response = await AuthService.registration(username, email, password, repeatPassword);
        localStorage.setItem('token', response.data.accessToken);
        commit('setAuth', true);
        commit('setUser', response.data.user);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: 'Error, try again!' };
      }
    },

    async logout({ commit }: any) {
      try {
        await AuthService.logout();
        localStorage.removeItem('token');
        commit('setAuth', false);
        commit('setUser', {} as IUser);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: 'Error, try again!' };
      }
    },

    async checkAuth({ commit }: any) {
      commit('setLoading', true);
      try {
        if (localStorage.getItem('token')) {
          const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
            withCredentials: true,
          });
          localStorage.setItem('token', response.data.accessToken);
          commit('setAuth', true);
          commit('setUser', response.data.user);
          return true;
        }
        return false;
      } catch (e: any) {
        return false;
      } finally {
        commit('setLoading', false);
      }
    },
  },
};
