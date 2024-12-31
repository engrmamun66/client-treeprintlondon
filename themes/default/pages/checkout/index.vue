<template>
  <div>
    <button @click="startTimer">Start Timer</button>
    <button @click="stopTimer">Stop Timer</button>
    <p>Elapsed Time: {{ formattedElapsedTime }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const timer = ref(null);
const elapsedTime = ref(0);

const formattedElapsedTime = computed(() => {
  const minutes = String(Math.floor(elapsedTime.value / 60)).padStart(2, "0");
  const seconds = String(elapsedTime.value % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
});

const updateElapsedTime = () => {
  elapsedTime.value++;
  localStorage.setItem("elapsedTime", elapsedTime.value);
};

definePageMeta({
  keepalive: false,
  middleware: ["auth"],
  key: (route) => route.fullPath,
});

const startTimer = () => {
  if (!timer.value) {
    elapsedTime.value = 0;
    localStorage.setItem("elapsedTime", elapsedTime.value);
    timer.value = setInterval(updateElapsedTime, 1000);
  }
};

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
    elapsedTime.value = 0;
    localStorage.setItem("elapsedTime", elapsedTime.value);
  }
};

onMounted(() => {
  const savedTime = localStorage.getItem("elapsedTime");
  if (savedTime) {
    elapsedTime.value = parseInt(savedTime, 10);
  }
  timer.value = setInterval(updateElapsedTime, 1000);
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style>
/* Add your styles here */
</style>
