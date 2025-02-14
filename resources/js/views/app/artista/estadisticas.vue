<template>
    <section class="layout">  
      <div class="appPanel">
        <app-panel></app-panel>
      </div>
      <section class="contenidoEstadisticas">
      <h1 class="titulo_estadisticas_h1">Estadísticas de tus canciones</h1>
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
    border-right: 2px solid #f472b5 ;
    border-image: linear-gradient(to bottom, #f472b5, #A855F7) 1;

  }
  
  .contenidoEstadisticas {
    margin-left: 330px; 
    flex: 1;
    padding: 20px;
  }

  .titulo_estadisticas_h1{
    background: linear-gradient(to right, #F472B6,  #A855F7);
    background-clip: text; 
    color: transparent; 
    display: inline-block;
    font-size: 40px;
  }
  </style>