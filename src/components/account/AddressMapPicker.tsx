import { useEffect, useState } from "react";
import { LocateFixed, LoaderCircle, MapPin } from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type AddressCoordinates = {
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
};

type AddressMapPickerProps = {
  value: AddressCoordinates;
  onChange: (coordinates: AddressCoordinates) => void;
};

const MADAGASCAR_CENTER: [number, number] = [-18.8792, 47.5079];
const LOCATION_MARKER = L.divIcon({
  className: "lurevia-map-marker",
  html: "<span></span>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const MapInteractions = ({
  value,
  onChange,
}: AddressMapPickerProps) => {
  const map = useMap();
  useMapEvents({
    click(event) {
      onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });

  useEffect(() => {
    if (value.latitude === undefined || value.longitude === undefined) return;
    map.setView([value.latitude, value.longitude], Math.max(map.getZoom(), 15));
  }, [map, value.latitude, value.longitude]);

  if (value.latitude === undefined || value.longitude === undefined) return null;
  return (
    <Marker
      position={[value.latitude, value.longitude]}
      icon={LOCATION_MARKER}
      draggable
      eventHandlers={{
        dragend: (event) => {
          const point = event.target.getLatLng();
          onChange({ latitude: point.lat, longitude: point.lng });
        },
      }}
    />
  );
};

export const AddressMapPicker = ({ value, onChange }: AddressMapPickerProps) => {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const center: [number, number] = value.latitude !== undefined && value.longitude !== undefined
    ? [value.latitude, value.longitude]
    : MADAGASCAR_CENTER;

  const locateMe = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracyMeters: coords.accuracy,
        });
        setLocating(false);
      },
      () => {
        setError("Position indisponible. Autorisez la localisation ou placez le repère sur la carte.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 }
    );
  };

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-slate-700">Position de livraison</h3>
          <p className="text-[11px] text-slate-500">Utilisez votre position GPS ou placez le repère sur la carte.</p>
        </div>
        <button
          type="button"
          onClick={locateMe}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {locating ? <LoaderCircle size={15} className="animate-spin" /> : <LocateFixed size={15} />}
          Ma position
        </button>
      </div>

      <div className="h-64 overflow-hidden rounded-2xl border border-slate-200">
        <MapContainer center={center} zoom={value.latitude === undefined ? 6 : 15} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapInteractions value={value} onChange={onChange} />
        </MapContainer>
      </div>

      {value.latitude !== undefined && value.longitude !== undefined && (
        <p className="flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin size={13} />
          {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          {value.accuracyMeters !== undefined && ` · précision GPS ±${Math.round(value.accuracyMeters)} m`}
        </p>
      )}
      {error && <p role="alert" className="text-xs font-semibold text-red-600">{error}</p>}
    </section>
  );
};