import { defineStore } from "pinia";
import { Howl } from "howler";
import axios from "axios";

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
    volume: 0.2, // Mantener un estado de volumen consistente
    _mediaListenerActive: false,
    currentPlaylistType: null, // 'album' o 'lista'
    currentPlaylistId: null,
    _isLoadingSong: false, //  controlar carga
    _lastRegistroTime: null, // controlar tiempo entre registros
  }),

  actions: {
    async playSong(song, index = null) {

      if (this._isLoadingSong) {
        console.log("⚠️ Evitando carga repetida de canción");
        return;
      }
      
      this._isLoadingSong = true;
      
      if (index !== null) {
        this.currentIndex = index;
      }
    
      console.log("🎵 Intentando reproducir:", song.id);
    
 
      if (this.currentSong?.id === song.id && this.sound) {
        if (!this.sound.playing()) {
          const currentPosition = this.progress > 0 ? this.progress : 0;
          console.log(" Reanudando en:", currentPosition);
          
        
          this.sound.seek(currentPosition);
          this.sound.play();
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
        }
        this._isLoadingSong = false;
        return;
      }
    
      console.log("🔄 Cargando nueva canción...");
    
   
      const currentVolume = this.sound ? this.sound.volume() : this.volume;
    
     
      if (this.sound) {
        this.sound.off(); 
        this.sound.stop();
        this.sound.unload();
        this.sound = null;
      }
    
      this.progress = 0;
      this.currentSong = song;
      
      this.sound = new Howl({
        src: [song.archivo],
        html5: true,
        volume: currentVolume,
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
          
        
          this.registrarUltimoEscuchado();
          this._isLoadingSong = false; e
        },
        onplay: () => {
          console.log(" En reproducción:", song.id);
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
        },
        onpause: () => {
          
          const exactPosition = this.sound.seek();
          console.log(" Pausada en:", exactPosition);
          
         
          this.progress = exactPosition;
          this.isPlaying = false;
        },
        onstop: () => {
          console.log(" Detenida");
          this.isPlaying = false;
        },
        onerror: () => {
          console.error("Error al cargar la canción");
          this._isLoadingSong = false;
        }
      });
    
      this._setupMediaListeners();
    },

    
    async registrarUltimoEscuchado() {
      try {
       
        if (this._lastRegistroTime && (Date.now() - this._lastRegistroTime) < 5000) {
          console.log("⏱️ Evitando registro duplicado (muy seguido)");
          return;
        }
        
        const payload = {};
        
        if (this.currentPlaylistType && this.currentPlaylistId) {
          if (this.currentPlaylistType === 'album') {
            payload.id_album = this.currentPlaylistId; 
          } else if (this.currentPlaylistType === 'lista') {
            payload.id_lista = this.currentPlaylistId; 
          }
        } 
        else if (this.currentSong?.album_id) {
          payload.id_album = this.currentSong.album_id;
        }
        else {
          return;
        }
        
        this._lastRegistroTime = Date.now();
        await axios.post('/api/ultimo_escuchado', payload);
        console.log('✅ Registrado:', payload);
      } catch (error) {
        console.error('Error al registrar:', error);
      }
    },

    togglePlay() {
      if (!this.sound) return;

      console.log("🎵 Estado actual:", {
        isPlaying: this.isPlaying,
        soundExists: !!this.sound,
        soundPlaying: this.sound.playing(),
        currentSeek: this.sound.seek(),
        storedProgress: this.progress
      });

      if (this.sound.playing()) {
        // Guardar posición antes de pausar
        const exactPosition = this.sound.seek();
        this.progress = exactPosition;
        console.log(" Pausando en:", exactPosition);
        this.sound.pause();
        this.isPlaying = false;
      } else {
        // Al reanudar, usar la posición guardada de manera explícita
        console.log(" Reanudando desde:", this.progress);
        
        // CLAVE: Primero hacer seek, luego reproducir
        // Verificamos si this.progress es válido
        if (this.progress > 0 && this.progress < this.duration) {
          this.sound.seek(this.progress);
        } else {
          // Si no es válido, iniciamos desde 0
          this.progress = 0;
          this.sound.seek(0);
        }
        
        // Ahora reproducimos
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
        } while (newIndex === this.currentIndex && this.playlist.length > 1);
    
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
        // Actualizar progress solo si estamos reproduciendo
        this.progress = this.sound.seek();
        requestAnimationFrame(this.updateProgress);
      }
    },

    setSeek(time) {
      if (this.sound) {
        // Aseguramos que time sea un valor válido dentro del rango de la canción
        const validTime = Math.max(0, Math.min(time, this.duration));
        
        // Almacenamos el valor en el estado antes de aplicarlo
        this.progress = validTime;
        
        // Aplicamos el seek al audio
        this.sound.seek(validTime);
        
        if (!this.isPlaying) {
          // Si está pausado, mantener el estado de pausa
          this.sound.pause();
        } else {
          requestAnimationFrame(this.updateProgress);
        }
      }
    },

    setPlaylist(tracks, playlistType = null, playlistId = null) {
      // Comparación profunda para evitar actualizaciones innecesarias
      if (JSON.stringify(this.playlist) !== JSON.stringify(tracks)) {
        this.playlist = [...tracks];
        this.currentIndex = 0;
      }
      
      this.currentPlaylistType = playlistType;
      this.currentPlaylistId = playlistId;
      
      if (tracks.length && !this.sound) {
        this.playSong(tracks[0]);
      }
    },

    setVolume(vol) {
      // Guardamos el valor en el estado
      this.volume = vol;
      
      // Si hay un sonido activo, aplicamos el volumen
      if (this.sound) {
        this.sound.volume(vol);
      }
    },

    _setupMediaListeners() {
      if (this._mediaListenerActive) return;
      
     
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