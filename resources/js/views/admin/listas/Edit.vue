<template>
    <div class="show"></div>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header mb-3">
                    <div class="flex justify-content-between align-items-center">
                        <h5 class="m-0 text-xl font-medium">Editar Lista de Reproducción</h5>
                        <Button icon="pi pi-arrow-left" label="Volver" class="p-button-outlined" @click="$router.push('/admin/listas')" />
                    </div>
                </div>

                <div v-if="loading" class="flex justify-content-center p-5">
                    <ProgressSpinner />
                </div>

                <form @submit.prevent="submitForm" class="p-fluid" v-else>
                    <div class="grid">
                        <div class="col-12 md:col-8">
                            <div class="grid">
                                <div class="col-12">
                                    <div class="field">
                                        <label for="nombre" class="font-medium">Nombre de la lista</label>
                                        <InputText 
                                            id="nombre" 
                                            v-model="form.nombre" 
                                            :class="{'p-invalid': errors.nombre}"
                                            placeholder="Introduce un nombre para la lista" 
                                        />
                                        <small class="p-error" v-if="errors.nombre">{{ errors.nombre[0] }}</small>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="field">
                                        <label for="descripcion" class="font-medium">Descripción</label>
                                        <Textarea 
                                            id="descripcion" 
                                            v-model="form.descripcion" 
                                            rows="4" 
                                            placeholder="Describe brevemente esta lista de reproducción"
                                        />
                                        <small class="p-error" v-if="errors.descripcion">{{ errors.descripcion[0] }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 md:col-4">
                            <div class="field">
                                <label for="portada" class="font-medium mb-2 block">Portada</label>
                                <div class="flex flex-column align-items-center">
                                    <div class="surface-card border-1 border-round border-300 p-0 mb-3" style="height: 200px; width: 200px; overflow: hidden;">
                                        <img 
                                            v-if="previewImage || form.portada" 
                                            :src="previewImage || form.portada" 
                                            alt="Vista previa" 
                                            class="w-full h-full object-cover"
                                        />
                                        <div v-else class="w-full h-full flex align-items-center justify-content-center bg-gray-100">
                                            <i class="pi pi-image text-4xl text-gray-400"></i>
                                        </div>
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
                                        class="w-full"
                                    />
                                    <small class="p-error mt-2" v-if="errors.portada">{{ errors.portada[0] }}</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 my-3">
                        <div class="card p-3 border-1 border-300">
                            <h6 class="mb-3">Añadir canciones a la lista</h6>
                            <div class="grid">
                                <div class="col-12 md:col-8">
                                    <Dropdown 
                                        v-model="cancionSeleccionada" 
                                        :options="cancionesDisponibles" 
                                        optionLabel="nombre" 
                                        placeholder="Buscar canción..." 
                                        class="w-full"
                                        filter 
                                        filterPlaceholder="Buscar por nombre..."
                                    >
                                        <template #option="slotProps">
                                            <div class="flex align-items-center">
                                                <img 
                                                    v-if="slotProps.option.portada" 
                                                    :src="slotProps.option.portada" 
                                                    :alt="slotProps.option.nombre" 
                                                    class="mr-2" 
                                                    style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px;"
                                                />
                                                <span v-else class="pi pi-image text-gray-400 mr-2" style="font-size: 1.25rem;"></span>
                                                <div>
                                                    <span class="font-medium">{{ slotProps.option.nombre }}</span>
                                                    <div class="text-sm text-gray-500">{{ slotProps.option.duracion }}</div>
                                                </div>
                                            </div>
                                        </template>
                                    </Dropdown>
                                </div>
                                <div class="col-12 md:col-4">
                                    <Button 
                                        label="Añadir a la lista" 
                                        icon="pi pi-plus" 
                                        class="w-full" 
                                        @click="añadirCancion" 
                                        :disabled="!cancionSeleccionada || añadiendoCancion"
                                        :loading="añadiendoCancion"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                        <!-- Sección de canciones -->
                        <div class="col-12 mt-4">
                            <div class="card p-0">
                                <div class="flex justify-content-between align-items-center p-3 bg-gray-50 border-round-top">
                                    <h6 class="m-0 font-medium">Canciones en la Lista</h6>
                                    <div>
                                        <span class="font-medium text-500">Total: {{ canciones.length }} canciones</span>
                                    </div>
                                </div>

                                
                                <DataTable 
                                    :value="canciones" 
                                    stripedRows 
                                    v-if="canciones.length > 0"
                                    :rowHover="true"
                                    responsiveLayout="scroll"
                                >
                                    <Column field="id" header="ID" style="width: 5rem"></Column>
                                    <Column header="Portada" style="width: 6rem">
                                        <template #body="slotProps">
                                            <div class="flex align-items-center justify-content-center">
                                                <img 
                                                    v-if="slotProps.data.portada" 
                                                    :src="slotProps.data.portada" 
                                                    alt="Portada" 
                                                    style="height: 40px; width: 40px; object-fit: cover; border-radius: 4px;" 
                                                />
                                                <span v-else class="pi pi-image text-gray-400" style="font-size: 1.5rem;"></span>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="nombre" header="Título"></Column>
                                    <Column field="autor" header="Artista"></Column>
                                    <Column field="duracion" header="Duración" style="width: 8rem">
                                        <template #body="slotProps">
                                            <span class="font-medium">{{ slotProps.data.duracion }}</span>
                                        </template>
                                    </Column>
                                    <Column style="width: 5rem">
                                        <template #body="slotProps">
                                            <Button 
                                                icon="pi pi-trash" 
                                                severity="danger" 
                                                size="small" 
                                                @click="confirmarRemoverCancion(slotProps.data)" 
                                                v-tooltip.top="'Eliminar de la lista'"
                                                text
                                                rounded
                                            />
                                        </template>
                                    </Column>
                                </DataTable>
                                
                                <div v-else class="p-5 text-center text-gray-500 border-1 border-gray-200 border-round-bottom">
                                    <i class="pi pi-music text-4xl text-gray-300 mb-3"></i>
                                    <p>No hay canciones en esta lista de reproducción.</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 flex justify-content-end mt-4">
                            <Button 
                                type="button" 
                                label="Cancelar" 
                                class="p-button-outlined mr-2" 
                                @click="$router.push('/admin/listas')"
                            />
                            <Button 
                                type="submit" 
                                label="Guardar Cambios" 
                                icon="pi pi-save"
                                :loading="isSubmitting"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Diálogo de confirmación -->
    <Dialog v-model:visible="dialogVisible" header="Confirmar eliminación" :style="{width: '450px'}" :modal="true" appendTo=".show">
        <div class="flex align-items-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--yellow-500)"></i>
            <span>¿Estás seguro de que quieres eliminar <strong>{{ cancionSeleccionada?.titulo }}</strong> de esta lista?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
            <Button label="Sí" icon="pi pi-check" severity="danger" @click="removeCancion" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useListas from "@/composables/listasAdmin";
import { useToast } from 'primevue/usetoast';
import useCanciones from "@/composables/cancionesAdmin";
import Dropdown from 'primevue/dropdown';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { getLista, updateLista, updatePortada, getCancionesLista, eliminarCancionDeLista, añadirCancionALista, errors: listaErrors, loading } = useListas();
const errors = ref({});
const previewImage = ref(null);
const canciones = ref([]);
const isSubmitting = ref(false);
const dialogVisible = ref(false);
const cancionSeleccionada = ref(null);
const { canciones: todasCanciones, getCanciones, loading: loadingCanciones } = useCanciones();
const cancionesDisponibles = ref([]);
const añadiendoCancion = ref(false);

const form = ref({
    nombre: '',
    descripcion: '',
    portada: null,
    nuevaPortada: null
});

const actualizarCancionesDisponibles = () => {
   
    const cancionesYaAñadidas = canciones.value.map(c => c.id);
    
   
    cancionesDisponibles.value = todasCanciones.value.data.filter(
        cancion => !cancionesYaAñadidas.includes(cancion.id)
    );
};

const añadirCancion = async () => {
    if (!cancionSeleccionada.value) return;
    
    añadiendoCancion.value = true;
    
    try {
        await añadirCancionALista(route.params.id, cancionSeleccionada.value.id);
        
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `"${cancionSeleccionada.value.nombre}" se ha añadido a la lista`,
            life: 3000
        });
        
        cancionSeleccionada.value = null;
        
        await fetchCanciones();
        
        actualizarCancionesDisponibles();
    } catch (error) {
        console.error("Error al añadir canción:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo añadir la canción a la lista',
            life: 3000
        });
    } finally {
        añadiendoCancion.value = false;
    }
};

