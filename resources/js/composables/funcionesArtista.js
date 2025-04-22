import { ref } from 'vue';
import axios from 'axios';

export function useFuncionesArtista() {
    const canciones = ref([]);
    const cargando = ref(false);
    const error = ref(null);
    const albums = ref([]);

    const getCancionesUsuario = async (usuarioId) => {
        if (!usuarioId) return [];
        
        cargando.value = true;
        error.value = null;
        
        try {
            const response = await axios.get(`/api/canciones/usuario/${usuarioId}`);
            canciones.value = response.data;
            return canciones.value;
        } catch (err) {
            console.error('Error al cargar las canciones del usuario:', err);
            error.value = 'No se pudieron cargar las canciones. Por favor, inténtalo de nuevo más tarde.';
            return [];
        } finally {
            cargando.value = false;
        }
    };

    const getCancionesOrdenadasPorReproducciones = async (usuarioId) => {
        const resultado = await getCancionesUsuario(usuarioId);
        return [...resultado].sort((a, b) => b.reproducciones - a.reproducciones);
    };

    const getAlbumesUsuario = async (usuarioId) => {
        if (!usuarioId) return [];
        
        cargando.value = true;
        error.value = null;
        
        try {
            const response = await axios.get(`/api/albumes/${usuarioId}`);
            albums.value = response.data.data;
            return albums.value;
        } catch (err) {
            console.error('Error al cargar álbumes:', err);
            error.value = 'Error al cargar los álbumes. Por favor, intenta de nuevo más tarde.';
            return [];
        } finally {
            cargando.value = false;
        }
    };

    const getCancionesAlbum = async (albumId) => {
        if (!albumId) return [];
        
        cargando.value = true;
        error.value = null;
        
        try {
            const response = await axios.get(`/api/albumes/${albumId}/canciones`);
            return Array.isArray(response.data.data) ? response.data.data : [];
        } catch (err) {
            console.error('Error al cargar canciones del álbum:', err);
            error.value = 'Error al cargar canciones del álbum';
            return [];
        } finally {
            cargando.value = false;
        }
    };

    const eliminarAlbum = async (albumId) => {
        if (!albumId) return false;
        
        cargando.value = true;
        error.value = null;
        
        try {
            await axios.delete(`/api/albumes/${albumId}`);
            albums.value = albums.value.filter(album => album.id !== albumId);
            return true;
        } catch (err) {
            console.error('Error al eliminar el álbum:', err);
            error.value = 'Error al eliminar el álbum';
            return false;
        } finally {
            cargando.value = false;
        }
    };

    const eliminarCancion = async (cancionId) => {
        if (!cancionId) return false;
        
        cargando.value = true;
        error.value = null;
        
        try {
            await axios.delete(`/api/canciones/${cancionId}`);
            return true;
        } catch (err) {
            console.error('Error al eliminar la canción:', err);
            error.value = 'Error al eliminar la canción';
            return false;
        } finally {
            cargando.value = false;
        }
    };

    const agregarCancion = async (cancion, albumId, orden) => {
        if (!cancion || !albumId) return null;
        
        cargando.value = true;
        error.value = null;
        
        try {
            const songFormData = new FormData();
            songFormData.append('archivo', cancion.file);
            songFormData.append('album_id', albumId);
            songFormData.append('nombre', cancion.nombre);
            songFormData.append('duracion', cancion.duracion);
            songFormData.append('orden', orden);

            const response = await axios.post('/api/canciones', songFormData);
            return response.data.cancion;
        } catch (err) {
            console.error('Error al guardar canción:', err);
            error.value = `Error al guardar canción: ${cancion.nombre}`;
            return null;
        } finally {
            cargando.value = false;
        }
    };

    const actualizarPortadaAlbum = async (albumId, portadaFile) => {
        if (!albumId || !portadaFile) return null;
        
        cargando.value = true;
        error.value = null;
        
        try {
            const imageFormData = new FormData();
            imageFormData.append('portada', portadaFile);
            imageFormData.append('album_id', albumId);
            
            const imageResponse = await axios.post(`/api/albumes/${albumId}/portada`, imageFormData);
            return imageResponse.data.portada_url;
        } catch (err) {
            console.error('Error al subir la portada:', err);
            error.value = 'Error al subir la portada';
            return null;
        } finally {
            cargando.value = false;
        }
    };

    const actualizarAlbum = async (albumId, albumData) => {
        if (!albumId) return false;
        
        cargando.value = true;
        error.value = null;
        
        try {
            await axios.put(`/api/albumes/${albumId}`, albumData);
            return true;
        } catch (err) {
            console.error('Error al actualizar álbum:', err);
            error.value = err.response?.data?.message || 'Error al guardar';
            return false;
        } finally {
            cargando.value = false;
        }
    };

    const crearAlbum = async (albumData, portada) => {
        cargando.value = true;
        error.value = null;
        
        try {
            const albumFormData = new FormData();
            albumFormData.append('nombre', albumData.nombre);
            albumFormData.append('tipo', albumData.tipo);
            albumFormData.append('portada', portada);
            albumFormData.append('num_canciones', albumData.num_canciones);
            albumFormData.append('duracion_total', albumData.duracion_total);
    
           
            const albumResponse = await axios.post('/api/albums', albumFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            return albumResponse.data.album;
        } catch (err) {
            console.error('Error al crear el álbum:', err.response?.data);
            error.value = 'Ha ocurrido un error al crear el álbum';
            throw err;
        } finally {
            cargando.value = false;
        }
    };

    const subirAlbumCompleto = async (albumData, canciones) => {
        cargando.value = true;
        error.value = null;
        
        try {
            const album = await crearAlbum({
                nombre: albumData.nombre,
                tipo: albumData.tipo,
                num_canciones: canciones.length.toString(),
                duracion_total: albumData.duracionTotal
            }, albumData.portada);
            
            for (let i = 0; i < canciones.length; i++) {
                await agregarCancion(canciones[i], album.id, i + 1);
            }
            
            return album;
        } catch (err) {
            error.value = 'Ha ocurrido un error al crear el álbum y sus canciones';
            throw err;
        } finally {
            cargando.value = false;
        }
    };

    return {
        canciones,
        albums,
        cargando,
        error,
        getCancionesUsuario,
        getCancionesOrdenadasPorReproducciones,
        getAlbumesUsuario,
        getCancionesAlbum,
        eliminarAlbum,
        eliminarCancion,
        agregarCancion,
        actualizarPortadaAlbum,
        actualizarAlbum,
        crearAlbum,
        subirAlbumCompleto
    };
}
