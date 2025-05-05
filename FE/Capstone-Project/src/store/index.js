import { createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import message from './modules/message'

export default createStore({
  modules: {
    auth,
    profile,
    message
  }
})