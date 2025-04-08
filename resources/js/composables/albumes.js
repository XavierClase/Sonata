import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

export default function useAlbumes() {
    const albumes = ref({ data: [] });
    const album = ref({});
    const errors = ref({});
    const loading = ref(false);
    const toast = useToast();

    const getAlbumes = async () => {
        loading.value = true;
        try {
            const response = await axios.get('/api/admin/albumes');
            albumes.value = response.data;
            loading.value = false;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar los álbumes', 
                life: 3000
            });
        }
    };

    const getAlbum = async (id) => {
        loading.value = true;
        try {
            const response = await axios.get(`/api/admin/albumes/${id}`);
            album.value = response.data.data;
            loading.value = false;
            return album.value;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al cargar los detalles del álbum', 
                life: 3000
            });
        }
    };

    const storeAlbum = async (form) => {
        loading.value = true;
        errors.value = {};
        
        const formData = new FormData();
        for (const key in form) {
            if (key === 'portada' && form[key] instanceof File) {
                formData.append(key, form[key]);
            } else {
                formData.append(key, form[key]);
            }
        }

        try {
            const response = await axios.post('/api/admin/albumes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            album.value = response.data.album;
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Álbum creado correctamente', 
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
                detail: 'Error al crear el álbum', 
                life: 3000
            });
            throw e;
        }
    };

    const updateAlbum = async (id, form) => {
        loading.value = true;
        errors.value = {};

        try {
            const response = await axios.put(`/api/admin/albumes/${id}`, form);
            album.value = response.data.data;
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Álbum actualizado correctamente', 
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
                detail: 'Error al actualizar el álbum', 
                life: 3000
            });
            throw e;
        }
    };

    const deleteAlbum = async (id) => {
        loading.value = true;
        try {
            await axios.delete(`/api/admin/albumes/${id}`);
            getAlbumes(); 
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Álbum eliminado correctamente', 
                life: 3000
            });
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al eliminar el álbum', 
                life: 3000
            });
            throw e;
        }
    };

    const updatePortada = async (id, file) => {
        loading.value = true;
        const formData = new FormData();
        formData.append('id', id);
        formData.append('portada', file);

        try {
            const response = await axios.post('/api/admin/albumes/update-portada', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            loading.value = false;
            toast.add({
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Portada actualizada correctamente', 
                life: 3000
            });
            return response.data;
        } catch (e) {
            loading.value = false;
            toast.add({
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al actualizar la portada', 
                life: 3000
            });
            throw e;
        }
    };

    return {
        albumes,
        album,
        errors,
        loading,
        getAlbumes,
        getAlbum,
        storeAlbum,
        updateAlbum,
        deleteAlbum,
        updatePortada
    };
}