<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { cookie } from "jsfast";
import { useRouter } from "vue-router";
import { getRequestUrl } from "../utils";

const ideaTarget = ref("");
const ideaDescription = ref("");
const ideaGenerating = ref(false);

const regionOptions = ref(["English", "Chinese"]);
const regionSelected = ref("English");
const formatOptions = ref(["Formal", "Default", "Informal"]);
const formatSelected = ref("Default");

const mailSubject = ref("");
const mailNickname = ref("Wan Chak Li");
const mailRecipient = ref("");
const mailGreeting = ref("");
const mailContent = ref("");
const mailClosing = ref(`Best Regards,
Wan Chak Li,
admin@xiaodong.moe`);
const mailSending = ref(false);

const toast = useToast();

const token = cookie.get("mail-helper-token");

if (!token) {
  useRouter().push("/login");
}

const onAutoGenerateSubmit = async () => {
  if (!ideaTarget.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Send Target is required.",
      life: 3000,
    });
    return;
  }

  if (!ideaDescription.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Idea Description is required.",
      life: 3000,
    });
    return;
  }

  ideaGenerating.value = true;

  let result;
  try {
    result = await axios.post(getRequestUrl("/generateEmail"), {
      to: ideaTarget.value,
      description: ideaDescription.value,
      format: formatSelected.value,
      language: regionSelected.value,
    });
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to generate email.",
      life: 3000,
    });
    ideaGenerating.value = false;
    return;
  }

  ideaGenerating.value = false;

  mailSubject.value = result.data.result.subject;
  mailGreeting.value = result.data.result.greeting;
  mailContent.value = result.data.result.body;

  console.log(result);

  toast.add({
    severity: "success",
    summary: "Form is submitted.",
    life: 3000,
  });
};

const onSendEmailSubmit = async () => {
  if (!mailSubject.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Mail Subject is required.",
      life: 3000,
    });
    return;
  }

  if (!mailNickname.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Mail Nickname is required.",
      life: 3000,
    });
    return;
  }

  if (!mailRecipient.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Mail Recipient is required.",
      life: 3000,
    });
    return;
  }

  if (!mailGreeting.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Mail Title is required.",
      life: 3000,
    });
    return;
  }

  if (!mailContent.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Mail Content is required.",
      life: 3000,
    });
    return;
  }

  if (!mailClosing.value) {
    toast.add({
      severity: "error",
      summary: "Missing Field",
      detail: "Mail Closing is required.",
      life: 3000,
    });
    return;
  }

  mailSending.value = true;

  let result;
  try {
    result = await axios.post(getRequestUrl("/sendEmail"), {
      name: mailNickname.value,
      subject: mailSubject.value,
      title: mailGreeting.value,
      content: mailContent.value,
      closing: mailClosing.value,
      to: mailRecipient.value,
    });
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to send email.",
      life: 3000,
    });
    mailSending.value = false;
    return;
  }

  mailSending.value = false;

  console.log(result);

  toast.add({
    severity: "success",
    summary: "Email sent.",
    life: 3000,
  });
};
</script>

<template>
  <div class="container">
    <Toast />
    <Card>
      <template #title> Auto Generate Email </template>
      <template #content>
        <div class="card-inside">
          <div class="label-container">
            <label for="idea-region">Idea - Language</label>
            <SelectButton
              id="idea-region"
              v-model="regionSelected"
              :options="regionOptions"
            />
          </div>
          <div class="label-container">
            <label for="idea-language">Idea - Format</label>
            <SelectButton
              id="idea-language"
              v-model="formatSelected"
              :options="formatOptions"
            />
          </div>
          <div class="label-container">
            <label for="idea-target">Idea - Send Target</label>
            <InputText
              id="idea-target"
              v-model="ideaTarget"
              autoResize
              rows="5"
              cols="30"
            />
          </div>
          <div class="label-container">
            <label for="idea-description">Idea - Description</label>
            <Textarea
              id="idea-description"
              v-model="ideaDescription"
              autoResize
              rows="5"
              cols="30"
            />
          </div>
          <Button
            label="Generate Email Content"
            variant="outlined"
            :loading="ideaGenerating"
            @click="onAutoGenerateSubmit"
          />
        </div>
      </template>
    </Card>
    <Card>
      <template #title> Auto Send Email </template>
      <template #content>
        <div class="card-inside">
          <div class="label-container">
            <label for="mail-subject">Mail - Subject</label>
            <InputText id="mail-subject" v-model="mailSubject" />
          </div>
          <div class="label-container">
            <label for="mail-nickname">Mail - Nickname</label>
            <InputText id="mail-nickname" v-model="mailNickname" />
          </div>
          <div class="label-container">
            <label for="mail-recipient">Mail - Recipient</label>
            <InputText id="mail-recipient" v-model="mailRecipient" />
          </div>
          <div class="label-container">
            <label for="mail-greeting">Mail - Greeting</label>
            <InputText id="mail-greeting" v-model="mailGreeting" />
          </div>
          <div class="label-container">
            <label for="mail-content">Mail - Content</label>
            <Textarea
              id="mail-content"
              v-model="mailContent"
              autoResize
              rows="5"
              cols="30"
            />
          </div>
          <div class="label-container">
            <label for="mail-closing">Mail - Closing</label>
            <Textarea
              id="mail-closing"
              v-model="mailClosing"
              autoResize
              rows="4"
              cols="30"
            />
          </div>
          <Button
            label="Send Email"
            variant="outlined"
            :loading="mailSending"
            @click="onSendEmailSubmit"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
