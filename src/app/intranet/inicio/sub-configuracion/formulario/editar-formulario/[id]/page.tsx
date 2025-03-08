"use client";
import React from 'react';
import { useParams } from 'next/navigation';

const EditarFormulario: React.FC = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Editar Formulario</h1>
            <p>ID del formulario: {id}</p>
        </div>
    );
};

export default EditarFormulario;