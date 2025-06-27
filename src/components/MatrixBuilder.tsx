"use client";
import React, { useState, useReducer, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Save, X, XIcon, Copy } from "lucide-react";

interface MatrixState {
  questionTitle: string;
  rows: string[];
  columns: string[];
  isMultipleChoice: boolean;
  isSingleChoice: boolean;
  isRequired: boolean;
  responses: { [key: string]: string[] };
}

interface Question {
  title: string;
  type: "matrix";
  rows: string[];
  columns: string[];
  isMultipleChoice: boolean;
  isSingleChoice: boolean;
  isRequired: boolean;
  responses: { [key: string]: string[] };
}

type MatrixAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "ADD_ROW"; payload: string }
  | { type: "REMOVE_ROW"; payload: number }
  | { type: "UPDATE_ROW"; payload: { index: number; value: string } }
  | { type: "ADD_COLUMN"; payload: string }
  | { type: "REMOVE_COLUMN"; payload: number }
  | { type: "UPDATE_COLUMN"; payload: { index: number; value: string } }
  | { type: "SET_MULTIPLE_CHOICE"; payload: boolean }
  | { type: "SET_SINGLE_CHOICE"; payload: boolean }
  | { type: "TOGGLE_REQUIRED" }
  | { type: "INITIALIZE"; payload: MatrixState };

const initialState: MatrixState = {
  questionTitle: "سؤال جديد",
  rows: ["الصف الأول"],
  columns: ["العمود الأول"],
  isMultipleChoice: false,
  isSingleChoice: false,
  isRequired: false,
  responses: {},
};

const matrixReducer = (
  state: MatrixState,
  action: MatrixAction
): MatrixState => {
  switch (action.type) {
    case "INITIALIZE":
      return action.payload;
    case "SET_TITLE":
      return { ...state, questionTitle: action.payload };
    case "ADD_ROW":
      return { ...state, rows: [...state.rows, action.payload] };
    case "REMOVE_ROW":
      if (state.rows.length <= 1) return state;
      const newRows = state.rows.filter((_, index) => index !== action.payload);
      return { ...state, rows: newRows };
    case "UPDATE_ROW":
      const updatedRows = [...state.rows];
      updatedRows[action.payload.index] = action.payload.value;
      return { ...state, rows: updatedRows };
    case "ADD_COLUMN":
      return { ...state, columns: [...state.columns, action.payload] };
    case "REMOVE_COLUMN":
      if (state.columns.length <= 1) return state;
      const newColumns = state.columns.filter(
        (_, index) => index !== action.payload
      );
      return { ...state, columns: newColumns };
    case "UPDATE_COLUMN":
      const updatedColumns = [...state.columns];
      updatedColumns[action.payload.index] = action.payload.value;
      return { ...state, columns: updatedColumns };
    case "SET_MULTIPLE_CHOICE":
      return {
        ...state,
        isMultipleChoice: action.payload,
        isSingleChoice: action.payload ? false : state.isSingleChoice, // If multiple choice is true, single choice must be false
        responses: {},
      };
    case "SET_SINGLE_CHOICE":
      return {
        ...state,
        isSingleChoice: action.payload,
        isMultipleChoice: action.payload ? false : state.isMultipleChoice, // If single choice is true, multiple choice must be false
        responses: {},
      };
    case "TOGGLE_REQUIRED":
      return { ...state, isRequired: !state.isRequired };
    default:
      return state;
  }
};

interface MatrixBuilderProps {
  onSave: (data: Omit<Question, "id">) => void;
  initialData?: Question | null;
  showSaveButton?: boolean;
  onDeleteQuestion: () => void;
  onDuplicateQuestion: (question: Question) => void;
}

