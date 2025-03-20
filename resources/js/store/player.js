import { defineStore } from "pinia";
import { Howl } from "howler";

export const usePlayerStore = defineStore("player", {
    state: () => ({
        playlist: [],
        currentIndex: 0,
        currentSong: null,
        isPlaying: false,
        sound: null,
        progress: 0,
        duration: 0,
        isShuffle: false,
        isLoop: false,
        _mediaListenerActive: false
    }),

    actions: {
        async playSong(song, index = null) {
            if (index !== null) {
                this.currentIndex = index;
            }

            console.log("🎵 Intentando reproducir:", song.id);

            //  Si es la misma canción y el sonido ya existe, solo reanudar
            if (this.currentSong?.id === song.id && this.sound) {
                if (!this.sound.playing()) {
                    console.log(" Reanudando en:", this.sound.seek());
                    this.sound.play();
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                }
                return;
            }

            console.log("🔄 Cargando nueva canción...");

            if (this.sound) {
                this.sound.unload();
            }

            this.progress = 0;
            this.currentSong = song;
            this.sound = new Howl({
                src: [song.archivo],
                html5: true,
                onend: () => this.nextSong(),
                onload: () => {
                    console.log(" Canción cargada:", song.id);
                    this.duration = this.sound.duration();
                    this.sound.play();
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                },
                onplay: async () => {
                    console.log(" En reproducción:", song.id);
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                },
                onpause: () => console.log(" Pausada"),
                onstop: () => console.log(" Detenida"),
            });

            this._setupMediaListeners();
        },

        togglePlay() {
            if (!this.sound) return;

            console.log("🎵 Estado actual:", {
                isPlaying: this.isPlaying,
                soundExists: !!this.sound,
                soundPlaying: this.sound.playing(),
                currentSeek: this.sound.seek(),
            });

            if (this.sound.playing()) {
                console.log(" Pausando en:", this.sound.seek());
                this.sound.pause();
                this.isPlaying = false;
            } else {
                console.log(" Reanudando en:", this.sound.seek());
                this.sound.play();
                this.isPlaying = true;
                requestAnimationFrame(this.updateProgress);
            }
        },

        nextSong() {
            if (!this.playlist.length) return;
        
            if (this.isShuffle) {
                let newIndex;
                do {
                    console.log("Canción aleatoria");
                    newIndex = Math.floor(Math.random() * this.playlist.length);
                } while (newIndex === this.currentIndex);
        
                this.currentIndex = newIndex;
            } else {
                if (this.currentIndex < this.playlist.length - 1) {
                    console.log("Canción siguiente");
                    this.currentIndex++;
                } else {
                    if (this.isLoop) {
                        console.log("🔄 Reiniciando playlist...");
                        this.currentIndex = 0; // Volver a la primera canción
                    } else {
                        if (this.sound) this.sound.stop();
                        this.isPlaying = false;
                        return;
                    }
                }
            }
        
            this.playSong(this.playlist[this.currentIndex]);
        },

        prevSong() {
            if (this.sound && this.sound.seek() > 3) {
                this.sound.seek(0);
                return;
            }
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.playSong(this.playlist[this.currentIndex]);
            }
        },

        toggleShuffle() {
            this.isShuffle = !this.isShuffle;
            console.log(" Modo aleatorio:", this.isShuffle ? "Activado" : "Desactivado");
        },

        toggleLoop() {
            this.isLoop = !this.isLoop;
            console.log(" Modo bucle:", this.isLoop ? "Activado" : "Desactivado");
        },

        updateProgress() {
            if (this.sound && this.sound.playing()) {
                this.progress = this.sound.seek();
                requestAnimationFrame(this.updateProgress);
            }
        },

        setSeek(time) {
            if (this.sound) {
                this.sound.seek(time);
                this.progress = time;
                if (!this.isPlaying) this.sound.pause();
                else requestAnimationFrame(this.updateProgress);
            }
        },

        setPlaylist(tracks) {
            this.playlist = tracks;
            this.currentIndex = 0;
        
            if (tracks.length && !this.sound) {
                this.playSong(tracks[0]);  
            }
        },
    },
});
