// src/composables/usePlayer.js
import { computed } from 'vue';
import { usePlayerStore } from "@/store/player";

export function usePlayer() {
    const player = usePlayerStore();

    const isPlaying = computed(() => player.isPlaying);
    const currentSong = computed(() => player.currentSong);
    const currentPlaylist = computed(() => player.playlist);
    const currentPlaylistType = computed(() => player.currentPlaylistType);
    const currentPlaylistId = computed(() => player.currentPlaylistId);

    /**
     * Reproduce una lista de canciones (álbum, playlist, etc.)
     * @param {Array} songs - Lista de canciones
     * @param {String} playlistType - Tipo de lista ('album', 'lista', etc.)
     * @param {String|Number} playlistId - ID del álbum o playlist
     * @param {Boolean} forceRestart - Forzar reinicio incluso si es la misma lista
     */
    const playPlaylist = (songs, playlistType = null, playlistId = null, forceRestart = false) => {
        if (!songs?.length) return;

        const isSamePlaylist = JSON.stringify(player.playlist) === JSON.stringify(songs);
        
        if (isSamePlaylist && player.isPlaying && !forceRestart) {
            player.togglePlay(); // Pausar si ya está reproduciendo
        } else {
            // Guardar el tipo y ID de la playlist para el historial
            player.setPlaylist(songs, playlistType, playlistId);
            player.playSong(songs[0], 0);
            
            // Registrar reproducción inmediatamente
            if (playlistType && playlistId) {
                player.registrarUltimoEscuchado();
            }
        }
    };

    /**
     * Reproduce una canción específica dentro de una lista
     * @param {Object} song - Canción a reproducir
     * @param {Array} playlist - Lista de canciones (opcional, usa la actual si no se provee)
     * @param {String} playlistType - Tipo de lista ('album', 'lista', etc.)
     * @param {String|Number} playlistId - ID del álbum o playlist
     */
    const playSong = (song, playlist = null, playlistType = null, playlistId = null) => {
        if (playlist) {
            const playlistChanged = JSON.stringify(player.playlist) !== JSON.stringify(playlist);
            if (playlistChanged) {
                // Guardar el tipo y ID de la playlist para el historial
                player.setPlaylist(playlist, playlistType, playlistId);
            } else {
                // Actualizar solo el tipo y ID si la playlist es la misma
                if (playlistType) player.currentPlaylistType = playlistType;
                if (playlistId) player.currentPlaylistId = playlistId;
            }
        }

        const index = player.playlist.findIndex(c => c.id === song.id);
        if (index !== -1) {
            // Solo reproducir si es una canción diferente o si está pausada
            if (!player.currentSong || player.currentSong.id !== song.id || !player.isPlaying) {
                player.playSong(song, index);
                
                // Si tenemos tipo e ID, registrar reproducción
                if (playlistType && playlistId) {
                    player.registrarUltimoEscuchado();
                }
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
        currentPlaylistType,
        currentPlaylistId,
        playPlaylist,
        playSong,
        togglePlay,
        nextSong: () => player.nextSong(),
        prevSong: () => player.prevSong(),
        toggleShuffle: () => player.toggleShuffle(),
        toggleLoop: () => player.toggleLoop(),
    };
}