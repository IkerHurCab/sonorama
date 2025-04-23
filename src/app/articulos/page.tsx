"use client";
import { Navbar } from '../home/Navbar';
import { useState, useEffect, useCallback } from 'react';
import { FiltersArticulos as Filters } from './FiltersArticulos';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import eventsData from '../data/events.json';

// Interfaz para un artículo
interface Article {
    id: string;
    title: string;
    year: number;
    category: string;
    eventType: string;
    region: string;
    content: string;
    lat: number;
    lng: number;
    author: string;
    index?: number; // Añadido para generar IDs únicos
}

// Función para procesar los datos del JSON en un formato más fácil de usar
const processEvents = (): Article[] => {
    const articles: Article[] = [];
    
    // Contador para cada año para asegurar IDs únicos
    const yearCounters: Record<string, number> = {};
    
    // Recorremos cada año
    eventsData.events.forEach(yearData => {
        const year = yearData.year;
        
        // Inicializamos el contador para este año si no existe
        if (!yearCounters[year]) {
            yearCounters[year] = 0;
        }
        
        // Recorremos cada evento dentro del año
        yearData.events.forEach(event => {
            // Incrementamos el contador para este año
            yearCounters[year]++;
            
            // Usamos el contador como parte del ID para garantizar unicidad
            const uniqueId = `${year}-${event.name}-${yearCounters[year]}`;
            
            articles.push({
                id: uniqueId,
                title: event.name,
                year: year,
                category: event.category,
                eventType: event.type,
                region: event.region,
                content: event.description,
                lat: event.lat,
                lng: event.lng,
                author: "Gabi", // TODO: Cambiar por el nombre del autor correspondiente
                index: yearCounters[year]
            });
        });
    });
    
    return articles;
};

export default function Articulos() {
    // Estado para los filtros
    const [filters, setFilters] = useState({
        search: '',
        yearRange: [-35000, 2023] as [number, number],
        categories: [] as string[],
        eventTypes: [] as string[],
        regions: [] as string[]
    });

    const setSelectedYearRange = (range: [number, number]) => {
        setFilters(prev => ({
            ...prev,
            yearRange: range
        }));
    };

    const [articles, setArticles] = useState<Article[]>([]);

    // Función memoizada para procesar los datos
    const fetchArticles = useCallback(() => {
        const processedArticles = processEvents();
        setArticles(processedArticles);
    }, []);

    // Cargar y procesar los datos cuando el componente se monta
    // Y actualizar cada vez que cambien los datos del JSON
    useEffect(() => {
        fetchArticles();
        
        // Configuramos un intervalo para verificar cambios en los datos
        const intervalId = setInterval(() => {
            // Forzar actualización cada cierto tiempo para detectar cambios en el JSON
            fetchArticles();
        }, 5000); // Verificar cada 5 segundos
        
        return () => clearInterval(intervalId);
    }, [fetchArticles]);

    // Filtramos los artículos según los criterios seleccionados
    const filteredArticles = articles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            article.content.toLowerCase().includes(filters.search.toLowerCase());

        const matchesYearRange =
            article.year >= filters.yearRange[0] && article.year <= filters.yearRange[1];

        const matchesCategories =
            filters.categories.length === 0 || filters.categories.includes(article.category);

        const matchesEventTypes =
            filters.eventTypes.length === 0 || filters.eventTypes.includes(article.eventType);

        const matchesRegions =
            filters.regions.length === 0 || filters.regions.includes(article.region);

        return matchesSearch && matchesYearRange && matchesCategories && matchesEventTypes && matchesRegions;
    });

    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
        setFilters({
            search: '',
            yearRange: [-35000, 2023],
            categories: [],
            eventTypes: [],
            regions: []
        });
        setSelectedYearRange([-35000, 2023]);
    };

    return (
        <div className="flex flex-col min-h-screen bg-pink-100 dark:bg-[#0e0d0d] dark:text-white">
            <Navbar />
            
            {/* Contenedor principal con dos columnas */}
            <div className="flex flex-1">
                {/* Columna izquierda para artículos - ancho limitado para evitar unión con la columna de los filtros */}
                <div className="w-[calc(100%-300px)] overflow-y-auto pt-6 px-6 md:px-10 pb-8">
                    <h1 className="text-3xl font-bold mb-6 ml-2">Artículos</h1>
                    
                    {filteredArticles.length > 0 ? (
                        // Grid de artículos si hay resultados
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
                            {filteredArticles.map(article => (
                                <div key={article.id} className="bg-[url(/fondo-inverted.png)] dark:bg-[#0e0d0d] text-white shadow-lg rounded-lg hover:shadow-xl transition-shadow overflow-hidden">
                                    <div className="bg-black/80 dark:bg-black backdrop-blur-sm p-5 rounded-lg h-full flex flex-col">
                                        <h1 className="text-2xl font-bold text-center">{article.title}</h1>
                                        <p className="text-center mt-3 flex-grow">{article.content}</p>
                                        <div className="flex flex-wrap gap-2 justify-center mt-3">
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{article.year}</span>
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{article.category}</span>
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{article.eventType}</span>
                                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{article.region}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/10">
                                            <p className="pl-2 font-medium">{article.author}</p>
                                            <button className="border px-4 py-1 transition-all duration-300 border-white hover:bg-white hover:text-black rounded-md">Ver</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Mensaje cuando no hay resultados
                        <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg p-10 mt-4 max-w-2xl mx-auto">
                            <Search className="w-16 h-16 mb-4 text-gray-100" />
                            <h2 className="text-2xl font-semibold mb-2 text-gray-100">No se encontraron artículos</h2>
                            <p className="text-center text-gray-100 mb-6">
                                No hay artículos que coincidan con los criterios de búsqueda actuales.
                            </p>
                            {(filters.search !== '' || filters.categories.length > 0 ||
                                filters.eventTypes.length > 0 || filters.regions.length > 0 ||
                                filters.yearRange[0] !== -35000 || filters.yearRange[1] !== 2023) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4 cursor-pointer" />
                                    Limpiar todos los filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Columna derecha para filtros - ancho fijo */}
                <div className="w-[300px] h-[calc(100vh-64px)] sticky top-16 right-0">
                    <Filters
                        filters={filters}
                        setFilters={setFilters}
                        setSelectedYearRange={setSelectedYearRange}
                        minYear={-35000}
                        maxYear={2023}
                    />
                </div>
            </div>
            <Link href="/articulos/form">
                <button className="fixed w-11 bottom-4 left-2 text-[25px] backdrop-blur-md bg-[url(/fondo-inverted.png)] bg-black/90 text-white p-1 pt-0 rounded-full shadow-lg hover:bg-black/60 dark:bg-black dark:hover:bg-black transition-all duration-300 bg-blend-multiply cursor-pointer">
                    +
                </button>
            </Link>
        </div>
    );
}