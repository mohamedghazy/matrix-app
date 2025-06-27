"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, GripVertical, Copy, Save, X } from "lucide-react";
import MatrixBuilder from "./MatrixBuilder";
import MatrixRenderer from "./MatrixRender";

interface Question {
  id: string;
  title: string;
  type: "matrix";
  rows: string[];
  columns: string[];
  isMultipleChoice: boolean;
  isSingleChoice: boolean;
  isRequired: boolean;
  responses: { [key: string]: string[] };
  isNew: boolean;
}

interface QuestionsListProps {
  questions: Question[];
  onUpdateQuestion: (id: string, question: Omit<Question, "id">) => void;
  onDeleteQuestion: (id: string) => void;
  onDuplicateQuestion: (question: Question) => void;
  onReorderQuestions: (questions: Question[]) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onReorderQuestions,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedItem(questionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = questions.findIndex((q) => q.id === draggedItem);
    const targetIndex = questions.findIndex((q) => q.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newQuestions = [...questions];
    const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedQuestion);

    onReorderQuestions(newQuestions);
    setDraggedItem(null);
  };

  const handleSave = (id: string, questionData: Omit<Question, "id">) => {
    onUpdateQuestion(id, questionData);
    setEditingId(null);
  };

  if (questions.length === 0) {
    return (
      <Card className="text-center py-12 w-3/4">
        <CardContent>
          <p className="text-gray-500 mb-4">لا توجد أسئلة حتى الآن</p>
          <p className="text-sm text-gray-400">
            اضغط على "إضافة سؤال جديد" لبدء إنشاء الأسئلة
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-3/4">
      {questions.map((question) => {
        return (
          <>
            {question.isNew ? (
              <MatrixBuilder
                initialData={question}
                onSave={(data) => handleSave(question.id, data)}
                showSaveButton={true}
                onDeleteQuestion={() => onDeleteQuestion(question.id)}
                onDuplicateQuestion={() =>
                  onDuplicateQuestion(question.id, question)
                }
              />
            ) : (
              <Card
                key={question.id}
                className="transition-shadow hover:shadow-lg mb-4"
                draggable={editingId !== question.id}
                onDragStart={(e) => handleDragStart(e, question.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, question.id)}>
                <CardHeader className="pb-4 flex items-center j" dir="rtl">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  </div>
                  <CardTitle
                    className="text-lg text-right text-gray-800"
                    dir="rtl">
                    {question.title}
                    {question.isRequired && (
                      <span className="text-red-500 mr-1">*</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <MatrixRenderer question={question} />
                </CardContent>
              </Card>
            )}
          </>
        );
      })}
    </div>
  );
};

export default QuestionsList;
