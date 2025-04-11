<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header mb-3">
                    <div class="flex justify-content-between align-items-center">
                        <h5 class="m-0 text-xl font-medium">Crear Lista de Reproducción</h5>
                        <Button icon="pi pi-arrow-left" label="Volver" class="p-button-outlined" @click="$router.push('/admin/listas')" />
                    </div>
                </div>

                <form @submit.prevent="submitForm" class="p-fluid">
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
                                            v-if="previewImage" 
                                            :src="previewImage" 
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
                                        chooseLabel="Seleccionar imagen"
                                        class="w-full"
                                    />
                                    <small class="p-error mt-2" v-if="errors.portada">{{ errors.portada[0] }}</small>
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
                                label="Guardar" 
                                icon="pi pi-save"
                                :loading="loading"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useListas from "@/composables/listasAdmin";
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const { storeLista, errors: listaErrors, loading } = useListas();
const errors = ref({});
const previewImage = ref(null);

const form = ref({
    nombre: '',
    descripcion: '',
    duracion_total: '00:00:00',
    portada: null
});

const onImageSelect = (event) => {
    form.value.portada = event.files[0];
    
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

const submitForm = async () => {
    try {
        errors.value = {};
        
        if (!form.value.portada) {
            errors.value.portada = ['La imagen de portada es obligatoria'];
            return;
        }
        
        await storeLista(form.value);
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Lista de reproducción creada correctamente',
            life: 3000
        });
        router.push("/admin/listas");
    } catch (e) {
        errors.value = listaErrors.value;
    }
};
</script>