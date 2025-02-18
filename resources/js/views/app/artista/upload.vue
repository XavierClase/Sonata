<template>
    <section class="layout">  
      <div class="appPanel">
        <app-panel></app-panel>
      </div>
      <section class="contenidoUpload">
        <h1 class="titulo_subir_musica">Subir Música</h1>
            <form @submit.prevent="submitForm">
                <!--Falta añadir la subida de imagen:-->
                <input placeholder="nombre del album"> 
                <p class="color_texto">Artista: {{ user?.name }}</p>  
                <select>
                    <option>Album</option>
                    <option>Sencillo</option>
                    <option>Ep</option>
                </select>   

                <label class="color_texto">Añadir Cancion</label>

                <!--y aqui falta añadir la subida de archivo (cancion)-->
               <button type="submit">Confirmar</button>
            </form>
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

  .contenidoUpload{
    margin-left: 330px; 
    flex: 1;
    padding: 20px;
  }

  .titulo_subir_musica{
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