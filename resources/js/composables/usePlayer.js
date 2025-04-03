// src/composables/usePlayer.js
import { computed } from 'vue';
import { usePlayerStore } from "@/store/player";

export function usePlayer() {
    const player = usePlayerStore();

    const isPlaying = computed(() => player.isPlaying);
    const currentSong = computed(() => player.currentSong);
    const currentPlaylist = computed(() => player.playlist);

    /**
     * Reproduce una lista de canciones (álbum, playlist, etc.)
     * @param {Array} songs - Lista de canciones
     * @param {Boolean} forceRestart - Forzar reinicio incluso si es la misma lista
     */
    const playPlaylist = (songs, forceRestart = false) => {
        if (!songs?.length) return;

        const isSamePlaylist = JSON.stringify(player.playlist) === JSON.stringify(songs);
        
        if (isSamePlaylist && player.isPlaying && !forceRestart) {
            player.togglePlay(); // Pausar si ya está reproduciendo
        } else {
            player.setPlaylist([...songs]);
            player.playSong(songs[0], 0);
        }
    };

    /**
     * Reproduce una canción específica dentro de una lista
     * @param {Object} song - Canción a reproducir
     * @param {Array} playlist - Lista de canciones (opcional, usa la actual si no se provee)
     */
    const playSong = (song, playlist = null) => {
        if (playlist) {
            const playlistChanged = JSON.stringify(player.playlist) !== JSON.stringify(playlist);
            if (playlistChanged) {
                player.setPlaylist([...playlist]);
            }
        }

        const index = player.playlist.findIndex(c => c.id === song.id);
        if (index !== -1) {
            // Solo reproducir si es una canción diferente o si está pausada
            if (!player.currentSong || player.currentSong.id !== song.id || !player.isPlaying) {
                player.playSong(song, index);
            }
        }
    };

    /**
     * Alterna entre play/pause
     */
    const togglePlay = () => {
        player.togglePlay();
    };

    return {
        isPlaying,
        currentSong,
        currentPlaylist,
        playPlaylist,
        playSong,
        togglePlay,
        nextSong: player.nextSong,
        prevSong: player.prevSong,
        toggleShuffle: player.toggleShuffle,
        toggleLoop: player.toggleLoop,
    };
}