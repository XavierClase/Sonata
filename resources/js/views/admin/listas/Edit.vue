<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Editar Lista de Reproducción</h5>
                </div>

                <form @submit.prevent="submitForm" class="p-fluid" v-if="!loading">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="nombre">Nombre</label>
                                <InputText id="nombre" v-model="form.nombre" :class="{'p-invalid': errors.nombre}" />
                                <small class="p-error" v-if="errors.nombre">{{ errors.nombre[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="field">
                                <label for="descripcion">Descripción</label>
                                <Textarea id="descripcion" v-model="form.descripcion" rows="3" />
                                <small class="p-error" v-if="errors.descripcion">{{ errors.descripcion[0] }}</small>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="portada">Portada</label>
                                <div class="flex flex-column">
                                    <div v-if="previewImage || form.portada" class="mb-2">
                                        <img :src="previewImage || form.portada" alt="Vista previa" style="max-width: 200px; max-height: 200px;" />
                                    </div>
                                    <FileUpload
                                        mode="basic"
                                        name="portada"
                                        accept="image/*"
                                        :maxFileSize="2000000"
                                        @select="onImageSelect"
                                        @error="onError"
                                        :auto="false"
                                        chooseLabel="Cambiar imagen"
                                        class="mt-2"
                                    />
                                    <small class="p-error" v-if="errors.portada">{{ errors.portada[0] }}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Sección de canciones -->
                        <div class="col-12 mt-4">
                            <h6>Canciones en la Lista</h6>
                            <DataTable :value="canciones" stripedRows v-if="canciones.length > 0">
                                <Column field="id" header="ID"></Column>
                                <Column header="Portada">
                                    <template #body="slotProps">
                                        <img v-if="slotProps.data.portada" :src="slotProps.data.portada" alt="Portada" 
                                             style="height: 40px; width: 40px; object-fit: cover; border-radius: 4px;" />
                                        <span v-else class="pi pi-image text-gray-400" style="font-size: 1.5rem;"></span>
                                    </template>
                                </Column>
                                <Column field="titulo" header="Título"></Column>
                                <Column field="artista" header="Artista"></Column>
                                <Column field="duracion" header="Duración"></Column>
                                <Column class="pe-0 me-0 icon-column-1">
                                    <template #body="slotProps">
                                        <Button icon="pi pi-trash" severity="danger" size="small" 
                                                @click="removeCancion(slotProps.data.id)" 
                                                v-tooltip.top="'Eliminar de la lista'" />
                                    </template>
                                </Column>
                            </DataTable>
                            <div v-else class="p-3 text-center text-gray-500">
                                No hay canciones en esta lista de reproducción.
                            </div>
                        </div>

                        <div class="col-12 flex justify-content-end">
                            <Button type="button" label="Cancelar" class="p-button-secondary mr-2" @click="$router.push('/admin/listas')" />
                            <Button type="submit" label="Guardar" :loading="isSubmitting" />
                        </div>
                    </div>
                </form>

                <div v-else class="flex justify-content-center p-5">
                    <ProgressSpinner />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useListas from "../../../composables/listas";

const router = useRouter();
const route = useRoute();
const { getLista, updateLista, updatePortada, getCancionesLista, eliminarCancionDeLista, errors: listaErrors, loading } = useListas();
const errors = ref({});
const previewImage = ref(null);
const canciones = ref([]);
const isSubmitting = ref(false);

const form = ref({
    nombre: '',
    descripcion: '',
    portada: null
});

const fetchData = async () => {
    try {
        const listaData = await getLista(route.params.id);
        form.value.nombre = listaData.nombre;
        form.value.descripcion = listaData.descripcion;
        form.value.portada = listaData.portada;
        

        const cancionesData = await getCancionesLista(route.params.id);
        canciones.value = cancionesData;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
};

const onImageSelect = (event) => {
    form.value.nuevaPortada = event.files[0];
    
   
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.value = e.target.result;
    };
    reader.readAsDataURL(event.files[0]);
    

    event.files = [];
};

const onError = (event) => {
    if (event.type === 'max-file-size') {
        errors.value.portada = ['El archivo excede el tamaño máximo permitido (2MB)'];
    }
};

const removeCancion = async (cancionId) => {
    try {
        await eliminarCancionDeLista(route.params.id, cancionId);
   
        const cancionesData = await getCancionesLista(route.params.id);
        canciones.value = cancionesData;
    } catch (error) {
        console.error("Error al eliminar la canción:", error);
    }
};

const submitForm = async () => {
    try {
        isSubmitting.value = true;
        errors.value = {};
        

        await updateLista(route.params.id, {
            nombre: form.value.nombre,
            descripcion: form.value.descripcion
        });

        if (form.value.nuevaPortada) {
            await updatePortada(route.params.id, form.value.nuevaPortada);
        }

        isSubmitting.value = false;
        router.push("/admin/listas");
    } catch (e) {
        errors.value = listaErrors.value;
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>