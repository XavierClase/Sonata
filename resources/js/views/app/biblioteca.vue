<template>
    <div class="show"></div>
    <div class="biblioteca-top">
        <h1>Tu Biblioteca</h1>

        <i 
            class="pi pi-plus" 
            style="font-size: 2rem"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false"
            @click="visible = true; resetFormulario()"
            title="Crear una lista nueva"
        ></i>
    </div>

    <div class="biblioteca-content">
        <div class="biblioteca-tusListas">
            <router-link :to="{ name: 'app.likes' }" class="biblioteca_tarjeta">
                <img src="/images/imgLikes.jpg" class="imagen_caja" alt="Fondo degradado con corazón blanco en el centro">
                <p>Mis Favoritos</p>
            </router-link>
            <router-link :to="{ name: 'app.lista', params: {id: lista.id} }" class="biblioteca_tarjeta" v-for="(lista, index) in listas" :key="lista.id">
                <img :src="getImageUrl(lista)" :alt="lista.nombre" class="imagen_caja">
                <p>{{ lista.nombre }}</p>
            </router-link>
        </div>

        
        <div class="biblioteca-favoritos">
            <h2>Listas Favoritas</h2>
            <div class="biblioteca-favoritos-tarjetas">
                <router-link :to="{ name: 'app.lista', params: {id: lista.id} }" class="biblioteca_tarjeta" v-for="(lista, index) in listasFavoritas" :key="lista.id">
                    <img :src="getImageUrl(lista)" :alt="lista.nombre" class="imagen_caja">
                    <p>{{ lista.nombre }}</p>
                </router-link>
            </div>

            <h2>Álbumes Favoritos</h2>
            <div class="biblioteca-favoritos-tarjetas" id="albumsFavs">
                <router-link :to="{ name: 'app.album', params: {id: album.id} }" class="biblioteca_tarjeta" v-for="(album, index) in albumesFavoritos" :key="album.id">
                    <img :src="getImageUrl(album)" :alt="album.nombre" class="imagen_caja">
                    <p>{{ album.nombre }}</p>
                </router-link>
            </div> 
        </div>
    </div>


    <Dialog class="crearLista-modal" v-model:visible="visible" modal header="Crea una lista" appendTo=".show">
        <form @submit.prevent="enviarFormulario">
            <div class="row">
                <div class="config-imagenes col-md-4">
                    <div class="imagen-crear-lista">
                        <img :src="PreviewImagenLista || '/images/placeholder1.jpg'" class="estilo_imagen">
                        <input type="file" @change="manejarImagenLista" accept="image/*" ref="archivoImagen" class="añadir_archivo" required >  
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="flex items-center gap-4 mb-4">
                        <FloatLabel variant="on">
                            <InputText class="crearLista-input" id="username"  v-model="listaData.nombre" required maxlength="45"/>
                            <label for="username">Nombre de la lista</label>
                        </FloatLabel>
                    </div>
                    <div class="flex items-center gap-4 mb-8">
                        <FloatLabel variant="on">
                            <Textarea class="crearLista-input" id="config-descripcion" rows="5" cols="30" style="resize: none" v-model="listaData.descripcion" maxlength="200" />
                            <label for="descripcion">Descripción</label>
                        </FloatLabel>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Guardar" @click="enviarYCerrar" :disabled="!esFormularioValido"></Button>
            </div>
        </form>
    </Dialog>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { datosBiblioteca } from "@/composables/biblioteca.js";

    const {
        getListasUsuario,
        listas,
        getListasFavs,
        listasFavoritas,
        getAlbumesFavs,
        albumesFavoritos,
        enviarFormulario,
        resetFormulario,
        listaData,
        PreviewImagenLista
    } = datosBiblioteca();

    const visible = ref(false);
    const isHovered = ref(false);

    onMounted(async () => {
        await getListasUsuario();
        await getListasFavs();
        await getAlbumesFavs();
    });

    function getImageUrl(lista) {
        let image = lista.portada;
        return new URL(image, import.meta.url).href;
    }

    const manejarImagenLista = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenLista.value) {
                URL.revokeObjectURL(PreviewImagenLista.value);
            }
            listaData.value.portada = file;
            PreviewImagenLista.value = URL.createObjectURL(file);
        }
    };

    const esFormularioValido = computed(() => {
        return listaData.value.nombre.trim() !== '' && listaData.value.portada;
    });

    const enviarYCerrar = async () => {
        const success = await enviarFormulario();
        if (success) {
            await getListasUsuario();
            visible.value = false;
        }
    };
