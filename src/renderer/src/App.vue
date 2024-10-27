<script setup lang="ts">
import { ref, watch } from 'vue';

const isFullScreen = ref(false);
const isMinimized = ref(false);

// Track file paths or names for opened files to save them without prompt
const tabFileNames = ref<Array<string | null>>([null]); // Initially null for unnamed files

// Function to download file content from the active tab's textarea
const downloadFile = () => {
  if (tab.value !== null) {
    const content = tabContents.value[tab.value];
    const fileName = tabFileNames.value[tab.value] || `${tabNames.value[tab.value]}.kdko`; // Use original name or default

    const file = new Blob([content], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
};

// Function to toggle fullscreen mode
const toggleFullScreen = () => {
  isMinimized.value = false;
  isFullScreen.value = !isFullScreen.value;
};

// Function to close the window
const closeWindow = () => {
  window.close();
};

// Define reactive properties for tabs
const tabNames = ref<string[]>(['Untitled 1']); // Initialize with one tab
const tabContents = ref<string[]>(['']); // Content for each tab
const tab = ref<number | null>(0); // Start with the first tab

// Watch for changes in `tabNames` and update `tab` accordingly
watch(tabNames, (val) => {
  tab.value = val.length > 0 ? 0 : null; // Set active tab to first or null if no tabs
});

// Function to add a new empty tab
const addTab = () => {
  const newIndex = tabNames.value.length + 1;
  tabNames.value.push(`Untitled ${newIndex}`);
  tabContents.value.push(''); // Initialize with empty content for the new tab
  tabFileNames.value.push(null); // Initialize with null for unnamed files
  tab.value = tabNames.value.length - 1; // Set the active tab to the new tab
};

// Function to remove a tab by its index
const removeTab = (index: number) => {
  if (index >= 0 && index < tabNames.value.length) {
    tabNames.value.splice(index, 1);
    tabContents.value.splice(index, 1);
    tabFileNames.value.splice(index, 1);
    tab.value = tabNames.value.length > 0 ? Math.min(tab.value!, tabNames.value.length - 1) : null;
  }
};

// Function to open a file and create a new tab with its content
const openFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      tabNames.value.push(file.name); // Add new tab with file's name
      tabContents.value.push(reader.result as string); // Populate tab with file's content
      tabFileNames.value.push(file.name); // Track file's name for saving
      tab.value = tabNames.value.length - 1; // Set new tab as active
    };
    reader.readAsText(file);
  }
};

// Function to save the current file (with original name if it exists)
const saveFile = () => {
  if (tab.value !== null && tabFileNames.value[tab.value]) {
    downloadFile(); // Save directly using the file’s name
  } else {
    downloadFile(); // Use standard download process
  }
};
</script>

<template>
  <div class="header">
    <div class="column"></div>
    <div class="column" style="justify-content: center;">
      Kodoko IDE
    </div>
    <div class="column" style="justify-content: right;">
      <button class="button">| Minimize |</button>
      <button class="button" @click="toggleFullScreen">{{ isFullScreen ? '| Restore |' : '| ResDown |' }}</button>
      <button class="button" @click="closeWindow">| Close |</button>
    </div>
  </div>
  <div style="background-color: #1A1918; height: 32px; width: 100vw;">
    <v-card>
      <v-tabs v-model="tab" bg-color="#1A1918" style="height: 32px;">
        <v-tab v-for="(name, index) in tabNames" :key="index" :value="index" base-color="green" style="height: 32px; background-color: #28292C; border-radius: 8px 8px 0px 0px;">
          <input
            type="text"
            v-model="tabNames[index]"
            :placeholder="`Untitled ${index + 1}`"
            style="width: 100%; background-color: transparent; border: none; color: white;"
          />
          <button @click="removeTab(index)" style="margin-left: 8px; color: red;">×</button>
        </v-tab>
        <div style="position: absolute; right: 0; height: 32px;">
          <button @click="saveFile">| Save File |</button>
          <!-- File input button to open a file -->
          <input type="file" @change="openFile" accept=".kdko,.txt" style="display: none;" ref="fileInput">
          <button @click="$refs.fileInput.click()">| Open File |</button>
          <v-btn variant="text" @click="addTab">| + |</v-btn>
        </div>
      </v-tabs>
    </v-card>
  </div>
  
  <!-- Textarea for the active tab's content -->
  <textarea
    v-if="tab !== null"
    v-model="tabContents[tab]"
    class="custom-textarea"
    spellcheck="false"
    autocorrect="off"
    autocapitalize="off"
  ></textarea>
</template>

<style scoped>
.button {
  height: 32px;
  border-color: white;
}

.custom-textarea {
  background-color: #28292C;
  border: 1px solid #28292C;
  color: white;
  width: 100vw;
  height: 1200px;
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
</style>
