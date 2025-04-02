import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useHome() {
  const router = useRouter();
  const randomArtistas = ref([]);
  const randomAlbums = ref([]);
  const randomListas = ref([]);

  const fetchRandomArtistas = async () => {
    try {
      const response = await axios.get('/api/users', {
        params: {
          role: 'artista'
        }
      });
      const artists = response.data.data;
      const shuffled = artists.sort(() => 0.5 - Math.random());
      randomArtistas.value = shuffled.slice(0, 4);
    } catch (error) {
      console.error('Error fetching random artists:', error);
    }
  };

  const fetchRandomAlbums = async () => {
    try {
      const response = await axios.get('/api/albums/aleatorios');
      randomAlbums.value = response.data.data;
    } catch (error) {
      console.error('Error obteniendo álbumes aleatorios:', error);
    }
  };

  const fetchRandomListas = async () => {
    try {
      const response = await axios.get('/api/listas/aleatorias');
      randomListas.value = response.data.data;
    } catch (error) {
      console.error('Error obteniendo listas aleatorias:', error);
    }
  };
  
  const irADetallesLista = (idLista) => {
    router.push({ name: 'app.lista', params: { id: idLista } });
  };



  const irAPerfilArtista = (idArtista) => { 
    router.push({ name: 'artista.perfil', params: { id: idArtista } });
  };
  

const irADetallesAlbum = (idAlbum) => {
    router.push({ name: 'app.album', params: { id: idAlbum } });
  };


  return {
    randomAlbums,
    randomArtistas,
    randomListas,
    irADetallesAlbum,
    irADetallesLista,
    fetchRandomAlbums,
    fetchRandomArtistas,
    fetchRandomListas,
    irAPerfilArtista
  };
}

  
  
  
  
  
  

