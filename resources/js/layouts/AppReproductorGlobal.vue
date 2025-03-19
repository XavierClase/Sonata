<template>
    <div class="reproductor">
        <div class="cancion-detalles">
            <div class="cancion-img">
                <img :src="getImageAlbumUrl(player.currentSong)" alt="Portada del álbum">
            </div>
            <p v-if="player.currentSong">{{ player.currentSong.nombre }}</p>
            <p v-else>No hay canción</p>
            <p id="cancion-autor" v-if="player.currentSong">{{ player.currentSong.autor }}</p>
        </div>

        <div class="cancion-acciones">
            <!-- Barra de progreso -->
            <span class="barra-progreso-span">
                <input 
                    type="range" 
                    min="0"
                    :max="player.duration || 1"
                    :value="isDragging ? localProgress : player.progress"
                    @mousedown="startDragging"
                    @mouseup="stopDragging"
                    @input="handleProgressInput"
                    class="barra-progreso"
                />
                <div class="progreso-tiempo">
                    <span>{{ formatTime(isDragging ? localProgress : player.progress) }}</span> 
                    <span>{{ formatTime(player.duration) }}</span>
                </div>
            </span>

            <!-- Controles de reproducción -->
            <div class="controles">
                <button class="cambiar-cancion" @click="player.prevSong">⏮</button>
                <button class="play-button" @click="handlePlayPause">
                    {{ player.isPlaying ? "⏸" : "▶" }}
                </button>
                <button class="cambiar-cancion" @click="player.nextSong">⏭</button>
            </div>

            <!-- Barra de volumen -->
            <span class="barra-volumen-span">
                <i class="pi pi-volume-up"></i>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    v-model="volume" 
                    @input="setVolume"
                    class="barra-volumen"
                />
            </span>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted, onUnmounted } from "vue";
    import { usePlayerStore } from "@/store/player";

    const player = usePlayerStore();
    const volume = ref(0.2);
    const localProgress = ref(0);
    const isDragging = ref(false);

    function getImageAlbumUrl(song) {
        return song?.portada ? song.portada : "/images/placeholder.jpg"; 
    }

    function handlePlayPause() {
        player.togglePlay();
    }

    function updateVolumeStyle() {
        const volumePercent = volume.value * 100;
        const volumeBar = document.querySelector('.barra-volumen');
        if (volumeBar) {
            volumeBar.style.setProperty('--volume-percent', `${volumePercent}%`);
        }
    }

    function setVolume() {
        if (player.sound) {
            player.sound.volume(volume.value);
            updateVolumeStyle();
        }
    }

    function startDragging() {
        localProgress.value = player.progress;
        isDragging.value = true;
    }

    function stopDragging() {
        if (isDragging.value) {
            player.setSeek(localProgress.value);
            isDragging.value = false;
        }
    }

    function handleProgressInput(event) {
        if (isDragging.value) {
            localProgress.value = parseFloat(event.target.value);
        }
    }

    function formatTime(value) {
        if (!value || isNaN(value)) return "0:00";
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    function updateProgressBar() {
        const progressBar = document.querySelector('.barra-progreso');
        if (progressBar) {
            const percent = (player.progress / (player.duration || 1)) * 100;
            progressBar.style.setProperty('--progress-percent', `${percent}%`);
        }
    }

    // Vigilar cambios en el progreso de reproducción
    watch(() => player.progress, () => {
        if (!isDragging.value) {
            updateProgressBar();
        }
    });

    // Vigilar cambios en el volumen
    watch(() => volume.value, () => {
        updateVolumeStyle();
    });

    // Vigilar cambios en el estado de reproducción
    watch(() => player.isPlaying, () => {
        // Puede actualizarse desde controles externos como Windows
        updateProgressBar();
    });

    // Vigilar cambios en la canción actual
    watch(() => player.currentSong, () => {
        if (player.sound && player.currentSong) {
            player.sound.volume(volume.value);
        }
    });

    onMounted(() => {
        // Inicializar volumen si ya hay una canción cargada
        if (player.sound) {
            player.sound.volume(volume.value);
        }
        updateVolumeStyle();
        window.addEventListener('mouseup', stopDragging);
        
        // Verificar que el componente se actualice si cambia el estado externamente
        setInterval(() => {
            if (player.sound && player.sound.playing() !== player.isPlaying) {
                player.isPlaying = player.sound.playing();
            }
        }, 1000);
    });

    onUnmounted(() => {
        window.removeEventListener('mouseup', stopDragging);
    });
</script>


<style scoped>
    .reproductor {
        width: 74%;
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cancion-detalles {
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cancion-img {
        width: 100%;
        position: relative;
        padding-top: 100%; 
        overflow: hidden;
        border-radius: 15px;
    }

    .cancion-img img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cancion-detalles p {
        font-size: 1.8rem;
        color: white;
        font-weight: bold;
        margin: 0 !important;
        padding: 0 !important;
        margin-top: 20px !important;
    }

    #cancion-autor {
        margin: 0 !important;
        font-size: 1rem;
        font-weight: normal;
        color: rgba(255, 255, 255, 0.645);
    }

    .cancion-acciones {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 30px;
    }

    .controles {
        display: flex;
        flex-direction: row;
        gap: 40px;
    }

    .cambiar-cancion {
        background-color: transparent;
        border: none;
        font-size: 3rem;
        color: #F472B6;
    }

    /* ----- ESTILOS PARA LA BARRA DE PROGRESO ----- */

    .barra-progreso-span {
        display: flex;
        flex-direction: column;
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .progreso-tiempo {
        color: white;
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .barra-progreso {
        width: 100%;
        margin-top: 10px;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        outline: none;
        cursor: pointer;
        border-radius: 4px;
        background: rgba(55, 48, 163, 0.47); 
    }

    .barra-progreso::-webkit-slider-runnable-track {
        background: linear-gradient(to right, #ff3399 0%, #ff3399 var(--progress-percent, 0%), rgba(55, 48, 163, 0.47) var(--progress-percent, 0%));
        border-radius: 4px;
        height: 6px;
    }

    .barra-progreso::-moz-range-track {
        background: linear-gradient(to right, #ff3399 0%, #ff3399 var(--progress-percent, 0%), rgba(55, 48, 163, 0.47) var(--progress-percent, 0%));
        border-radius: 4px;
        height: 6px;
    }

    .barra-progreso::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 0;
        height: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .barra-progreso::-moz-range-thumb {
        width: 0;
        height: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .barra-progreso:hover::-webkit-slider-thumb {
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-radius: 50%;
        margin-top: -2.5px;
    }

    .barra-progreso:hover::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-radius: 50%;
        border: none;
    }

    /* ----- ESTILOS PARA LA BARRA DE VOLUMEN ----- */
    .barra-volumen-span {
        width: 44%;
        display: flex;
        position: relative;
        top: 15px;
        right: 6px;
    }

    .barra-volumen-span i {
        position: relative;
        top: 13px;
        right: 10px;
        font-size: 1.3rem;
        color: #F472B6;
    }

    .barra-volumen {
        width: 100%;
        margin-top: 20px;
        height: 5px;
        -webkit-appearance: none;
        appearance: none;
        outline: none;
        cursor: pointer;
        background: rgba(55, 48, 163, 0.47);
    }

    .barra-volumen::-webkit-slider-runnable-track {
        background: linear-gradient(to right, #ff3399 0%, #ff3399 var(--volume-percent, 50%), rgba(55, 48, 163, 0.47) var(--volume-percent, 50%));
        height: 5px;
    }

    .barra-volumen::-moz-range-track {
        background: linear-gradient(to right, #ff3399 0%, #ff3399 var(--volume-percent, 50%), rgba(55, 48, 163, 0.47) var(--volume-percent, 50%));
        height: 5px;
    }

    .barra-volumen::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 0;
        height: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .barra-volumen::-moz-range-thumb {
        width: 0;
        height: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .barra-volumen:hover::-webkit-slider-thumb {
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-radius: 50%;
        margin-top: -2.5px;
    }

    .barra-volumen:hover::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-radius: 50%;
        border: none;
    }

    .play-button {
        background: linear-gradient(to right, #A855F7, #FF2A86);
        border: none;
        height: 70px;
        width: 70px;
        border-radius: 50px;
        font-size: 2.3rem;
    }

    
</style>