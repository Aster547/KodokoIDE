<script setup lang="ts">
import { ref } from 'vue';

const isFullScreen = ref(false);
const isMinimized = ref(false);

const downloadFile = () => {
  const content = document.querySelector("textarea")?.value || '';
  const file = new Blob([content], { type: 'text/plain' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "untitled.kdko";
  link.click();
  URL.revokeObjectURL(link.href);
};


const toggleFullScreen = () => {
  isMinimized.value = false;
  isFullScreen.value = !isFullScreen.value;
};

const closeWindow = () => {
  window.close();
};
</script>

<template>
  <div class="header">
    <div class="column">
      <!-- Placeholder for any additional content if needed -->
    </div>
    <div class="column" style="justify-content: center;">
      Kodoko IDE
    </div>
    <div class="column" style="justify-content: right;">
      <button class="button">Minimize</button>
      <button class="button" @click="toggleFullScreen">{{ isFullScreen ? 'Restore' : 'ResDown' }}</button>
      <button class="button" @click="closeWindow">Close</button>
    </div>
  </div>
  <textarea class="custom-textarea" spellcheck="false" autocorrect="off" autocapitalize="off"></textarea>
  <br/>
  <button @click="downloadFile">Save File</button>
</template>

<head>
</head>

<style scoped>
.button {
  height: 32px;
}

.custom-textarea {
  background-color: #28292C;
  border: 1px solid #28292C;
  color: white;
  width: 100vw;
  height: 90vh;
  resize: none;
  outline: none;
  padding: 16px;
  font-size: large;
}

.header {
  background-color: black;
  height: 32px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

.column {
  flex: 1;
  display: flex;
}

.content {
  background-color: #1A1918;
  height: calc(100vh - 64px); /* Adjust based on header height */
  width: 100vw;
  overflow: hidden;
}

.fullscreen {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.custom-textarea:focus {
  border: none;
}
</style>