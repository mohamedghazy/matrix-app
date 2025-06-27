"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionsList from "../components/QuestionsList";

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
export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: "",
      type: "matrix",
      rows: ["الصف 1"],
      columns: ["العمود 1"],
      isMultipleChoice: false,
      isSingleChoice: false,
      isRequired: false,
      isNew: true,
      responses: {},
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleUpdateQuestion = (
    id: string,
    updatedQuestion: Omit<Question, "id">
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...updatedQuestion, id } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicatedQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      title: `${question.title} (نسخة)`,
    };
    setQuestions((prev) => [...prev, duplicatedQuestion]);
  };

  const handleReorderQuestions = (reorderedQuestions: Question[]) => {
    setQuestions(reorderedQuestions);
  };
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="w-full flex flex-col gap-4 justify-center items-center">
        <QuestionsList
          questions={questions}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onDuplicateQuestion={handleDuplicateQuestion}
          onReorderQuestions={handleReorderQuestions}
        />
        <Button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 text-[#0E0464] border-[#0E0464] rounded-3xl"
          variant="outline">
          <Plus className="w-4 h-4" />
          إضافة سؤال جديد
        </Button>
      </div>
    </div>
  );
}
