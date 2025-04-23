
import React, { useRef } from "react";
import { useState, useEffect } from "react";

interface ImageBlockProps {
    onFileChange: (file: File | null) => void;
    onFootChange: (foot: string) => void;
}

export default function ImageBlock({ onFileChange, onFootChange }: ImageBlockProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageFoot, setImageFoot] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
                onFileChange(file);
            };
            reader.readAsDataURL(file);
        } else {
            onFileChange(null);
            setImageUrl(null);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFootChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const foot = event.target.value;
        setImageFoot(foot);
        onFootChange(foot);
    };


    return (

        <div className="flex flex-col justify-between w-full outline-1">
            <div className="">
                <img onClick={handleImageClick} className="w-full" src={imageUrl || 'https://placehold.co/210X297'} alt="foto campo" />
                <input onChange={handleFileChange} ref={fileInputRef} className="hidden" type="file" name="image" />
            </div>
            {imageUrl &&
                <input
                className='outline grow-1 w-full'
                type="text"
                placeholder="Pie de imagen"
                value={imageFoot}
                onChange={handleFootChange}
            />
            }
        </div>

    )
}
