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
    volume: 0.2, 
    _mediaListenerActive: false,
    currentPlaylistType: null, 
    currentPlaylistId: null,
    _isLoadingSong: false,
    _lastRegistroTime: null, 
  }),

  actions: {
    async playSong(song, index = null) {

      if (this._isLoadingSong) {
       
        return;
      }
      
      this._isLoadingSong = true;
      
      if (index !== null) {
        this.currentIndex = index;
      }
    
    
    
 
      if (this.currentSong?.id === song.id && this.sound) {
        if (!this.sound.playing()) {
          const currentPosition = this.progress > 0 ? this.progress : 0;
        
          
        
          this.sound.seek(currentPosition);
          this.sound.play();
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
        }
        this._isLoadingSong = false;
        return;
      }
    
   
    
   
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
        
          if (this.isPlaying) {
            this.nextSong();
          }
        },
        onload: () => {
      
          this.duration = this.sound.duration();
          this.sound.play();
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
          
        
          this.registrarUltimoEscuchado();
          this._isLoadingSong = false; e
        },
        onplay: () => {
        
          this.isPlaying = true;
          requestAnimationFrame(this.updateProgress);
        },
        onpause: () => {
          
          const exactPosition = this.sound.seek();
       
          
         
          this.progress = exactPosition;
          this.isPlaying = false;
        },
        onstop: () => {
       
          this.isPlaying = false;
        },
        onerror: () => {
        
          this._isLoadingSong = false;
        }
      });
    
      this._setupMediaListeners();
    },

    
    async registrarUltimoEscuchado() {
      try {
       
        if (this._lastRegistroTime && (Date.now() - this._lastRegistroTime) < 5000) {
        
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
       
      } catch (error) {
       
      }
    },

    togglePlay() {
      if (!this.sound) return;

    

      if (this.sound.playing()) {
      
        const exactPosition = this.sound.seek();
        this.progress = exactPosition;
      
        this.sound.pause();
        this.isPlaying = false;
      } else {
       
      
        
        
        if (this.progress > 0 && this.progress < this.duration) {
          this.sound.seek(this.progress);
        } else {
        
          this.progress = 0;
          this.sound.seek(0);
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
      
          newIndex = Math.floor(Math.random() * this.playlist.length);
        } while (newIndex === this.currentIndex && this.playlist.length > 1);
    
        this.currentIndex = newIndex;
      } else {
        if (this.currentIndex < this.playlist.length - 1) {
          
          this.currentIndex++;
        } else {
          if (this.isLoop) {
           
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
    
    },

    toggleLoop() {
      this.isLoop = !this.isLoop;
      
    },

    updateProgress() {
      if (this.sound && this.sound.playing()) {
     
        this.progress = this.sound.seek();
        requestAnimationFrame(this.updateProgress);
      }
    },

    setSeek(time) {
      if (this.sound) {
 
        const validTime = Math.max(0, Math.min(time, this.duration));
        
      
        this.progress = validTime;
        
       
        this.sound.seek(validTime);
        
        if (!this.isPlaying) {
      
          this.sound.pause();
        } else {
          requestAnimationFrame(this.updateProgress);
        }
      }
    },

    setPlaylist(tracks, playlistType = null, playlistId = null) {
      
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
   
      this.volume = vol;
      
   
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