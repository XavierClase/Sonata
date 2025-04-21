import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

export default function useCanciones() {
    const canciones = ref({ data: [] });
    const cancion = ref({});
    const errors = ref({});
    const loading = ref(false);
    const toast = useToast();

    const getCanciones = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/api/admin/canciones');
            canciones.value = response.data;
            loading.value = false;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar las canciones', 
                life: 3000
            });
        }
    };

    const getCancion = async (id) => {
        loading.value = true;
        try {
            const response = await axios.get(`/api/admin/canciones/${id}`);
            cancion.value = response.data.data;
            loading.value = false;
            return cancion.value;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar los detalles de la canción', 
                life: 3000
            });
            throw e;
        }
    };


    const getNextOrdenDisponible = async (albumId) => {
        try {
        
            const response = await axios.get(`/api/admin/albums/${albumId}/canciones`);
            const cancionesAlbum = response.data.data || [];
            
       
            if (!cancionesAlbum.length) {
                return 1;
            }
            
         
            let maxOrden = 0;
            cancionesAlbum.forEach(cancion => {
            
                const ordenCancion = cancion.pivot?.orden || 0;
                if (ordenCancion > maxOrden) {
                    maxOrden = ordenCancion;
                }
            });
            
            return maxOrden + 1;
        } catch (e) {
            console.error('Error al obtener el siguiente orden:', e);
        
            return 9999;
        }
    };

    const storeCancion = async (form) => {
        loading.value = true;
        errors.value = {};
        
        try {
         
            let ordenFinal = 1;
            if (form.album_id) {
                ordenFinal = await getNextOrdenDisponible(form.album_id);
            }
            
            const formData = new FormData();
            for (const key in form) {
                if ((key === 'archivo' || key === 'portada') && form[key] instanceof File) {
                    formData.append(key, form[key]);
                } else {
                    formData.append(key, form[key]);
                }
            }
            
            // Agregamos el orden calculado automáticamente
            formData.append('orden', ordenFinal);

            const response = await axios.post('/api/admin/canciones', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            cancion.value = response.data.cancion;
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Canción creada correctamente', 
                life: 3000
            });
            return response;
        } catch (e) {
            if (e.response && e.response.status === 422) {
                errors.value = e.response.data.errors;
            }
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al crear la canción', 
                life: 3000
            });
            throw e;
        }
    };

    const updateCancion = async (id, formData) => { 
        loading.value = true;
        errors.value = {};
    
        try {
          
            const albumId = formData.get('album_id');
            if (albumId && cancion.value.album_id !== albumId) {
                const ordenFinal = await getNextOrdenDisponible(albumId);
                formData.append('orden', ordenFinal);
            }
            
            const response = await axios.post(`/api/admin/canciones/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            cancion.value = response.data.data;
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Canción actualizada correctamente', 
                life: 3000
            });
            return response;
        } catch (e) {
            if (e.response && e.response.status === 422) {
                errors.value = e.response.data.errors;
            }
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al actualizar la canción', 
                life: 3000
            });
            throw e;
        }
    };

    const deleteCancion = async (id) => {
        loading.value = true;
        try {
            await axios.delete(`/api/admin/canciones/${id}`);
            getCanciones(); 
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Canción eliminada correctamente', 
                life: 3000
            });
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al eliminar la canción', 
                life: 3000
            });
            throw e;
        }
    };

    const updateAudio = async (id, file) => {
        loading.value = true;
        const formData = new FormData();
        formData.append('id', id);
        formData.append('archivo', file);

        try {
            const response = await axios.post('/api/admin/canciones/updateaudio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Archivo de audio actualizado correctamente', 
                life: 3000
            });
            return response.data;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al actualizar el archivo de audio', 
                life: 3000
            });
            throw e;
        }
    };

    return {
        canciones,
        cancion,
        errors,
        loading,
        getCanciones,
        getCancion,
        storeCancion,
        updateCancion,
        deleteCancion,
        updateAudio
    };
}