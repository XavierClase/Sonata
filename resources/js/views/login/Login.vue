<template>
    <div class="container-fluid d-flex justify-content-center align-items-center" id="register-body">
        <div class="row justify-content-center w-100">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm mx-auto">
                    <div class="card-header bg-transparent col-md-10">
                        <img src="/images/logo.svg" alt="">
                        <h1>Iniciar Sesión</h1>
                    </div>
                    <div class="card-body col-md-7">

                        <form @submit.prevent="submitLogin">
                            <div class="">
                                <!-- Email -->
                                <div class="mb-4">
                                    <label for="email" class="form-label">{{ $t('email') }}</label>
                                    <input v-model="loginForm.email" id="email" type="email" class="form-control" required autofocus autocomplete="username">
                                    <!-- Validation Errors -->
                                    <div class="text-danger mt-1">
                                        <div v-for="message in validationErrors?.email">
                                            {{ message }}
                                        </div>
                                    </div>
                                </div>
                                <!-- Password -->
                                <div class="mb-4">
                                    <label for="password" class="form-label">
                                        {{ $t('password') }}
                                    </label>
                                    <input v-model="loginForm.password" id="password" type="password" class="form-control" required autocomplete="current-password">
                                    <!-- Validation Errors -->
                                    <div class="text-danger-600 mt-1">
                                        <div v-for="message in validationErrors?.password">
                                            {{ message }}
                                        </div>
                                    </div>
                                </div>
                                <!-- Remember me -->
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" v-model="loginForm.remember" id="flexCheckIndeterminate">
                                    <label class="form-check-label" for="flexCheckIndeterminate">
                                        {{ $t('remember_me') }}
                                    </label>
                                </div>

                                <!-- Buttons -->
                                <div class="flex items-center justify-end mt-4">
                                    <button class="btn btn-primary" :class="{ 'opacity-25': processing }" :disabled="processing">
                                        {{ $t('login') }}
                                    </button>
                                </div>
                            </div>
                            <!-- <router-link :to="{name: 'auth.forgot-password'}">{{ $t('forgot_password')}}</router-link> -->
                            <p> ¿No tienes cuenta? <router-link class="card-link" to="/register">{{ $t('Registrate') }}</router-link> </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import useAuth from '@/composables/auth'

const { loginForm, validationErrors, processing, submitLogin } = useAuth();
</script>

<style scoped>
    #register-body {
        height: 100vh;
        background: linear-gradient(#262265, #200834);
    }

    .card {
        display: flex;
        align-items: center;
        background: linear-gradient(
            #633291 10%,
            #A855F7 70%
        ); 

        border-radius: 0;
    }

    .card-header {
        display: flex;
        align-items: center;
        flex-direction: column;
        border-bottom: 1.5px solid white;
        color: white;
        margin-bottom: 30px;
    }
    
    .card-header h1 {
        font-weight: bold;
    }

    .card-body label {
        color: white;
    }
    .card-body input {
        height: 42px;
        background-color: transparent;
        border: 1px solid white;
        border-radius: 0;
        color: rgb(255, 255, 255);
    }
    .card-body input:focus {
        box-shadow: none;
    }

    .form-label {
        margin-bottom: 0px;
    }

    #artista_checkbox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.3rem;
    }
    #artista_checkbox input {
        width: 15px;
    }

    .card-body button {
        height: 47px;
        width: 100%;
        border-radius: 12px;
        background: linear-gradient(135deg, #EC4899, #5B21B6);
        font-weight: bold;
        font-size: 1.5rem;
        border: none;
    }

    #button-div p{
        display: flex;
        gap: 20px;
    }

    .card-link {
        color: #50227a;
    }
    .card-link:hover {
        color: #683399;
        transition: 0.3s;
    }

    .form-check-input {
        height: 15px !important;
        width: 15px !important;
    }

    /* Media query para pantallas de 500px o menos */
    @media (max-width: 500px) {
        .card-body {
            width: 100% !important;
            padding-left: 15px;
            padding-right: 15px;
        }
        
        .card-header {
            width: 100% !important;
        }
        
        .card-body input[type="email"],
        .card-body input[type="password"] {
            width: 100%;
        }
        
        .form-control {
            width: 100%;
        }
        
        .card-body button {
            width: 100%;
        }
        
        /* El checkbox mantiene su tamaño original */
        .form-check-input {
            height: 15px !important;
            width: 15px !important;
        }
    }
</style>