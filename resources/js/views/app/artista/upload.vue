<template>
    <section class="">  
      <div class="appPanel">
        <app-panel></app-panel>
      </div>
      <section class="contenidoUpload">
        <h1>Subir Música</h1>
      </section>
    </section>
  </template>
  <script setup>
  import AppPanel from '@/layouts/AppPanel.vue';
  </script>

  <style scoped>
  .layout {
    display: flex;
    width: 100%;
   
  }

  .appPanel {
    margin-top: 20px;
    position: fixed;
    width: 300px;
    height: calc(100vh - 9rem);
    z-index: 999;
    overflow-y: auto;
    user-select: none;
    top: 4.5rem;
    left: 1rem;
    padding: 0.5rem 1.5rem;
  }

  .contenidoUpload{
    margin-left: 330px; 
    flex: 1;
    padding: 20px;
  }
  </style>