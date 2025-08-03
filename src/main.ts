import "./style.less";
import 'primeicons/primeicons.css'

import { InputText, Textarea } from "primevue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Button from "primevue/button";
import Card from "primevue/card";
import Lura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import SelectButton from "primevue/selectbutton";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import { definePreset } from "@primeuix/themes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./pages/Home.vue"),
    },
    {
      path: "/login",
      component: () => import("./pages/Login.vue"),
    },
    {
      path: "/settings",
      component: () => import("./pages/Setting.vue"),
    },
  ],
});

const stylePreset = definePreset(Lura, {
  semantic: {
    primary: {
      50: "{emerald.50}",
      100: "{emerald.100}",
      200: "{emerald.200}",
      300: "{emerald.300}",
      400: "{emerald.400}",
      500: "{emerald.500}",
      600: "{emerald.600}",
      700: "{emerald.700}",
      800: "{emerald.800}",
      900: "{emerald.900}",
      950: "{emerald.950}",
    },
    colorScheme: {
      // dark: {
      //   surface: {
      //     0: "#ffffff",
      //     50: "{neutral.50}",
      //     100: "{neutral.100}",
      //     200: "{neutral.200}",
      //     300: "{neutral.300}",
      //     400: "{neutral.400}",
      //     500: "{neutral.500}",
      //     600: "{neutral.600}",
      //     700: "{neutral.700}",
      //     800: "{neutral.800}",
      //     900: "{neutral.900}",
      //     950: "{neutral.950}",
      //   },
      // },
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: stylePreset,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: false,
    },
  },
});
app.use(ToastService);
app.component("Button", Button);
app.component("Card", Card);
app.component("InputText", InputText);
app.component("Textarea", Textarea);
app.component("SelectButton", SelectButton);
app.component("Toast", Toast);
app.mount("#app");
