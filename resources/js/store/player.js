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
    }),
    actions: {
        async playSong(song, index = null) {
            // If an index is provided, update the current index
            if (index !== null) {
                this.currentIndex = index;
            }

            // Check if we're trying to play the same song that's already loaded
            if (this.currentSong?.id === song.id && this.sound) {
                // If the song is already loaded but not playing, just play it
                if (!this.isPlaying) {
                    this.sound.play();
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                }
                return;
            }

            // Unload previous sound if it exists
            if (this.sound) {
                this.sound.unload();
            }

            // Reset progress when starting a new song
            this.progress = 0;
            this.currentSong = song;
            
            // Create a new Howl instance for the song
            this.sound = new Howl({
                src: [song.archivo],
                html5: true,
                onend: () => {
                    this.nextSong();
                },
                onload: () => {
                    this.duration = this.sound.duration();
                    this.sound.play();
                    this.isPlaying = true;
                    requestAnimationFrame(this.updateProgress);
                },
                onplay: async () => {
                    await this.sumarReproduccion(song.id);
                    requestAnimationFrame(this.updateProgress);
                }
            });
        },

        togglePlay() {
            if (!this.sound) return;
            
            if (this.isPlaying) {
                this.sound.pause();
                this.isPlaying = false;
            } else {
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
                // Reset player if we're at the end of the playlist
                if (this.sound) {
                    this.sound.stop();
                }
                this.isPlaying = false; 
            }
        },

        prevSong() {
            // If we're more than 3 seconds into the song, restart it
            if (this.sound && this.sound.seek() > 3) {
                this.sound.seek(0);
                return;
            }
            
            // Otherwise go to previous song
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.playSong(this.playlist[this.currentIndex]);
            }
        },

        setPlaylist(tracks) {
            this.playlist = tracks;
            this.currentIndex = 0;
            if (tracks.length) this.playSong(tracks[0]);
        },

        updateProgress() {
            if (this.sound && this.isPlaying) {
                this.progress = this.sound.seek();
                requestAnimationFrame(this.updateProgress);
            }
        },

        setSeek(time) {
            if (this.sound) {
                this.sound.seek(time);
                this.progress = time;
            }
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