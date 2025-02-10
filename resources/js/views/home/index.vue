<template>
<!DOCTYPE html>
<html>
<body>
  <section class="banner">
    <div class="overlay"></div>
    <div class="iniciar_Sesion_Contenedor">
        <p class="iniciar_Sesion_P">¿tienes ya una cuenta? -></p>
        <button class="iniciar_Sesion_boton"><router-link  class="color_ruta" to="/login">{{ $t('Iniciar Sesión') }}</router-link></button>
    </div>
    <div class="contenedor">
      <div class="contenido">
      <img src="/images/logo.svg" >
        <p class="descripcion">
          Sonata es tu nuevo hogar para disfrutar de música ilimitada. Diseñada para ofrecer una experiencia inmersiva, te permite explorar un mundo sonoro sin fronteras. Descubre artistas emergentes y tus clásicos favoritos.
        </p>
        <div class="caracteristicas">
          <div class="caracteristica">
           <img src="/images/IconoCheck.svg">
            <span>Biblioteca global accesible</span>
          </div>
          <div class="caracteristica">
            <img src="/images/IconoCheck.svg">
            <span>Interfaz moderna e intuitiva</span>
          </div>
          <div class="caracteristica">
            <img src="/images/IconoCheck.svg">
            <span>Música en cualquier dispositivo</span>
          </div>
        </div>
          <button class="boton_banner"><router-link  class="color_ruta" to="/register">{{ $t('Comienza Gratis') }}</router-link></button>
      </div>
      <div class="imagen_contenedor">
        <img src="/images/Captura.JPG" alt="Music Streaming" class="banner-image">
      </div>
    </div>
  </section>

  <section class="ContenidoHome"> 
    <div class="overlay"></div>
    <div class="preguntasf_Contenido">
      <h2 class="preguntasf_titulo">Preguntas frecuentes</h2>
      
      <div class="preguntaf_caja">
        <div class="preguntaf_pregunta">¿Qué es Sonata?</div>
        <div class="preguntaf_respuesta">
          Sonata es una plataforma de streaming de música que te permite descubrir, escuchar y crear listas de reproducción con tus canciones favoritas. Accede a una biblioteca global de artistas y géneros, todo en un solo lugar.
        </div>
      </div>

      <div class="preguntaf_caja">
        <div class="preguntaf_pregunta">¿Dónde puedo usar Sonata?</div>
        <div class="preguntaf_respuesta">
          Puedes disfrutar de Sonata desde cualquier lugar a través de nuestra aplicación web o nuestras apps móviles para iOS y Android.
        </div>
      </div>

      <div class="preguntaf_caja">
        <div class="preguntaf_pregunta">¿Cómo puedo crear una lista de reproducción en Sonata?</div>
        <div class="preguntaf_respuesta">
          Crear una lista de reproducción en Sonata es fácil y divertido. Simplemente busca tus canciones favoritas, haz clic en el botón "Agregar a lista de reproducción" y selecciona o crea una nueva lista. Personaliza el nombre y el orden de las canciones para tener la música perfecta para cada ocasión.
        </div>
      </div>

      <div class="preguntaf_caja">
        <div class="preguntaf_pregunta">¿Cuánto cuesta Sonata?</div>
        <div class="preguntaf_respuesta">
          Sonata es completamente gratuita. Disfruta de toda la música que te encanta sin costo alguno, sin anuncios ni limitaciones.
        </div>
      </div>

      <div class="preguntaf_caja">
        <div class="preguntaf_pregunta">¿Puedo registrarme como artista?</div>
        <div class="preguntaf_respuesta">
          Sí, al crear tu cuenta en Sonata, puedes elegir entre registrarte como artista o como usuario normal. Los artistas tienen la posibilidad de subir su música y compartirla con la comunidad, mientras que los usuarios disfrutan de descubrir, escuchar y crear listas de reproducción con sus canciones favoritas.
        </div>
      </div>
    </div>

    <div class="preguntaf_imagen">
      Foto
    </div>

  </section>
  
</body>
</html>
</template>

<style scoped>
* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Inter var";
    }

    .banner {
      position: relative;
      height: 100vh;
      background: linear-gradient(to bottom, #4338ca, #7e22ce);
      color: white;
      overflow: hidden;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5 );
    }

    .iniciar_Sesion_Contenedor{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 12px 32px 0  0;
        gap: 20px;
        position: relative;
        z-index: 10;
    }

    .iniciar_Sesion_P{
        color: white;
        font-weight: 700;
        font-size: 16px;
    }

    .iniciar_Sesion_boton{
      background: linear-gradient(to right, #ec4899, #a855f7);
      padding: 12px 32px;
      border-radius: 500px;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .iniciar_Sesion_boton:hover{
      opacity: 0.7;
    }

    .contenedor {
      position: relative;
      z-index: 10;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 32px;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .contenido {
      width: 50%;
    }

    .contenido > * + * {
      margin-top: 24px;
    }



    .descripcion {
      font-size: 20px;
      color: white;
    }

    .caracteristicas {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .caracteristica {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .color_ruta{
      color: white;
      font-weight: 700;
    }


    .boton_banner {
      background: linear-gradient(to right, #ec4899, #a855f7);
      padding: 12px 32px;
      border-radius: 500px;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .boton_banner:hover {
      opacity: 0.7;
    }

    .imagen_contenedor {
      width: 50%;
      display: flex;
      justify-content: flex-end;
    }

    .banner-image {
      width: 500px;
      height: 400px;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transform: rotate(-6deg);
      transition: transform 0.3s;
      background-size: auto;
    }

    .banner-image:hover {
      transform: rotate(0);
    }

    .ContenidoHome{
      z-index: 100;
      position: relative;
      height: 100%;
      background: linear-gradient(to bottom, #7e22ce, #262265);
      color: white;
      overflow: hidden;
      padding: 64px 32px;
      display: flex;
      align-items: flex-start;
      gap: 64px;
    }

    .preguntasf_Contenido {
      flex: 1;
      position: relative;
      z-index: 10;
    }

    .preguntasf_titulo{
      font-size: 40px;
      font-weight: 700;
      background: linear-gradient(to right, #F472B6, #A855F7);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 32px;
    }

    .preguntaf_caja {
      z-index: 2000;
      margin-bottom: 24px;
    }

    .preguntaf_pregunta {
      font-size: 26px;
      color: #ec4899;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .preguntaf_respuesta {
      font-size: 20px;
      color: white;
    }

    .preguntaf_imagen {
      width: 400px;
      height: 400px;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 16px;
    }

</style>

