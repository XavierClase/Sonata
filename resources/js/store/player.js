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

      // Si es la misma canción y el sonido ya existe, solo reanudar
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

      // Limpiar el reproductor anterior completamente
      if (this.sound) {
        this.sound.off(); // Eliminar todos los listeners
        this.sound.stop();
        this.sound.unload();
        this.sound = null;
      }

      this.progress = 0;
      this.currentSong = song;
      
      this.sound = new Howl({
        src: [song.archivo],
        html5: true,
        onend: () => {
          console.log('Evento onend disparado', {
            isPlaying: this.isPlaying,
            currentTime: this.sound?.seek(),
            duration: this.sound?.duration()
          });
          if (this.isPlaying) {
            this.nextSong();
          }
        },
        onload: () => {
          console.log(" Canción cargada:", song.id);
          this.duration = this.sound.duration();
          this.sound.play();
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
        },
        onplay: () => {
          console.log(" En reproducción:", song.id);
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
        },
        onpause: () => {
          console.log(" Pausada en:", this.sound.seek());
          this.isPlaying = false;
        },
        onstop: () => {
          console.log(" Detenida");
          this.isPlaying = false;
        },
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
        this.progress = this.sound.seek(); // Guardar posición actual
        this.sound.pause();
        this.isPlaying = false;
      } else {
        console.log(" Reanudando desde:", this.progress);
        
        // Asegurar que se reanude desde la posición correcta
        if (this.progress > 0) {
          this.sound.seek(this.progress);
        }
        
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
            this.currentIndex = 0;
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
        if (!this.isPlaying) {
          this.sound.pause();
        } else {
          requestAnimationFrame(this.updateProgress);
        }
      }
    },

    setPlaylist(tracks) {
      // Comparación profunda para evitar actualizaciones innecesarias
      if (JSON.stringify(this.playlist) !== JSON.stringify(tracks)) {
        this.playlist = [...tracks]; // Crear nueva copia
        this.currentIndex = 0;
      }
      
      if (tracks.length && !this.sound) {
        this.playSong(tracks[0]);
      }
    },

    _setupMediaListeners() {
      if (this._mediaListenerActive) return;
      
      // Listener para teclas de medios físicas
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
          this.togglePlay();
        });
        
        navigator.mediaSession.setActionHandler('pause', () => {
          this.togglePlay();
        });
        
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          this.prevSong();
        });
        
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          this.nextSong();
        });
        
        this._mediaListenerActive = true;
      }
    }
  }
});