import { defineStore } from "pinia";
import { Howl, Howler } from "howler";

export const usePlayerStore = defineStore("player", {
    state: () => ({
        playlist: [], 
        currentIndex: 0, 
        currentSong: null,
        isPlaying: false,
        sound: null,
        progress: 0,
        duration: 0,
        _mediaListenerActive: false
    }),
    actions: {
        async playSong(song, index = null) {
            if (index !== null) {
                this.currentIndex = index;
            }
        
            console.log("🎵 Intentando reproducir:", song.id);
        
            // 🔹 Si la canción es la misma y ya hay un `Howl`, solo reanudar
            if (this.currentSong?.id === song.id && this.sound) {
                console.log("▶ Reanudando en:", this.sound.seek());
                if (!this.sound.playing()) {
                    this.sound.play();
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                }
                return;
            }
        
            console.log("🔄 Cargando nueva canción...");
        
            // 🛑 Solo eliminar `sound` si la canción realmente cambió
            if (this.sound && this.currentSong?.id !== song.id) {
                console.log("🗑 Eliminando sonido anterior.");
                this.sound.unload();
                this.sound = null;
            }
        
            this.progress = 0;
            this.currentSong = song;
            this.sound = new Howl({
                src: [song.archivo],
                html5: true,
                onend: () => this.nextSong(),
                onload: () => {
                    console.log("✅ Canción cargada:", song.id);
                    this.duration = this.sound.duration();
                    this.sound.play();
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                },
                onplay: () => {
                    console.log("▶ En reproducción:", song.id);
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                },
                onpause: () => console.log("⏸ Pausada"),
                onstop: () => console.log("⏹ Detenida"),
            });
        
            this._setupMediaListeners();
        },
        
        
        
        

        _setupMediaListeners() {
            // Eliminar listeners anteriores si existían
            if (this._mediaListenerActive) return;
            
            // Función para sincronizar con controles multimedia
            const syncMediaState = () => {
                if (this.sound) {
                    const isActuallyPlaying = this.sound.playing();
                    if (this.isPlaying !== isActuallyPlaying) {
                        this.isPlaying = isActuallyPlaying;
                    }
                }
            };
            
            // Sincronizar cada segundo
            setInterval(syncMediaState, 1000);
            
            // Marcar como activo
            this._mediaListenerActive = true;
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
                console.log("⏸ Pausando en:", this.sound.seek());
                this.sound.pause();
                this.isPlaying = false;
            } else {
                console.log("▶ Reanudando en:", this.sound.seek());
                this.sound.play();
                this.isPlaying = true;
                requestAnimationFrame(this.updateProgress);
            }
        },
        

        nextSong() {
            if (this.currentIndex < this.playlist.length - 1) {
                this.currentIndex++;
                this.playSong(this.playlist[this.currentIndex]);
            } else {
                if (this.sound) {
                    this.sound.stop();
                }
                this.isPlaying = false;
            }
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
                
                // Si estaba pausado y movemos la barra, mantenemos el estado pausado
                if (!this.isPlaying) {
                    this.sound.pause();
                } else {
                    requestAnimationFrame(this.updateProgress);
                }
            }
        },

        setPlaylist(tracks) {
            this.playlist = tracks;
            this.currentIndex = 0;
            if (tracks.length) this.playSong(tracks[0]);
        },

        playQueue(songs) {
            this.setPlaylist(songs);
        },

        async sumarReproduccion(songId) {
            try {
                await axios.post(`/api/reproducciones/${songId}`);
            } catch (error) {
                console.error('Error al sumar reproducción:', error);
            }
        },
    },
});