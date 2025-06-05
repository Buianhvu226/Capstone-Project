import { createStore } from "vuex";
import auth from "./modules/auth";
import profile from "./modules/profile";
import message from "./modules/message";
import notifications from "./modules/notifications";
import recentlyMissing from "./modules/recentlyMissing";
import admin from "./modules/admin";

export default createStore({
  modules: {
    auth,
    profile,
    message,
    notifications,
    recentlyMissing,
    admin,
  },
});
