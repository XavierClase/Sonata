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

        <div class="cancion-acciones" v-if="player.currentSong">

            <!-- Barra de progreso -->
            <input 
                type="range" 
                v-model="progress"
                :max="player.duration"
                @input="setSeek(progress)"
                class="barra-progreso"
            />
            <div class="progreso-tiempo">
                <span>{{ formatTime(progress) }}</span> / <span>{{ formatTime(player.duration) }}</span>
            </div>


            <button class="play-button" @click="player.togglePlay">
                {{ player.isPlaying ? "⏸" : "▶" }}
            </button>

            

            <!-- Barra de volumen -->
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                v-model="volume" 
                @input="setVolume"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from "vue";
    import { usePlayerStore } from "@/store/player";

    const player = usePlayerStore();
    const volume = ref(1); 
    const progress = ref(0);

    function getImageAlbumUrl(song) {
        return song?.portada ? song.portada : "/images/placeholder.jpg"; 
    }

    function setVolume() {
        if (player.sound) {
            player.sound.volume(volume.value);
        }
    }

    watch(() => player.currentSong, () => {
        if (player.sound) {
            player.sound.volume(volume.value);
        }
    });

    function formatTime(value) {
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    watch(() => player.progress, (newProgress) => {
        progress.value = newProgress;
    });

    function setSeek(time) {
        player.setSeek(time);
    }
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
    
    .barra-progreso {
        width: 80%;
        margin-top: 10px;
        height: 5px;
        background: #3730A3;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
    }

    .play-button {
        background: linear-gradient(to right,#A855F7, #FF2A86);
        border: none;
        height: 70px;
        width: 70px;
        border-radius: 50px;
        font-size: 2.3rem;
    }


    .progreso-tiempo {
        color: white;
        margin-top: 10px;
    }
</style>