const cargarCanciones = async () => {
    try {
        await getCanciones();
        
      
        actualizarCancionesDisponibles();
    } catch (error) {
        console.error("Error al cargar canciones:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las canciones disponibles',
            life: 3000
        });
    }
};

const fetchData = async () => {
    try {
        const listaData = await getLista(route.params.id);
        form.value.nombre = listaData.nombre;
        form.value.descripcion = listaData.descripcion || '';
        form.value.portada = listaData.portada;
        
        await fetchCanciones();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la información de la lista',
            life: 3000
        });
    }
};

const fetchCanciones = async () => {
    try {
        const cancionesData = await getCancionesLista(route.params.id);
        canciones.value = cancionesData;
    } catch (error) {
        console.error("Error al cargar las canciones:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las canciones de la lista',
            life: 3000
        });
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
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo excede el tamaño máximo permitido (2MB)',
            life: 3000
        });
    }
};

const confirmarRemoverCancion = (cancion) => {
    cancionSeleccionada.value = cancion;
    dialogVisible.value = true;
};

const removeCancion = async () => {
    try {
        dialogVisible.value = false;
        
        await eliminarCancionDeLista(route.params.id, cancionSeleccionada.value.id);
        
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `"${cancionSeleccionada.value.titulo}" ha sido eliminada de la lista`,
            life: 3000
        });
        
        await fetchCanciones();
    } catch (error) {
        console.error("Error al eliminar la canción:", error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la canción de la lista',
            life: 3000
        });
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
            try {
                await updatePortada(route.params.id, form.value.nuevaPortada);
            } catch (imageError) {
                console.error("Error al actualizar la imagen:", imageError);
                toast.add({
                    severity: 'warning', 
                    summary: 'Advertencia', 
                    detail: 'Los datos se actualizaron pero hubo un problema con la imagen', 
                    life: 5000
                });
                isSubmitting.value = false;
                router.push("/admin/listas");
                return;
            }
        }

        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Lista de reproducción actualizada correctamente',
            life: 3000
        });
        
        isSubmitting.value = false;
        router.push("/admin/listas");
    } catch (e) {
        console.error("Error al actualizar la lista:", e);
        errors.value = listaErrors.value || {};
        isSubmitting.value = false;
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la lista de reproducción',
            life: 3000
        });
    }
};

onMounted(() => {
    fetchData();
    cargarCanciones();
});
</script>