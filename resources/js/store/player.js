import { defineStore } from "pinia";
import { Howl } from "howler";

export const usePlayerStore = defineStore("player", {
    state: () => ({
        currentSong: null,
        isPlaying: false,
        sound: null,
        progress: 0,
        duration: 0,
    }),
    actions: {
        playSong(song) {
            if (this.sound) {
                this.sound.stop();
            }
            this.currentSong = song;

            this.sound = new Howl({
                src: [song.archivo],
                html5: true,
                onend: () => {
                    this.isPlaying = false;
                    this.progress = 0;
                },
                onload: () => {
                    this.duration = this.sound.duration();
                },
                onplay: () => {
                    requestAnimationFrame(this.updateProgress);
                }
            });

            this.sound.play();
            this.isPlaying = true;
        },
        togglePlay() {
            if (this.sound) {
                if (this.isPlaying) {
                    this.sound.pause();
                } else {
                    this.sound.play();
                    requestAnimationFrame(this.updateProgress);
                }
                this.isPlaying = !this.isPlaying;
            }
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
        }
    },
});
