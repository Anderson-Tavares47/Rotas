'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import Loading from '@/components/load/loading';
import Sidebar from '@/components/sidebar';
import styles from './styles.module.css';

const MapView = () => {
  const [savedRoute, setSavedRoute] = useState(null);
  const [leaflet, setLeaflet] = useState(null);
  const [mapComponents, setMapComponents] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const [L, reactLeaflet] = await Promise.all([
          import('leaflet'),
          import('react-leaflet')
        ]);
        setLeaflet(L);
        setMapComponents(reactLeaflet);
      }
    };
    loadLeaflet();
  }, []);

  useEffect(() => {
    const loadSavedRoute = () => {
      const routeData = localStorage.getItem('selectedRoutes');
      if (routeData) {
        const parsedRoute = JSON.parse(routeData);
        console.log('Conteúdo da rota salva:', parsedRoute);

        if (parsedRoute.routes && Array.isArray(parsedRoute.routes) && parsedRoute.routes.every(r => Array.isArray(r.coordinates))) {
          setSavedRoute(parsedRoute);
        } else {
          alert('A rota salva não está no formato esperado.');
        }
      } else {
        alert('Nenhuma rota salva encontrada no localStorage.');
      }
    };

    loadSavedRoute();
  }, []);

  if (!leaflet || !mapComponents || !savedRoute) {
    return <Loading/>;
  }

  const { MapContainer, TileLayer, Polyline, Polygon, Marker, Tooltip } = mapComponents;

  const mapCenter = savedRoute.routes.length > 0 && savedRoute.routes[0].coordinates.length > 0 
    ? savedRoute.routes[0].coordinates[0] 
    : [-30.0346, -51.2177];

  const createFencePolygon = (coords, bufferDistance) => {
    if (!coords || coords.length < 2) return null;
    const lineCoords = coords.map(coord => [coord[1], coord[0]]); // Inverte as coordenadas para o formato [lat, lon]
    const line = turf.lineString(lineCoords);
    const buffered = turf.buffer(line, bufferDistance, { units: 'kilometers' });
    return buffered.geometry.coordinates[0];
  };

  // Localização estática
  const staticLocation = [ -0.2201641, -78.5123274]; // Coordenadas de exemplo

  // Verifica se a localização está dentro de qualquer polígono
  const isInsideFence = savedRoute.routes.some(route => {
    const polygonCoords = createFencePolygon(route.coordinates, savedRoute.radius);
    if (!polygonCoords) return false;

    const point = turf.point(staticLocation);
    const polygon = turf.polygon([polygonCoords]);

    const isInside = turf.booleanPointInPolygon(point, polygon);
    console.log(`Verificando se o ponto ${JSON.stringify(staticLocation)} está dentro do polígono: ${isInside}`);
    return isInside;
  });

  console.log(`Estado de isInsideFence: ${isInsideFence}`);

  const markerIcon = leaflet.icon({
    iconUrl: isInsideFence 
      ? 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
      : 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
    <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div
      className={`${styles.container} ${
        isSidebarOpen ? styles['with-sidebar-open'] : styles['with-sidebar-closed']
      }`}
    >
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h2 style={{color: 'white'}}>Rotas Salvas para Motorista ID: {savedRoute.driver}</h2>
      <MapContainer center={mapCenter} zoom={6} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {savedRoute.routes.map((route, index) => (
          <React.Fragment key={index}>
            <Polyline positions={route.coordinates.map(coord => [coord[0], coord[1]])} color="blue" />
            {route.coordinates.length > 1 && (
              <Polygon 
                positions={createFencePolygon(route.coordinates, savedRoute.radius).map(coord => [coord[1], coord[0]])} 
                pathOptions={{ color: 'red', fillOpacity: 0.2 }} 
              />
            )}
          </React.Fragment>
        ))}
        <Marker position={staticLocation} icon={markerIcon}>
          <Tooltip direction="top" offset={[0, -30]} opacity={1}>
            Localização Estática
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
    </>
  );
};

export default MapView;
