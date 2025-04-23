import React, { ChangeEvent, useState } from 'react';
import TextArea from './bloques/textArea';
import Imagen from './bloques/imagen';

interface TextAreaBlock {
    type: 'textArea';
    id: string;
    value: string;
}

interface ImageBlock {
    type: 'image';
    id: string;
    caption: string;
    url: string;
}

type Block = TextAreaBlock | ImageBlock;

function FlexForm() {
    const maxTA = 3;
    const maxIB = 2;

    const [titulo, setTitulo] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [centro, setCentro] = useState("");
    //problema, crea 2 vacias
    const [blocks, setBlocks] = useState<Block[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ titulo, nombre, apellidos, centro, blocks });
    };

    const addTextArea = () => {
        const textAreasCount = blocks.filter(block => block.type === 'textArea').length;
        if (textAreasCount < maxTA) {
            setBlocks([...blocks, { type: 'textArea', id: `block${blocks.length}`, value: "" }]);
        }
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const newBlocks = [...blocks];
        if (newBlocks[index]?.type === 'textArea') {
            (newBlocks[index] as TextAreaBlock).value = e.target.value;
            setBlocks(newBlocks);
        }
    };

    const addImageBlock = () => {
        const imageBlocksCount = blocks.filter(block => block.type === 'image').length;
        if (imageBlocksCount < maxIB) {
            setBlocks([...blocks, { type: 'image', id: `block${blocks.length}`, caption: "", url: "" }]);
        }
    };

    const handleCaptionChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newBlocks = [...blocks];
        if (newBlocks[index]?.type === 'image') {
            (newBlocks[index] as ImageBlock).caption = e.target.value;
            setBlocks(newBlocks);
        }
    };

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newBlocks = [...blocks];
        if (newBlocks[index]?.type === 'image') {
            (newBlocks[index] as ImageBlock).url = e.target.value;
            setBlocks(newBlocks);
        }
    };

    return (
        <>
            <div>
                <button onClick={addTextArea} className='transition cursor-pointer select-none scale-100 active:scale-90 max-w-fit p-2 bg-green-300 rounded-lg'>
                    Agregar TextArea
                </button>
                <button onClick={addImageBlock} className='transition cursor-pointer select-none scale-100 active:scale-90 max-w-fit p-2 bg-purple-300 rounded-lg'>
                    Agregar Imagen
                </button>
            </div>
            <form id="mainForm" onSubmit={handleSubmit} className='flex flex-col gap-4 p-12 outline m-4'>
                <div className='flex flex-col'>
                    <label htmlFor="titulo"> Título</label>
                    <input onChange={(e) => setTitulo(e.target.value)} type="text" className='w-96 outline rounded p-1' />
                </div>

                <div className='flex gap-4'>
                    <div className='flex flex-col'>
                        <label htmlFor="nombre"> Nombre</label>
                        <input onChange={(e) => setNombre(e.target.value)} type="text" className='w-24 outline rounded p-1' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="apellidos"> Apellidos</label>
                        <input onChange={(e) => setApellidos(e.target.value)} type="text" className='w-48 outline rounded p-1' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="centro"> Centro</label>
                        <input onChange={(e) => setCentro(e.target.value)} type="text" className='w-48 outline rounded p-1' />
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    {blocks.map((block, index) => {
                        if (block.type === 'textArea') {
                            return (
                                <TextArea
                                    key={block.id}
                                    areaID={block.id}
                                    value={block.value}
                                    onChange={(e) => handleTextChange(e, index)}
                                />
                            );
                        } else if (block.type === 'image') {
                            return (
                                <Imagen
                                    key={block.id}
                                    caption={block.caption}
                                    onCaptionChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCaptionChange(e, index)}
                                    url={block.url}
                                    onUrlChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e, index)}
                                />
                            );
                        }
                        return null; 
                    })}
                </div>

                <button className='transition cursor-pointer select-none scale-100 active:scale-90 max-w-fit p-2 bg-blue-300 rounded-lg' type="submit">
                    Enviar
                </button>
            </form>
        </>
    );
}

export default FlexForm;