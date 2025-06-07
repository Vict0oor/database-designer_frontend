import React from 'react';
import { Trash2, Plus } from "lucide-react";

const WhereConditionsBuilder = ({ whereConditions, setWhereConditions, availableColumns }) => {
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
    const operators = ['=', '<>', '<', '>', '<=', '>=', 'LIKE', 'IN', 'IS NULL', 'IS NOT NULL', 'BETWEEN'];

    const addWhereCondition = () => {
        const newCondition = {
            id: generateId(),
            logicalOperator: whereConditions.length > 0 ? 'AND' : '',
            column: availableColumns.length > 0 ? availableColumns[0].name : '',
            columnType: availableColumns.length > 0 ? availableColumns[0].type : '',
            operator: '=',
            value: '',
            value2: ''
        };
        console.log(availableColumns);
        setWhereConditions([...whereConditions, newCondition]);
    };

    const removeWhereCondition = (id) => {
        const newConditions = whereConditions.filter(condition => condition.id !== id);

        if (newConditions.length > 0) {
            newConditions[0] = { ...newConditions[0], logicalOperator: '' };
        }

        setWhereConditions(newConditions);
    };

    const updateWhereCondition = (id, field, value) => {
        const newConditions = whereConditions.map(condition => {
            if (condition.id === id) {
                if (field === 'column') {
                    const columnType = availableColumns.find(col => col.name === value)?.type || '';
                    return { ...condition, column: value, columnType };
                }
                return { ...condition, [field]: value };
            }
            return condition;
        });
        setWhereConditions(newConditions);
    };


    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Condition (WHERE):</label>
                <button
                    onClick={addWhereCondition}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-400"
                >
                    <Plus size={16} />
                </button>
            </div>

            {whereConditions.length > 0 ? (
                <div className="space-y-2">
                    {whereConditions.map((condition, index) => (
                        <div key={condition.id} className="flex flex-wrap items-center gap-2 p-2 bg-[#1f1f1f] rounded">
                            {index > 0 && (
                                <div className="w-16">
                                    <select
                                        value={condition.logicalOperator}
                                        onChange={(e) => updateWhereCondition(condition.id, 'logicalOperator', e.target.value)}
                                        className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex-1 min-w-[120px]">
                                <select
                                    value={condition.column}
                                    onChange={(e) => updateWhereCondition(condition.id, 'column', e.target.value)}
                                    className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                >
                                    {availableColumns.map(column => (
                                        <option key={column.name} value={column.name}>
                                            {column.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-28">
                                <select
                                    value={condition.operator}
                                    onChange={(e) => updateWhereCondition(condition.id, 'operator', e.target.value)}
                                    className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                >
                                    {operators.map(op => (
                                        <option key={op} value={op}>{op}</option>
                                    ))}
                                </select>
                            </div>

                            {condition.operator !== 'IS NULL' && condition.operator !== 'IS NOT NULL' && (
                                <div className="flex-1 min-w-[120px]">
                                    <input
                                        type="text"
                                        value={condition.value}
                                        onChange={(e) => updateWhereCondition(condition.id, 'value', e.target.value)}
                                        className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                        placeholder={condition.operator === 'IN' ? "val1, val2, val3" : "Value"}
                                    />
                                </div>
                            )}

                            {condition.operator === 'BETWEEN' && (
                                <div className="flex-1 min-w-[120px]">
                                    <input
                                        type="text"
                                        value={condition.value2 || ''}
                                        onChange={(e) => updateWhereCondition(condition.id, 'value2', e.target.value)}
                                        className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                        placeholder="Final value"
                                    />
                                </div>
                            )}

                            <button
                                onClick={() => removeWhereCondition(condition.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No conditions WHERE</p>
            )}
        </div>
    );
};

export default WhereConditionsBuilder;