const MatrixBuilder: React.FC<MatrixBuilderProps> = ({
  onSave,
  initialData,
  onDeleteQuestion,
  onDuplicateQuestion,
}) => {
  const [state, dispatch] = useReducer(matrixReducer, initialState);
  const [newRowText, setNewRowText] = useState("");
  const [newColumnText, setNewColumnText] = useState("");

  useEffect(() => {
    if (initialData) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          questionTitle: initialData.title,
          rows: initialData.rows,
          columns: initialData.columns,
          isMultipleChoice: initialData.isMultipleChoice,
          isSingleChoice: initialData.isSingleChoice,
          isRequired: initialData.isRequired,
          responses: initialData.responses,
        },
      });
    }
  }, [initialData]);

  const handleAddRow = () => {
    dispatch({ type: "ADD_ROW", payload: newRowText.trim() });
    setNewRowText("");
  };

  const handleAddColumn = () => {
    dispatch({ type: "ADD_COLUMN", payload: newColumnText.trim() });
    setNewColumnText("");
  };

  const handleSave = () => {
    const questionData = {
      title: state.questionTitle,
      type: "matrix" as const,
      rows: state.rows,
      columns: state.columns,
      isMultipleChoice: state.isMultipleChoice,
      isSingleChoice: state.isSingleChoice,
      isRequired: state.isRequired,
      responses: state.responses,
    };
    onSave(questionData);
  };

  return (
    <div className="space-y-6">
      <Card dir="ltr">
        <CardHeader className="flex justify-between">
          <CardTitle className="flex-1 text-center">مصفوفة</CardTitle>
          <Input
            id="questionTitle"
            // value={state.questionTitle}
            onChange={(e) =>
              dispatch({ type: "SET_TITLE", payload: e.target.value })
            }
            className="text-right flex-2 border-b border-[#0E0464]"
            dir="rtl"
            placeholder="أكتب سؤالك ...."
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-4">
            <table className="w-full " dir="rtl">
              <thead>
                <tr className=" mb-4 border-b-[20px] border-white">
                  <th className="text-right p-4 font-medium text-gray-700 min-w-[200px]">
                    {/* Empty header cell */}
                  </th>
                  {state.columns.map((column, index) => (
                    <th key={index} className="" dir="rtl">
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch({ type: "REMOVE_COLUMN", payload: index })
                          }
                          disabled={state.columns.length <= 1}
                          className="text-[#041C64] h-6 w-6 p-2 bg-[#0e046438]">
                          <XIcon className="w-3 h-3" />
                        </Button>
                        <Input
                          value={column}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_COLUMN",
                              payload: { index, value: e.target.value },
                            })
                          }
                          className="text-center text-sm bg-transparent"
                          dir="rtl"
                          placeholder={`عمود ${index + 1}`}
                        />
                      </div>
                    </th>
                  ))}
                  <th className="">
                    <div className="space-y-2">
                      <Button
                        onClick={handleAddColumn}
                        size="sm"
                        variant="link"
                        className="p-0 text-[#041C64]">
                        اضافة عمود
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="bg-gray-50 border-b-[20px] border-white">
                    <td className="p-2 bg-gray-50" dir="rtl">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch({ type: "REMOVE_ROW", payload: rowIndex })
                          }
                          disabled={state.rows.length <= 1}
                          className="text-[#041C64] h-6 w-6 p-2 bg-[#0e046438]">
                          <XIcon className="w-3 h-3" />
                        </Button>
                        <Input
                          value={row}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_ROW",
                              payload: {
                                index: rowIndex,
                                value: e.target.value,
                              },
                            })
                          }
                          className="text-right text-sm bg-transparent shadow-none"
                          dir="rtl"
                          placeholder={`صف ${rowIndex + 1}`}
                        />
                      </div>
                    </td>
                    {state.columns.map((column, colIndex) => (
                      <td key={colIndex} className="text-center p-4 ">
                        <div className="flex justify-center">
                          {state.isSingleChoice && (
                            <input
                              type="radio"
                              name={`single-choice-row-${rowIndex}`} // Use name for radio group
                              className="w-4 h-4"
                              disabled
                            />
                          )}
                          {state.isMultipleChoice && (
                            <input
                              type="checkbox"
                              name={`multiple-choice-row-${rowIndex}`}
                              className="w-4 h-4"
                              disabled
                            />
                          )}
                          {!state.isSingleChoice && !state.isMultipleChoice && (
                            // Optionally, render nothing or a placeholder if neither is selected
                            <span className="text-gray-400">?</span>
                          )}
                        </div>
                      </td>
                    ))}
                    <td className="text-center">
                      {/* Empty cell for new column input alignment */}
                    </td>
                  </tr>
                ))}

                <Button
                  onClick={handleAddRow}
                  size="sm"
                  variant="link"
                  className=" text-[#041C64] p-0 flex-shrink-0 my-4"
                  dir="rtl">
                  اضافة صف
                  <Plus className="w-3 h-3" />
                </Button>
              </tbody>
            </table>
          </div>
          <hr className="w-full h-0.5" />
          <div className="flex flex-col  mt-4" dir="rtl">
            <h2 className="font-semibold text-lg"> طريقة عرض السؤال</h2>
            <div className="flex flex-col ">
              <div className="flex mt-4 ">
                <input
                  id="multipleChoice"
                  type="checkbox"
                  checked={state.isMultipleChoice} // Bind to state
                  onChange={(e) =>
                    dispatch({
                      type: "SET_MULTIPLE_CHOICE",
                      payload: e.target.checked,
                    })
                  }
                  className="w-6 h-6 ml-4 checked:bg-[#041C64]"
                />
                <Label htmlFor="multipleChoice">اختيارات متعددة</Label>
              </div>
              <div className="flex mt-4 ">
                <input
                  id="singleChoice"
                  type="checkbox"
                  checked={state.isSingleChoice} // Bind to state
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SINGLE_CHOICE",
                      payload: e.target.checked,
                    })
                  }
                  className="w-6 h-6 ml-4 checked:bg-[#041C64]"
                />
                <Label htmlFor="singleChoice">اختيار واحد</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <hr className="w-full h-0.5" />
        <CardFooter className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              className="px-8 py-2 bg-[#0E0464] text-white rounded-3xl flex items-center">
              حفظ السؤال
              <Save className="w-4 h-4 mr-2" />
            </Button>
            <Button className="flex items-center gap-1 rounded-full bg-[#EAF5FF] hover:bg-none">
              <Copy className="w-4 h-4 text-[#0E0464]" />
            </Button>

            <Button
              className="bg-[#EAF5FF] rounded-full hover:bg-none"
              onClick={() => onDeleteQuestion()}>
              <Trash2 className="w-4 h-4 text-[#0E0464]" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse gap-4">
            <Label htmlFor="required">مطلوب</Label>
            <Switch
              id="required"
              checked={state.isRequired}
              onCheckedChange={() => dispatch({ type: "TOGGLE_REQUIRED" })}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MatrixBuilder;
