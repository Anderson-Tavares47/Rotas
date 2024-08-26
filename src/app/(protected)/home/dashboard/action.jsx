'use server';

import axios from 'axios';

export async function getCoordinates(address) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
    });

    console.log(response.data, 'aqui response');

    if (response.data.length === 0) {
      throw new Error('Endereço não encontrado');
    }

    const { lat, lon } = response.data[0];
    return [parseFloat(lat), parseFloat(lon)];
  } catch (error) {
    console.error('Erro ao obter as coordenadas:', error.message || error);
    throw new Error('Erro ao obter as coordenadas'); // Rethrow o erro para ser tratado em um nível superior
  }
}

export async function getRoutes(start, end) {
  try {
    const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&alternatives=true&geometries=geojson`);
    const routes = response.data.routes.map(route => ({
      coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
      duration: route.duration // duração em segundos
    }));
    return routes;
  } catch (error) {
    console.error('Erro ao obter as rotas:', error.message || error);
    throw new Error('Erro ao obter as rotas'); // Rethrow o erro para ser tratado em um nível superior
  }
}
