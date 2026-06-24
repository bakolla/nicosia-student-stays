import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "@tanstack/react-router";
import { NEIGHBORHOODS, type Neighborhood } from "@/lib/types";
import { useLanguage } from "@/hooks/useLanguage";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Import Leaflet marker assets as URLs to fix bundler resolution
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";

// Override Default Icon configuration in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Coordinates for neighborhoods in Nicosia
const NEIGHBORHOOD_COORDS: Record<Neighborhood, [number, number]> = {
  Engomi: [35.1585, 33.325],
  Strovolos: [35.1378, 33.3486],
  "Agios Dometios": [35.1747, 33.3289],
  Lakatamia: [35.1114, 33.3136],
  Aglantzia: [35.1436, 33.3936],
  "City Centre": [35.1716, 33.3614],
};

// Center of Nicosia
const NICOSIA_CENTER: [number, number] = [35.15, 33.355];
const DEFAULT_ZOOM = 12;

interface MapInnerProps {
  highlightedNeighborhood?: Neighborhood;
  className?: string;
}

// Component to dynamically update map center and zoom level when prop changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapInner({ highlightedNeighborhood, className = "" }: MapInnerProps) {
  const { language, getNeighborhoodDesc, getNeighborhoodNearby } = useLanguage();
  const center = highlightedNeighborhood
    ? NEIGHBORHOOD_COORDS[highlightedNeighborhood]
    : NICOSIA_CENTER;

  const zoom = highlightedNeighborhood ? 14 : DEFAULT_ZOOM;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)] z-0 ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "350px" }}
        scrollWheelZoom={false}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {NEIGHBORHOODS.map((n) => {
          const coords = NEIGHBORHOOD_COORDS[n];
          const description = getNeighborhoodDesc(n);
          const nearby = getNeighborhoodNearby(n);

          return (
            <Marker key={n} position={coords}>
              <Popup>
                <div className="p-1 max-w-[240px] font-sans">
                  <h3 className="font-display text-base font-semibold text-primary m-0 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                    {n}
                  </h3>
                  <p className="mt-2 mb-3 text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {nearby.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] bg-secondary/80 text-secondary-foreground px-1.5 py-0.5 rounded-full font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/listings"
                    search={{ neighborhood: n } as never}
                    className="inline-block text-xs font-semibold text-accent hover:underline"
                  >
                    {language === "pl" ? `Zobacz oferty w ${n} →` : `See offers in ${n} →`}
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
