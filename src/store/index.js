import user from './modules/user';
import land from './modules/land';
import { createStore } from 'vuex';

export default createStore({
  modules: {
    user,
    land,
  },
});

