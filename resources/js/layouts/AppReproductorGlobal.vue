<template>
    <div id="app-reproductor-global">

        <audio :src="cancionSeleccionada" controls></audio>
        
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const cancionSeleccionada = ref(null);
  
  onMounted(() => {
      window.addEventListener('cancionSeleccionada', (event) => {
          cancionSeleccionada.value = event.detail; 
      });
  });
  </script>
  