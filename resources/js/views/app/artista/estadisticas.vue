<template>
  <section class="layout">  
    <div class="appPanel">
      <app-panel></app-panel>
    </div>
    <section class="contenidoEstadisticas">
      <h1 class="titulo_estadisticas_h1">Estadísticas de tus canciones</h1>
      
      <div class="tabla_estadisticas">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Reproducciones</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cancion, index) in cancionesOrdenadas" :key="cancion.id">
              <td>{{ index + 1 }}</td>
              <td>{{ cancion.nombre }}</td>
              <td>{{ cancion.reproducciones }}</td>
              <td>{{ cancion.duracion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import AppPanel from '@/layouts/AppPanel.vue';
  import { authStore } from "@/store/auth.js";
  const canciones = ref([]);
  const userPropio = authStore().user;
  const cancionesOrdenadas = computed(() => {
    return [...canciones.value].sort((a, b) => b.reproducciones - a.reproducciones);
  });

  onMounted(async () => {
    try {
      const userID = userPropio.id
      const response = await axios.get(`/api/canciones/usuario/${userID}`);
      canciones.value = response.data;
    } catch (error) {
      console.error('Error al cargar las canciones:', error);
    }
  });
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
    border-right: 2px solid #f472b5;
    border-image: linear-gradient(to bottom, #f472b5, #A855F7) 1;
  }
  .contenidoEstadisticas {
    margin-left: 330px;
    flex: 1;
    padding: 20px;
  }
  .titulo_estadisticas_h1 {
    background: linear-gradient(to right, #F472B6, #A855F7);
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-size: 40px;
  }
  .tabla_estadisticas {
    width: 100%;
    color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  table {
    color: white;
    width: 100%;
    border-collapse: collapse;
    background: linear-gradient(to bottom, #1E1E2E, #16213E);
  }
  thead {
    color: white;
    background: linear-gradient(to right, #F472B6, #A855F7);
  }
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #3C3C3C;
    transition: background-color 0.3s ease;
  }
  tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  th {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  
  @media (width < 500px) {
    .layout {
      flex-direction: column;
      padding-bottom: 100px;
    }
    .appPanel {
      position: relative;
      width: 100%;
      height: auto;
      top: 0;
      left: 0;
      margin: 0;
      border-right: none;
      border-bottom: 2px solid #f472b5;
      border-image: linear-gradient(to right, #f472b5, #A855F7) 1;
      padding: 10px;
      overflow-x: auto;
      z-index: 1;
    }
    .contenidoEstadisticas {
      margin-left: 0;
      margin-top: 20px;
      padding: 10px;
    }
    .titulo_estadisticas_h1 {
      font-size: 30px;
      text-align: center;
    }
    th, td {
      padding: 10px;
      font-size: 14px;
    }
  }
</style>
