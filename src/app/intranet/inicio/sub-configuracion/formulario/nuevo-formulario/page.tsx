"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from 'next/navigation';
import { useRouter, usePathname } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

export type QuestionType = 'text' | 'multipleChoice' | 'singleChoice' | 'dropdown' | 'date' | 'archive' | 'Number';
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
            <SelectItem value="text">Tipo texto</SelectItem>
            <SelectItem value="dropdown">Tipo desplegable</SelectItem>
            <SelectItem value="singleChoice">Tipo selección única</SelectItem>
            <SelectItem value="multipleChoice">Tipo selección múltiple</SelectItem>
            <SelectItem value="archive">Tipo archivo</SelectItem>
            <SelectItem value="date">Tipo fecha</SelectItem>
            <SelectItem value="Number">Tipo numero</SelectItem>
          </SelectContent>
        </Select>
        {(question.type === 'dropdown' || question.type === 'multipleChoice' || question.type === 'singleChoice') && (
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
            <Button onClick={() => addQuestion('text')}>Tipo texto</Button>
            <Button onClick={() => addQuestion('date')}>Tipo fecha</Button>
            <Button onClick={() => addQuestion('singleChoice')}>Tipo selección única</Button>
            <Button onClick={() => addQuestion('multipleChoice')}>Tipo selección múltiple</Button>
            <Button onClick={() => addQuestion('dropdown')}>Tipo selección desplegable</Button>
            <Button onClick={() => addQuestion('archive')}>Tipo archivo</Button>
            <Button onClick={() => addQuestion('Number')}>Tipo numero</Button>
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
    const { idForm } = useParams();
    const router = useRouter();
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          // const response = await fetch(`${API_URL}/api/form/preguntas/${idForm}`);
          // const data = await response.json();
          // const formattedQuestions = data.map((q: any) => ({
          //   id: q.id.toString(),
          //   type: q.type,
          //   text: q.questionText,
          //   options: q.options || [],
          // }));
          //setFormData(prev => ({ ...prev, questions: formattedQuestions }));
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };
  
      fetchQuestions();
    }, [idForm]);
  
    const addQuestion = (type: QuestionType) => {
      const newQuestion: Question = {
        id: uuidv4(),
        type,
        text: '',
        options: type === 'dropdown' || type === 'multipleChoice' || type === 'singleChoice' ? [''] : undefined,
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
      router.back();
    }
  
    const saveForm = async () => {
        if (!nombre.trim()) {
            setError(true);
            return; // Mostrar error pero no cerrar el diálogo
            }
      try {
        const response = await fetch(`http://localhost:3006/api/form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preguntas: formData.questions, name: nombre }),
        });
  
        if (!response.ok){ 
          
        }
        
       setError(false);
       console.log('Form saved successfully');
       //redirigir();
      } catch (error) {
        
        console.error('Error saving form:', error);
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
        <Button onClick={saveForm} className="mt-4 bg-green-600 hover:bg-green-800">
          Guardar Formulario
        </Button>
        </div>
      </div>
    );
  };

export default DynamicForm;

