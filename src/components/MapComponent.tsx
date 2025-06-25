'use client';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useStopStore } from '@/store/stop.store';
import { useShapeStore } from '@/store/shape.store';
import { useEffect } from 'react';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function AutoFitBounds({ fromShape, toShape }: any) {
  const map = useMap();

  useEffect(() => {
    const coords: [number, number][] = [];

    if (fromShape) {
      coords.push(...fromShape.map((p: any) => [p.latitude, p.longitude]));
    }
    if (toShape) {
      coords.push(...toShape.map((p: any) => [p.latitude, p.longitude]));
    }

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [fromShape, toShape, map]);

  return null;
}

export default function MapComponent() {
  const origin = useStopStore((state) => state.origin);
  const destination = useStopStore((state) => state.destination);
  const fromShape = useShapeStore(state => state.fromShapes);
  const toShape = useShapeStore(state => state.toShapes);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[-29.3, -67.5]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
         <AutoFitBounds fromShape={fromShape} toShape={toShape} />
        {origin && <Marker position={[origin.latitude, origin.longitude]} icon={DefaultIcon}>
          <Popup>{"Origen: " + origin.name}</Popup>
        </Marker>}
        {destination && <Marker position={[destination.latitude, destination.longitude]} icon={DefaultIcon}>
          <Popup>{"Destino: " + destination.name}</Popup>
        </Marker>}
        {fromShape && <Polyline positions={fromShape.map(shape => [shape.latitude, shape.longitude])} color="blue" />}
        {toShape && <Polyline positions={toShape.map(shape => [shape.latitude, shape.longitude])} color="blue" />}
   
      </MapContainer>
    </div>
  );
}