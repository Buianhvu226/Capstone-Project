import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/main.css";

// Thiết lập router toàn cục để sử dụng trong toast notifications
window._vueRouter = router;

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
