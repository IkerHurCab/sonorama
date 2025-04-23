
import TextArea from "../bloques/textArea";
import ImageBlock from "../bloques/imagen";
import { useState } from "react";

interface Plantilla1Props {
    textArea1?: string;
    shortCitation?: string;
    setTextArea1?: (value: string) => void;
    setShortCitation?: (value: string) => void;

}

export default function Plantilla2({ setTextArea1, setShortCitation }: Plantilla1Props) {

    const handleTextArea1Change = (value: string) => {
        if (setTextArea1) setTextArea1(value);
    };
    const handleShortCitationChange = (value: string) => {
        if (setShortCitation) setShortCitation(value);
    }
    return (
        <div className="flex flex-col w-[60%] aspect-210/297 rounded-lg outline-1 p-8 gap-2">
            <div className="outline-1 w-full grow-1">
                <TextArea onChange={handleTextArea1Change} />
            </div>
            <div className="outline-1 w-full aspect-10/1">
                <TextArea onChange={handleShortCitationChange} />
            </div>
        </div>
    )
}