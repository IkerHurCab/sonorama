import React from "react"
import { useState } from "react";
import Select from "react-select";

interface tagsProps { //añadiendo esta interfaz estamos dando informacion sobre que queremos que reciba de props TextArea
    onChange: (value: OptionType | null) => void;
    options: OptionType[];
}
interface OptionType {
    value: string;
    label: string;
  }


export default function Tag({options, onChange }: tagsProps) {
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

    const handleChange = (option: OptionType | null) => {
        setSelectedOption(option);
        onChange(option);
    };

    return (
        <div className="flex flex-col w-48">
            <label htmlFor="tags"> Tags</label>

            <Select
                name="tags"
                options={options}
                value={selectedOption}
                onChange={handleChange}
                isSearchable
                placeholder="Busca una opción..."
            />

        </div>
    )
}