<template>
    <section class="layout">  
      <div class="appPanel">
        <app-panel></app-panel>
      </div>
      <section class="contenido_edit">
        <h1 class="titulo_albums" >Tus Álbums</h1>
        <h2 class="color_texto" >Selecciona álbum:</h2>
        <img>
      </section>
    </section>
  </template>
  <script setup>
  import { authStore } from "@/store/auth.js";
  import AppPanel from '@/layouts/AppPanel.vue';
  const user = authStore().user;
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

  .contenido_edit{
    margin-left: 330px; 
    flex: 1;
    padding: 20px;
  }

  
  .titulo_albums{
    background: linear-gradient(to right, #F472B6,  #A855F7);
    background-clip: text; 
    color: transparent; 
    display: inline-block;
    font-size: 40px;
  }

  .color_texto{
    color:white;
  }
  </style>