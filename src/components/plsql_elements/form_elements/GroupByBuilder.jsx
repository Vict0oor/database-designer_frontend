import React from 'react';
import { Trash2, Plus } from "lucide-react";

const GroupByBuilder = ({ groupByColumns, setGroupByColumns, availableColumns }) => {
    const addGroupByColumn = () => {
        if (availableColumns.length > 0) {
            const columnName = availableColumns[0].name;
            if (!groupByColumns.includes(columnName)) {
                setGroupByColumns([...groupByColumns, columnName]);
            }
        }
    };

    const removeGroupByColumn = (columnName) => {
        const newGroupBy = groupByColumns.filter(col => col !== columnName);
        setGroupByColumns(newGroupBy);
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Grouping (GROUP BY):</label>
                <button
                    onClick={addGroupByColumn}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-400"
                >
                    <Plus size={16} />
                </button>
            </div>

            {groupByColumns.length > 0 ? (
                <div className="space-y-2">
                    {groupByColumns.map(column => (
                        <div key={column} className="flex items-center gap-2 p-2 bg-[#1f1f1f] rounded">
                            <div className="flex-1">{column}</div>
                            <button
                                onClick={() => removeGroupByColumn(column)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No grouping columns</p>
            )}
        </div>
    );
};

export default GroupByBuilder;