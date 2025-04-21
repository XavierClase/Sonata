<template>
    <div class="card">
        <h5 class="card-header bg-transparent ps-0 pe-0">Crear Nueva Canción</h5>
        <div class="card-body">
            <form @submit.prevent="handleSubmit" class="formgrid grid">
                <div class="field col-12 md:col-6">
                    <label for="nombre" class="font-bold">Nombre de la Canción*</label>
                    <InputText 
                        id="nombre" 
                        v-model="form.nombre" 
                        :class="{ 'p-invalid': errors.nombre }" 
                        class="w-full"
                        placeholder="Ingrese el nombre de la canción" 
                    />
                    <small v-if="errors.nombre" class="p-error">{{ errors.nombre[0] }}</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="duracion" class="font-bold">Duración*</label>
                    <InputText 
                        id="duracion" 
                        v-model="form.duracion" 
                        :class="{ 'p-invalid': errors.duracion }" 
                        class="w-full"
                        placeholder="00:00"
                        readonly
                    />
                    <small v-if="errors.duracion" class="p-error">{{ errors.duracion[0] }}</small>
                    <small class="text-gray-500">La duración se detectará automáticamente al cargar el archivo de audio</small>
                </div>

                <div class="field col-12 md:col-6">
                <label for="album_id" class="font-bold">Álbum*</label>
                <Dropdown 
                    id="album_id" 
                    v-model="form.album_id" 
                    :options="formattedAlbums" 
                    optionLabel="nombre" 
                    optionValue="id"
                    placeholder="Seleccione un álbum" 
                    class="w-full"
                    :class="{ 'p-invalid': errors.album_id }"
                    filter
                    filterPlaceholder="Buscar álbum..."
                    :showClear="true"
                >
                    <template #option="slotProps">
                        <div class="flex align-items-center">
                            <span>{{ slotProps.option.nombre }}</span>
                        </div>
                    </template>
                </Dropdown>
                <small v-if="errors.album_id" class="p-error">{{ errors.album_id[0] }}</small>
            </div>

            

                <div class="field col-12">
                    <label for="archivo" class="font-bold">Archivo de Audio (MP3/WAV)*</label>
                    <div class="flex flex-column gap-2">
                        <div class="p-inputgroup" :class="{ 'border-red-500 rounded-md': errors.archivo }">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-music"></i>
                            </span>
                            <input 
                                type="text" 
                                readonly 
                                class="p-inputtext p-component w-full" 
                                :value="audioFileName || 'Ningún archivo seleccionado'" 
                            />
                            <Button 
                                type="button" 
                                label="Examinar" 
                                @click="$refs.audioFileInput.click()" 
                                severity="secondary"
                            />
                        </div>
                        <input 
                            ref="audioFileInput" 
                            type="file" 
                            style="display: none" 
                            @change="handleAudioFileChange" 
                            accept=".mp3,.wav"
                        />
                        <div v-if="audioPreview" class="mt-2">
                            <audio 
                                ref="audioElement"
                                controls 
                                class="w-full" 
                                @loadedmetadata="getAudioDuration"
                            >
                                <source :src="audioPreview" :type="audioType">
                                Tu navegador no soporta el elemento de audio.
                            </audio>
                        </div>
                        <small v-if="errors.archivo" class="p-error">{{ errors.archivo[0] }}</small>
                        <small class="text-gray-500">Formatos permitidos: MP3, WAV</small>
                    </div>
                </div>

                <div class="flex justify-content-end col-12">
                    <Button 
                        type="button" 
                        label="Cancelar" 
                        icon="pi pi-times" 
                        class="p-button-secondary mr-2" 
                        @click="$router.push('/admin/canciones')" 
                        :disabled="loading"
                    />
                    <Button 
                        type="submit" 
                        label="Guardar" 
                        icon="pi pi-save" 
                        :loading="loading"
                    />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import useCanciones from '@/composables/cancionesAdmin';
import { useAlbumes } from '@/composables/albumesAdmin';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const router = useRouter();
const toast = useToast();
const { storeCancion, errors: apiErrors, loading } = useCanciones();
const { albumes, getAlbumes } = useAlbumes();

const form = reactive({
    nombre: '',
    duracion: '',
    album_id: null,
    archivo: null,

});

const albums = ref([]);
const formattedAlbums = computed(() => {
    return albumes.value.data.map(album => ({
        id: album.id,
        nombre: album.nombre
    }));
});

const errors = ref({});
const audioFileName = ref('');
const audioPreview = ref(null);
const audioType = ref('');
const audioElement = ref(null);

const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.archivo = file;
        audioFileName.value = file.name;
        audioType.value = file.type;
        
        if (audioPreview.value) {
            URL.revokeObjectURL(audioPreview.value);
        }
        audioPreview.value = URL.createObjectURL(file);
    }
};

const getAudioDuration = (event) => {
    const audio = event.target;
    if (audio && audio.duration) {
        const totalSeconds = Math.floor(audio.duration);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        form.duracion = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};

const handleSubmit = async () => {
    errors.value = {};
    
    if (!form.nombre) {
        errors.value.nombre = ['El nombre de la canción es obligatorio'];
    }
    
    if (!form.duracion) {
        errors.value.duracion = ['Debe cargar un archivo de audio para detectar la duración'];
    }
    
    if (!form.album_id) {
        errors.value.album_id = ['Debe seleccionar un álbum'];
    }
    
    if (!form.archivo) {
        errors.value.archivo = ['Debe seleccionar un archivo de audio'];
    }
    
    if (Object.keys(errors.value).length > 0) {
        return;
    }
    
    try {
        console.log('Enviando formulario:', form);
       
        await storeCancion(form);
        router.push('/admin/canciones');
    } catch (error) {
        console.error('Error al guardar la canción:', error);
        errors.value = apiErrors.value;
    }
};

onMounted(() => {
    getAlbumes();
});
</script>