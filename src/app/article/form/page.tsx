"use client";

import { useEffect, useState } from "react";
import Plantilla1 from "./plantillas/plantilla1";
import Plantilla2 from "./plantillas/plantilla2";
import AsyncSelect from "react-select/async";
import Tag from "./tags/tag";
import { useGetCities } from "../../hooks/getCities";
import { Navbar } from "../../home/Navbar";

interface OptionType {
    value: string;
    label: string;
}

const options: OptionType[] = [
    { value: "barroque", label: "Barroque" },
    { value: "classicism", label: "classicism" },
    { value: "romanticism", label: "romanticism" },
    { value: "mozart", label: "mozart" },
    { value: "bach", label: "bach" },
];

export default function Page() {
    const dataOfCities: {
        id: string;
        city: string;
        city_ascii: string;
        lat: string;
        lng: string;
        country: string;
        iso2: string;
        iso3: string;
        admin_name: string;
        capital: string;
        created_at: string;
        updated_at: string;
    }[] = useGetCities();
    const [location, setLocation] = useState<OptionType | null>(null);

    const [titulo, setTitulo] = useState("");
    const [nombre_autor, setNombre] = useState("");
    const [apellidos_autor, setApellidos] = useState("");
    const [centro, setCentro] = useState("");
    const [bibliografia, setBibliografia] = useState("");
    const [plantillaData, setPlantillaData] = useState<any[]>([]);
    const [requestTagList, setRequestTagList] = useState<string[]>([]);
    const [requestLocationId, setrequestLocationId] = useState(""); 
    const [id_autor, setUserId] = useState("");
    const [latitud, setlatitud] = useState("");
    const [longitud, setlongitud] = useState("");

    const [tag, setTag] = useState<OptionType | null>(null);
    const [tagList, setTagList] = useState<(OptionType | null)[]>([]);
    const [plantillas, setPlantillas] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            setUserId(userId);
            console.log(userId);
        } else {
            console.error("User ID not found in localStorage");
        }
    }, []);

    useEffect(() => {
        setrequestLocationId(location?.value || "");
        const city = dataOfCities.find((city) => city.id === location?.value);
        setlatitud(city?.lat || "");
        setlongitud(city?.lng || "");
    }, [location]);

    useEffect(() => {
        console.log(requestLocationId);
    }, [requestLocationId]);

    useEffect(() => {
        if (tagList) {
            setRequestTagList(tagList.map((tag) => tag?.value || ""));
        }
    }, [tagList]);

    const addPlantilla1 = () => {
        const newPlantillaData = {
            tipo: "plantilla1",
            textArea1: "",
            textArea2: "",
            imageFile1: null,
            imageFoot1: "",
            shortCitation: "",
        };

        setPlantillaData([...plantillaData, newPlantillaData]);

        const newPlantilla = (
            <Plantilla1
                key={plantillas.length}
                textArea1={newPlantillaData.textArea1}
                setTextArea1={(value) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, textArea1: value } : item
                        )
                    );
                }}
                textArea2={newPlantillaData.textArea2}
                setTextArea2={(value) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, textArea2: value } : item
                        )
                    );
                }}
                imageFile1={newPlantillaData.imageFile1}
                setImageFile1={(file: any) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, imageFile1: file } : item
                        )
                    );
                }}
                imageFoot1={newPlantillaData.imageFoot1}
                setImageFoot1={(foot: string) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, imageFoot1: foot } : item
                        )
                    );
                }}
                shortCitation={newPlantillaData.shortCitation}
                setShortCitation={(value: string) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, shortCitation: value } : item
                        )
                    );
                }}
            />
        );
        setPlantillas([...plantillas, newPlantilla]);
    };

    const addPlantilla2 = () => {
        const newPlantillaData = {
            tipo: "plantilla2",
            textArea1: "",
            shortCitation: "",
        };

        setPlantillaData([...plantillaData, newPlantillaData]);

        const newPlantilla = (
            <Plantilla2
                key={plantillas.length}
                setTextArea1={(value) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, textArea1: value } : item
                        )
                    );
                }}
                setShortCitation={(value) => {
                    setPlantillaData((prevData) =>
                        prevData.map((item, index) =>
                            index === plantillas.length ? { ...item, shortCitation: value } : item
                        )
                    );
                }}
            />
        );
        setPlantillas([...plantillas, newPlantilla]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            titulo,
            nombre_autor,
            apellidos_autor,
            centro,
            id_autor,
            plantillas: plantillaData,
            bibliografia,
            requestTagList,
            latitud,
            longitud,
        };
        fetch("http://localhost:8000/api/articles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        console.log(formData);
    };

    const loadCityOptions = (
        inputValue: string,
        callback: (options: OptionType[]) => void
    ) => {
        if (!inputValue) {
            callback([]);
            return;
        }

        const filteredCities = dataOfCities
            .filter((city) =>
                city.city.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 10)
            .map((city) => ({
                value: city.id,
                label: city.city + " " + city.country,
            }));
        callback(filteredCities);
    };

    useEffect(() => {
        if (tag) {
            setTagList((prevTags) => {
                const exists = prevTags.some((t) => t?.value === tag.value);
                return exists
                    ? prevTags.filter((t) => t?.value !== tag.value)
                    : [...prevTags, tag];
            });
            setTag(null);
        }
    }, [tag]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 dark:bg-[#0e0d0d] dark:text-white">
            <Navbar />
            <form
                id="mainForm"
                onSubmit={handleSubmit}
                className="flex flex-col bg-[url(/fondo-inverted.png)] rounded-lg gap-4 mx-110 mt-20"
            >
                <div className="bg-black/80 dark:bg-black backdrop-blur-sm p-12 rounded-lg h-full flex flex-col text-white">
                    <div className="flex flex-col">
                        <label htmlFor="titulo">Título</label>
                        <input
                            onChange={(e) => setTitulo(e.target.value)}
                            type="text"
                            name="titulo"
                            className="w-96 outline rounded p-1"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                onChange={(e) => setNombre(e.target.value)}
                                type="text"
                                name="nombre"
                                className="w-24 outline rounded p-1"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="apellidos">Apellidos</label>
                            <input
                                onChange={(e) => setApellidos(e.target.value)}
                                type="text"
                                name="apellidos"
                                className="w-48 outline rounded p-1"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="centro">Centro</label>
                            <input
                                onChange={(e) => setCentro(e.target.value)}
                                type="text"
                                name="centro"
                                className="w-48 outline rounded p-1"
                            />
                        </div>
                        <div className="min-w-96">
                            <label htmlFor="city">Ciudad</label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadCityOptions}
                                onChange={setLocation}
                                placeholder="Busca una ciudad..."
                                defaultOptions
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <Tag options={options} onChange={setTag} />
                        <div className="flex flex-wrap">
                            {tagList
                                .filter((tag) => tag !== null)
                                .map((tag, index) => (
                                    <p className="p-2" key={index}>
                                        {tag?.label};
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="flex gap-2 mb-5">
                        <button
                            type="button"
                            onClick={addPlantilla1}
                            className="p-2 border-white border-1 rounded-lg hover:bg-white hover:text-black hover:cursor-pointer"
                        >
                            Añadir Plantilla 1
                        </button>
                        <button
                            type="button"
                            onClick={addPlantilla2}
                            className="p-2 border-white border-1 rounded-lg hover:bg-white hover:text-black hover:cursor-pointer"
                        >
                            Añadir Plantilla 2
                        </button>
                    </div>

                    {plantillas.map((plantilla) => plantilla)}
                    <div className="flex flex-col w-full">
                        <label htmlFor="bibliografia">Bibliografía</label>
                        <textarea
                            onChange={(e) => setBibliografia(e.target.value)}
                            name="bibliografia"
                            id="bibliografia"
                            className="w-full text-white outline rounded p-1"
                        ></textarea>
                    </div>
                    <button
                        className="transition cursor-pointer select-none scale-100 active:scale-90 mt-2 max-w-fit p-2 border-1 rounded-lg"
                        type="submit"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
}