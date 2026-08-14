import { useEffect, useRef } from 'react';
import type * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mapa solo-lectura de la ubicación de una propiedad (Leaflet + OpenStreetMap).
// Vite SPA: sin SSR, se inicializa en el useEffect.

const ICON_BASE = 'https://unpkg.com/leaflet@1.9.4/dist/images';

export default function PropertyMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const mod = await import('leaflet');
      const leaflet = (mod.default ?? mod) as typeof import('leaflet');
      if (cancelled || !containerRef.current || mapRef.current) return;

      const icon = leaflet.icon({
        iconUrl: `${ICON_BASE}/marker-icon.png`,
        iconRetinaUrl: `${ICON_BASE}/marker-icon-2x.png`,
        shadowUrl: `${ICON_BASE}/marker-shadow.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = leaflet.map(containerRef.current, { scrollWheelZoom: false }).setView([lat, lng], 16);
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        })
        .addTo(map);
      leaflet.marker([lat, lng], { icon }).addTo(map);
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 0);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  return <div ref={containerRef} className="w-full h-[300px] rounded-xl overflow-hidden" style={{ zIndex: 0 }} />;
}
