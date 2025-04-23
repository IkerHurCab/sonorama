
import React from "react";
import { useState, useEffect } from "react";

interface TextAreaProps { //añadiendo esta interfaz estamos dando informacion sobre que queremos que reciba de props TextArea
    onChange: (value: string) => void;
}


export default function TextArea({ onChange }: TextAreaProps) {
    const [text, setText] = useState("");
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setText(newValue);
        onChange(newValue); 
    };
    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <textarea
                className='w-full h-full resize-none outline-0 p-2'
                value={text}
                onChange={handleChange}
            ></textarea>
        </div>
    );
}
