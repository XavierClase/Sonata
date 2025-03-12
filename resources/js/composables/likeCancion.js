import { ref } from "vue";
import axios from "axios";

export function useLikes() {
    const likedSongs = ref(new Set());

    const toggleLike = async (songId) => {
        try {
            const response = await axios.post(`/api/likes`, { song_id: songId });

            if (response.data.liked) {
                likedSongs.value.add(songId);
            } else {
                likedSongs.value.delete(songId);
            }
        } catch (error) {
            console.error("Error al dar like:", error);
        }
    };

    return {
        likedSongs,
        toggleLike
    };
}
