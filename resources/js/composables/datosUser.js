import { ref, reactive  } from "vue";
import axios from "axios";
import { authStore } from "@/store/auth.js";

export function datosUser(userId) {
    const user = ref(null);

    const getUser = async () => {
        try {
            const response = await axios.get(`/api/user/${userId.value}`); 
            user.value = response.data.data;  
        } catch (error) {
            console.error("Error los datos del usuario", error);
        }
    };

    return {
        user,
        getUser
    };
}

export function useEditarUsuario(user, userId, visible) {
    const userPropio = authStore().user;
    const PreviewImagenPerfil = ref(null);
    const PreviewImagenDetalles = ref(null);
    const nombreUsuarioMod = ref('');
    const descripcionUsuarioMod = ref('');
    const imagenDataPerfil = reactive({ portada: null });
    const imagenDataDetalles = reactive({ portada: null });
    const avatarUrl = ref(user.value?.avatar);
    const fotoDetallesUrl = ref(user.value?.fotoDetalles);


    const manejarImagen = (event, tipo) => {
        const file = event.target.files[0];
        if (file) {
            const previewKey = tipo === 'perfil' ? PreviewImagenPerfil : PreviewImagenDetalles;
            const imagenDataKey = tipo === 'perfil' ? imagenDataPerfil : imagenDataDetalles;

            if (previewKey.value) {
                URL.revokeObjectURL(previewKey.value);
            }

            imagenDataKey.portada = file;
            previewKey.value = URL.createObjectURL(file);
        }
    };

    const actualizarImagen = async (imagenData, endpoint, key) => {
        if (imagenData.portada) {
            let formData = new FormData();
            formData.append('id', userPropio.id);
            formData.append('picture', imagenData.portada);
    
            try {
                const response = await axios.post(endpoint, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
    
                const nuevaImagen = response.data[key];
                if (nuevaImagen) {
                    if (key === 'avatar') {
                        avatarUrl.value = nuevaImagen;
                        user.value.avatar = nuevaImagen;
                    } else if (key === 'fotoDetalles') {
                        fotoDetallesUrl.value = nuevaImagen;
                        user.value.fotoDetalles = nuevaImagen;
                    }
                    
                    imagenData.portada = null;
                }
            } catch (error) {
                console.error(`Error al actualizar la imagen en ${endpoint}:`, error);
            }
        }
    };
    

    const guardarCambios = async () => {
        try {
            if (imagenDataPerfil.portada) {
                await actualizarImagen(imagenDataPerfil, '/api/users/updateimg', 'avatar');
            }
            
            if (imagenDataDetalles.portada) {
                await actualizarImagen(imagenDataDetalles, '/api/users/updateimgdetalles', 'fotoDetalles');
            }
            
            if (nombreUsuarioMod.value !== user.value.name || descripcionUsuarioMod.value !== user.value.descripcion) {
                await axios.put(`/api/users/${userId.value}`, {
                    name: nombreUsuarioMod.value,
                    descripcion: descripcionUsuarioMod.value
                });
                
                user.value.name = nombreUsuarioMod.value;
                user.value.descripcion = descripcionUsuarioMod.value;
                
                userPropio.name = nombreUsuarioMod.value;
                userPropio.descripcion = descripcionUsuarioMod.value;
            }
            
            PreviewImagenPerfil.value = null;
            PreviewImagenDetalles.value = null;
            
            await fetchUserData();
            
            if (avatarUrl.value && avatarUrl.value !== user.value.avatar) {
                user.value.avatar = avatarUrl.value;
            }
            
            if (fotoDetallesUrl.value && fotoDetallesUrl.value !== user.value.fotoDetalles) {
                user.value.fotoDetalles = fotoDetallesUrl.value;
            }
            
            userPropio.avatar = user.value.avatar;
            userPropio.fotoDetalles = user.value.fotoDetalles;
            
            visible.value = false;
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/api/user/${userId.value}`);
            user.value = response.data.data;
        } catch (error) {
            console.error('Error al actualizar los datos del usuario:', error);
            window.location.reload();
        }
    };

    return {
        PreviewImagenPerfil,
        PreviewImagenDetalles,
        nombreUsuarioMod,
        descripcionUsuarioMod,
        manejarImagen,
        guardarCambios,
        fetchUserData
    };
}
