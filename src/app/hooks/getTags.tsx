import { useState, useEffect } from "react";
import dominio from "../data/dominio.json";

import OptionType from "../article/form/page";

export function useGetTags() {
    const [tags, setTags] = useState<OptionType[]>([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        fetch(`${dominio.dominio + dominio.puerto + dominio.recursos.tags}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // opcional, pero útil si el servidor lo requiere
            },
        }).then((response) => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            data.forEach((tagElement: { id: any; name: any; }) => {
                const newDataObject: OptionType = {
                    value: tagElement.id,
                    label: tagElement.name,
                };
                setTags((prev) => [...prev, newDataObject]);
            });
            
        })
    }, []);
    return tags;
}