"use client";
import React, { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

interface Question {
  id: string;
  title: string;
  type: "matrix";
  rows: string[];
  columns: string[];
  isMultipleChoice: boolean;
  isRequired: boolean;
  responses: { [key: string]: string[] };
}

interface MatrixRendererProps {
  question: Question;
}

const MatrixRenderer: React.FC<MatrixRendererProps> = ({ question }) => {
  const [responses, setResponses] = useState<{ [key: string]: string[] }>(
    question.responses || {}
  );

  const handleResponse = (row: string, column: string, checked: boolean) => {
    setResponses((prev) => {
      const currentResponses = prev[row] || [];

      if (question.isMultipleChoice) {
        const newResponses = checked
          ? [...currentResponses, column]
          : currentResponses.filter((c) => c !== column);
        return { ...prev, [row]: newResponses };
      } else {
        return { ...prev, [row]: checked ? [column] : [] };
      }
    });
  };

  const isSelected = (row: string, column: string) => {
    return responses[row]?.includes(column) || false;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full " dir="rtl">
          <thead>
            <tr className="mb-4">
              <th className="text-right p-3  font-medium text-gray-700 min-w-[200px]">
                {/* Empty header cell */}
              </th>
              {question.columns.map((column, index) => (
                <th
                  key={index}
                  className="text-center p-3  font-medium text-gray-700 min-w-[120px]"
                  dir="rtl">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-gray-50 border-b-[20px] border-white">
                <td
                  className="text-right p-3 font-medium text-gray-800 bg-gray-50  mb-4"
                  dir="rtl">
                  {row}
                </td>
                {question.columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`text-center py-4 px-4 ${
                      colIndex === question.columns.length - 1 && "rounded-e-lg"
                    }`}>
                    {question.isMultipleChoice ? (
                      <div className="flex justify-center">
                        <Checkbox
                          id={`${rowIndex}-${colIndex}`}
                          checked={isSelected(row, column)}
                          onCheckedChange={(checked) =>
                            handleResponse(row, column, checked as boolean)
                          }
                          className="w-5 h-5"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          name={`row-${rowIndex}`}
                          id={`${rowIndex}-${colIndex}`}
                          checked={isSelected(row, column)}
                          onChange={(e) =>
                            handleResponse(row, column, e.target.checked)
                          }
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MatrixRenderer;
