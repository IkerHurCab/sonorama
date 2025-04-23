import { useState, useEffect } from "react";
import dominio from "../data/dominio.json";

export function useGetCities() {
    const [cities, setCities] = useState([]);
    useEffect(() => {
        fetch('/worldcities.json').then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            setCities(data);
        })
    }, []);
    return cities; 
}