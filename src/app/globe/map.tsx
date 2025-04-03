import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import eventsData from '../data/events.json';
import  Navbar  from '../home/Navbar';

interface HomeMapProps {
    selectedYearRange: [number, number];
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
}

import { LatLngBoundsLiteral } from 'leaflet';

const bounds: LatLngBoundsLiteral = [
    [-90, -180], // Esquina suroeste
    [90, 180]    // Esquina noreste
];

export function HomeMap({ selectedYearRange, filters }: HomeMapProps) {
    // Filtrar eventos según los criterios
    const getCurrentEvents = () => {
        const filteredEvents = eventsData.events
            .filter(event => {
                // Filtrar por rango de años
                if (event.year < selectedYearRange[0] || event.year > selectedYearRange[1]) {
                    return false;
                }

                return event.events.some(e => {
                    // Filtro por búsqueda
                    if (filters.search && !e.name.toLowerCase().includes(filters.search.toLowerCase()) &&
                        !e.description.toLowerCase().includes(filters.search.toLowerCase())) {
                        return false;
                    }

                    // Filtro por categorías
                    if (filters.categories.length > 0 && !filters.categories.includes(e.category)) {
                        return false;
                    }

                    // Filtro por tipos de eventos
                    if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(e.type)) {
                        return false;
                    }

                    // Filtro por regiones
                    if (filters.regions.length > 0 && !filters.regions.includes(e.region)) {
                        return false;
                    }

                    return true;
                });
            })
            .flatMap(event => event.events.map(e => ({ ...e, year: event.year })));

        return filteredEvents;
    };


    return (
        <div className='w-full h-screen relative z-0'>
            <MapContainer
                center={[41.3874, 2.1686]} // Centro inicial del mapa
                zoom={3}
                minZoom={2.2}
                maxZoom={20}
                maxBounds={bounds} 
                style={{
                    height: "100vh",
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
                worldCopyJump={false}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    url='https://tile.openstreetmap.de/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    minZoom={1}
                    maxZoom={18}
                />

                {getCurrentEvents().map((event, index) => (
                    <Marker
                        key={`${event.name}-${index}`}
                        position={[event.lat, event.lng]}
                    >
                        <Popup >
                            <div className='flex justify-between items-start mb-2'>
                                <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
                                <span className="text-sm font-medium text-gray-00">{event.year}</span>
                            </div>
                            <p className='text-sm text-gray-600 mb-3'>{event.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    {event.category}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                    {event.region}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                                    {event.type}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