</script>



<style scoped>

    .row {
        --bs-gutter-x: 1.5rem;
        --bs-gutter-y: 0;
        margin-right: calc(0* var(--bs-gutter-x)) !important; 
        margin-left: calc(0* var(--bs-gutter-x)) !important;
    }

    h2 {
        color: white;
        font-size: 2.3rem;
    }

    .biblioteca-top {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
    }

    .biblioteca-top h1 {
        margin-left: 90px;
    }

    .pi-plus {
        color: white;
        margin-right: 100px;
    }

    .pi:hover {
        cursor: pointer;
    }

    .biblioteca-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 50px;
    }

    .biblioteca-tusListas {
        width: 85%;
        display: flex;
        flex-wrap: wrap;
        gap: 50px;
    }

    .biblioteca-favoritos {
        width: 85%;
        padding-bottom: 20px;
    }

    .biblioteca-favoritos h2 {
        padding-top: 60px;
    }

    .biblioteca-favoritos-tarjetas {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 50px;
    }

    .biblioteca_tarjeta {
        cursor: pointer;
        transition: all 0.3s ease;
        width: 220px; 
        height: 220px;
        background-color: rgb(38, 12, 12);
        border-radius: 15px;
    }

    .biblioteca_tarjeta:hover {
        transform: scale(1.05);
    }

    .imagen_caja {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 10px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }


    .artista_radius {
        border-radius: 50%;
    }

    .biblioteca_tarjeta p{
        font-size: 14px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: white;
    }

    @media (width < 500px) {

        .biblioteca-top {
            justify-content: space-around;
        }

        .biblioteca-top h1 {
            margin: 0;
        }

        .pi-plus {
            margin: 0;
        }

        .biblioteca-tusListas {
            justify-content: center;
        }

        .biblioteca-favoritos {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 35px;
        }

        .biblioteca-favoritos-tarjetas {
            justify-content: center;
        }

        #albumsFavs {
            padding-bottom: 70px;
        }
    }
</style>


<style>

    /* --- Modal --- */


    .crearLista-modal {
        background-color: #200834 !important;
        border: 1px solid purple !important;
        width: 550px !important;
        color: white !important;
    }

    .crearLista-input{
        background-color: #200834 !important;
        border: 1px solid #A855F7 !important;
        color: white !important;
    }

    #config-descripcion {
        height: 180px;
        width: 280px;
    }

    .crearLista-modal label {
        color: #F472B6 !important;
        background: transparent !important;
    }

    .crearLista-modal Button {
        background-color: #A855F7 !important;
        border: none !important;
        color: white !important;
        
    }

    .crearLista-imagene {
        display: flex;
        flex-direction: column;
    }

    .imagen-crear-lista{
        position: relative;
        width: 130px;
        height: 130px;
        border: 2px dashed #f472b5;
        overflow: hidden;
        flex-shrink: 0;
    }

    .estilo_imagen {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
    }

    .añadir_archivo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    @media (width < 500px) {
        .crearLista-modal {
            width: 90% !important;
            max-width: 320px !important;
        }
        
        .crearLista-modal .row {
            flex-direction: column;
            align-items: center;
        }
        
        .crearLista-modal .config-imagenes, 
        .crearLista-modal .col-md-4 {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        
        .crearLista-modal .col-md-6 {
            width: 100%;
        }
        
        .crearLista-modal .flex.items-center {
            width: 100%;
        }
        
        .crearLista-modal .crearLista-input, 
        .crearLista-modal #config-descripcion {
            width: 100% !important;
        }
        
        .crearLista-modal .flex.justify-end {
            width: 100%;
            justify-content: center;
            margin-top: 15px;
        }
        
        .crearLista-modal Button {
            width: 100%;
        }
        
        /* Fix for close icon */
        .crearLista-modal .p-dialog-header-icons {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        
        .crearLista-modal .p-dialog-header-icon {
            color: #F472B6 !important;
            background-color: transparent !important;
            width: 2rem;
            height: 2rem;
            margin: 0;
            padding: 0;
        }
        
        .crearLista-modal .p-dialog-header {
            position: relative;
            padding-right: 30px !important;
        }

        .p-dialog-header button {
            width: 30px !important;
            height: 30px !important;
        }
}
</style>