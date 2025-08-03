<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { useRouter } from "vue-router";
import { cookie } from "jsfast";
import { getRequestUrl } from "../utils";

const toast = useToast();
const router = useRouter();
const password = ref("");
const loginLoading = ref(false);

function onLoginSubmit() {
  if (password.value === "") {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Password cannot be empty",
      life: 3000,
    });
    return;
  }
  loginLoading.value = true;

  try {
    axios
      .post(getRequestUrl("/validatePassword"), {
        password: password.value,
      })
      .then((response) => {
        if (response.data.valid) {
          cookie.set("mail-helper-token", password.value);
          toast.add({
            severity: "success",
            summary: "Login Success",
            detail: "You have successfully logged in.",
            life: 3000,
          });
          router.push("/");
        } else {
          toast.add({
            severity: "error",
            summary: "Login Failed",
            detail: response.data.message,
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "An error occurred during login.",
          life: 3000,
        });
      })
      .finally(() => {
        loginLoading.value = false;
      });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "An error occurred during login.",
      life: 3000,
    });
    loginLoading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <Toast />
    <div class="container">
      <Card>
        <template #title> Login </template>
        <template #content>
          <div class="card-inside">
            <div class="label-container">
              <label for="password">Password</label>
              <InputText id="password" type="password" v-model="password" />
            </div>
            <Button
              label="Login"
              variant="outlined"
              :loading="loginLoading"
              @click="onLoginSubmit"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
