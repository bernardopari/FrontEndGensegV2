"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { guardarFormulario } from '@/services/api/formulario.service';
import { Toaster, toast } from "sonner" // Importa la función toast de sonner

export type QuestionType = 'TEXT' | 'MULTIPLECHOICE' | 'SINGLECHOICE' | 'DROPDOWN' | 'DATE' | 'FILE' | 'NUMBER';
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
}

export interface FormData {
  title: string;
  questions: Question[];
}


interface QuestionItemProps {
  question: Question;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, updateQuestion, deleteQuestion }) => {
    const handleTypeChange = (value: string) => {
      updateQuestion(question.id, { 
        type: value as Question['type'],
        options: value === 'select' || value === 'multiselect' ? [''] : undefined 
      });
    };
  
    return (
      <div className="mb-4 p-4 border rounded">
        <Input
          type="text"
          value={question.text}
          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
          placeholder="Titulo de la pregunta"
          className="mb-2 text-slate-900 dark:text-slate-100"
        />
        <Select onValueChange={handleTypeChange} value={question.type}>
          <SelectTrigger className="mb-2 text-slate-900 dark:text-slate-100">
            <SelectValue placeholder="Tipo de pregunta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TEXT">Tipo texto</SelectItem>
            <SelectItem value="DROPDOWN">Tipo desplegable</SelectItem>
            <SelectItem value="SINGLECHOICE">Tipo selección única</SelectItem>
            <SelectItem value="MULTIPLECHOICE">Tipo selección múltiple</SelectItem>
            <SelectItem value="FILE">Tipo archivo</SelectItem>
            <SelectItem value="DATE">Tipo fecha</SelectItem>
            <SelectItem value="NUMBER">Tipo numero</SelectItem>
          </SelectContent>
        </Select>
        {(question.type === 'DROPDOWN' || question.type === 'MULTIPLECHOICE' || question.type === 'SINGLECHOICE') && (
          <div className="mb-2 text-slate-900 dark:text-slate-100">
            {question.options?.map((option, index) => (
              <div key={index} className="flex mb-2">
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[index] = e.target.value;
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  placeholder={`Opción ${index + 1}`}
                  className="mr-2"
                />
                <Button onClick={() => {
                  const newOptions = question.options?.filter((_, i) => i !== index);
                  updateQuestion(question.id, { options: newOptions });
                }} variant="destructive">
                  Eliminar
                </Button>
              </div>
            ))}
            <Button onClick={() => {
              const newOptions = [...(question.options || []), ''];
              updateQuestion(question.id, { options: newOptions });
            }} variant="outline" className="mt-2">
              Agregar Opción
            </Button>
          </div>
        )}
        <Button onClick={() => deleteQuestion(question.id)} variant="destructive" className="mt-2">
          Eliminar Pregunta
        </Button>
      </div>
    );
  };
  
  
  interface AddQuestionButtonProps {
    addQuestion: (type: QuestionType) => void;
  }
  
  export const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ addQuestion }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className='bg-blue-600 text-white dark:text-slate-100'>Agregar Pregunta</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="grid gap-4">
            <Button onClick={() => addQuestion('TEXT')}>Tipo texto</Button>
            <Button onClick={() => addQuestion('DATE')}>Tipo fecha</Button>
            <Button onClick={() => addQuestion('SINGLECHOICE')}>Tipo selección única</Button>
            <Button onClick={() => addQuestion('MULTIPLECHOICE')}>Tipo selección múltiple</Button>
            <Button onClick={() => addQuestion('DROPDOWN')}>Tipo selección desplegable</Button>
            <Button onClick={() => addQuestion('FILE')}>Tipo archivo</Button>
            <Button onClick={() => addQuestion('NUMBER')}>Tipo numero</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  
  
  
  export const DynamicForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
      title: '',
      questions: [],
    });
    const [nombre, setNombre] = useState("");
    const [isFocusedNombre, setIsFocusedNombre] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();
    
  
    const addQuestion = (type: QuestionType) => {
      const newQuestion: Question = {
        id: uuidv4(),
        type,
        text: '',
        options: type === 'DROPDOWN' || type === 'MULTIPLECHOICE' || type === 'SINGLECHOICE' ? [''] : undefined,
      };
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
    };
  
    const updateQuestion = (id: string, updates: Partial<Question>) => {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.map(q => 
          q.id === id ? { ...q, ...updates } : q
        ),
      }));
    };
  
    const deleteQuestion = (id: string) => {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== id),
      }));
    };
  
    const redirigir = () => {
      router.push('/intranet/inicio/sub-configuracion/formulario?success=true');
    }
  
    const handleSaveForm = async () => {
      try {
        const response = await guardarFormulario(nombre, formData.questions);
        // Assuming guardarFormulario throws an error if something goes wrong
        setError(false);
        console.log("Formulario guardado exitosamente");
        toast.success("Formulario guardado exitosamente"); // Notificación de éxito
        redirigir();
      } catch (error) {
        setError(true);
        console.error("Error al guardar el formulario:", error);
      }
    };
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        
        <div className="relative mt-4" >
            <Label
              htmlFor="nombre-formulario"
              className={`absolute left-3 transition-all duration-200 cursor-text ${
                nombre || isFocusedNombre
                  ? "top-[-10px] text-sm bg-background px-1 text-primary"
                  : "top-3 text-muted-foreground"
              } ${error ? "text-red-500" : ""}`}
            >
              Titulo del formulario <span className="text-red-600">*</span>
            </Label>
            
            <Input
              id="nombre-formulario"
              value={nombre}
              onChange={(e) => {
                  setNombre(e.target.value);
                  if (error) setError(false); // Quitar error al escribir
                }}
              onFocus={() => setIsFocusedNombre(true)}
              onBlur={() => setIsFocusedNombre(false)}
              className={`pt-4 ${error ? "border-red-500" : ""}`}
              placeholder={isFocusedNombre ? "Escriba aqui el titulo del formulario" : ""}
            />
            {error && (
                <p className="mt-2 text-sm text-red-500">
                ¡Ups! El titulo es obligatorio
              </p>
            )}
          </div>

          <Separator className="my-4 bg-black" />
            <div className='border rounded p-4'>

        {formData.questions.map(question => (
            <QuestionItem
            key={question.id}
            question={question}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            />
        ))}

        <AddQuestionButton addQuestion={addQuestion} />
        <Button onClick={redirigir} className="mt-4 bg-red-600 text-white hover:bg-red-800 hover:text-white">
          Cancelar
        </Button>
        <Toaster position="bottom-right" />

        <Button onClick={handleSaveForm} className="mt-4 bg-green-600 hover:bg-green-800">
          Guardar Formulario
        </Button>
        </div>
      </div>
    );
  };

export default DynamicForm;

