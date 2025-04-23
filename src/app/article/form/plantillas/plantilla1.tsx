// Plantilla1.tsx
import TextArea from "../bloques/textArea";
import ImageBlock from "../bloques/imagen";
import { useState } from "react";

interface Plantilla1Props {
    textArea1?: string;
    textArea2?: string;
    imageFile1?: File | null;
    imageFoot1?: string;
    shortCitation?: string;
    setTextArea1?: (value: string) => void;
    setTextArea2?: (value: string) => void;
    setImageFile1?: (file: File | null) => void;
    setImageFoot1?: (foot: string) => void;
    setShortCitation?: (value:string)=>void;
}

export default function Plantilla1({ textArea1, setTextArea1, textArea2, setTextArea2, imageFile1, setImageFile1, imageFoot1, setImageFoot1, shortCitation, setShortCitation  }: Plantilla1Props) {
    const phi = 1.618;
    const smallerWidth = 1 / (1 + phi) * 100;
    const largerWidth = phi / (1 + phi) * 100;

    const handleTextArea1Change = (value: string) => {
        if (setTextArea1) setTextArea1(value);
    };

    const handleTextArea2Change = (value: string) => {
        if (setTextArea2) setTextArea2(value);
    };

    const handleImageFileChange = (file: File | null) => {
        if (setImageFile1) setImageFile1(file);
    };

    const handleImageFootChange = (foot: string) => {
        if (setImageFoot1) setImageFoot1(foot);
    };
    const handleShortCitationChange = (value:string)=>{
        if(setShortCitation) setShortCitation(value);
    }

    return (
        <div className="flex flex-col w-[60%] aspect-210/297 rounded-lg outline-1 p-8 gap-2">
            <div className="flex gap-2 aspect-297/210">
                <div style={{ width: `${smallerWidth}%` }} className="">
                    <ImageBlock onFileChange={handleImageFileChange} onFootChange={handleImageFootChange} />
                </div>
                <div style={{ width: `${largerWidth}%` }} className="outline-1">
                    <TextArea onChange={handleTextArea1Change} />
                </div>
            </div>
            <div className="outline-1 w-full grow-1 ">
                <TextArea onChange={handleTextArea2Change} />
            </div>
            <div className="outline-1 w-full aspect-10/1">
            <TextArea onChange={handleShortCitationChange} />
            </div>
        </div>
    );
}