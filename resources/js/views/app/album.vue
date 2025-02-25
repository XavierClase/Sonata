<template>
    <div class="perfil-artista-banner">
        <span>
            <div class="perfil-artista-banner-img">
                <img src="" alt="">
            </div>
            <h1>
                {{ user?.name }}
            </h1>
        </span>
            <i 
            
                :class="'pi pi-heart'" 
                style="font-size: 2rem"
                @mouseover="isHovered = true"
                @mouseleave="isHovered = false"
                v-if="userPropio?.name === user?.name" 
                 @click="visible = true"
            ></i>
        
    </div>
</template>

<script>

</script>

<style>
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

    .perfil-artista-banner {
        height: 180px;
        width: 100%;
        background-color: #200834;
        display: flex;
        align-items: center;
        position: relative;
        color: white;
    }

    .perfil-artista-banner span {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .perfil-artista-banner-img {
        height: 130px;
        width: 130px;
        border: 1px solid black;
        margin-left: 100px;
    }

    .pi-heart {
        position: absolute;
        top: 0;
        right: 0;
        color: white;
        margin: 13px;
    }

    .pi:hover {
        cursor: pointer;
    }
</style>