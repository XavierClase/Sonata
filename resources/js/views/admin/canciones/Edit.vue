<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header bg-transparent ps-0 pe-0">
                    <h5 class="float-start mb-0">Editar Canción</h5>
                </div>

                <div class="card-body">
                    <form @submit.prevent="guardarCambios" class="p-fluid">
                        <div class="field mb-4">
                            <label for="nombre">Nombre de la canción</label>
                            <InputText id="nombre" v-model="form.nombre" class="w-full" :class="{'p-invalid w-100': errors.nombre}" />
                            <small v-if="errors.nombre" class="p-error">{{ errors.nombre[0] }}</small>
                        </div>

                        <div class="field mb-4">
                            <label for="duracion">Duración</label>
                            <div class="p-inputtext p-component p-disabled">
                                {{ nuevaDuracion ? formatearDuracion(nuevaDuracion) : cancion.duracion }}
                                <span v-if="nuevaDuracion" class="ml-2 text-info">(Duración calculada del nuevo archivo)</span>
                            </div>
                        </div>

                        <div class="field mb-4">
                            <label for="archivo">Archivo de audio</label>
                            <input type="file" @change="manejarSubidaArchivo" accept="audio/mp3,audio/wav" class="w-full" />
                            <small class="text-muted">Deja en blanco para mantener el audio actual</small>
                            <div v-if="cancion.archivo" class="mt-2">
                                <p>Audio actual:</p>
                                <audio controls class="w-100" style="height: 30px;">
                                    <source :src="cancion.archivo" type="audio/mpeg">
                                    Tu navegador no soporta audio HTML5.
                                </audio>
                            </div>
                            <div v-if="form.archivo" class="mt-2">
                                <p>Audio nuevo (vista previa):</p>
                                <audio controls class="w-100" style="height: 30px;">
                                    <source :src="urlVistaPreviaSonido" type="audio/mpeg">
                                    Tu navegador no soporta audio HTML5.
                                </audio>
                            </div>
                        </div>

                        <div class="flex justify-content-end">
                            <Button type="button" label="Cancelar" class="p-button-text mr-2" @click="$router.push('/admin/canciones')" />
                            <Button type="submit" label="Guardar cambios" :loading="loading" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCanciones from '@/composables/cancionesAdmin';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { getCancion, updateCancion, errors: cancionErrors, loading } = useCanciones();

const cancion = ref({});
const errors = ref({});
const urlVistaPreviaSonido = ref('');
const nuevaDuracion = ref(null);

const form = ref({
    nombre: '',
    duracion: '',
    archivo: null
});

const cargarCancion = async () => {
    try {
        const data = await getCancion(route.params.id);
        cancion.value = data;
        form.value = {
            nombre: data.nombre,
            duracion: data.duracion,
            archivo: null,
        };
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la canción',
            life: 3000
        });
        router.push('/admin/canciones');
    }
};

const formatearDuracion = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);
    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
};

const manejarSubidaArchivo = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        form.value.archivo = archivo;
        
   
        if (urlVistaPreviaSonido.value) {
            URL.revokeObjectURL(urlVistaPreviaSonido.value);
        }
        urlVistaPreviaSonido.value = URL.createObjectURL(archivo);
        

        const audio = new Audio();
        audio.src = urlVistaPreviaSonido.value;
        
        audio.addEventListener('loadedmetadata', () => {
            nuevaDuracion.value = audio.duration;
            form.value.duracion = formatearDuracion(audio.duration);
        });
    } else {
        form.value.archivo = null;
        if (urlVistaPreviaSonido.value) {
            URL.revokeObjectURL(urlVistaPreviaSonido.value);
            urlVistaPreviaSonido.value = '';
        }
        nuevaDuracion.value = null;
    }
};

const guardarCambios = async () => {
    errors.value = {};
    try {
        const formData = new FormData();
        
        formData.append('nombre', form.value.nombre);
        
       
        if (nuevaDuracion.value) {
            formData.append('duracion', formatearDuracion(nuevaDuracion.value));
        } else {
            formData.append('duracion', cancion.value.duracion);
        }
        
        if (form.value.archivo instanceof File) {
            formData.append('archivo', form.value.archivo);
        }

        await updateCancion(route.params.id, formData);
        
 
        
        router.push('/admin/canciones');
    } catch (e) {
        if (e.response && e.response.status === 422) {
            errors.value = e.response.data.errors;
        }
    }
};

onMounted(() => {
    cargarCancion();
});


</script>