import React from 'react';
import { Trash2, Plus } from "lucide-react";

const OrderByBuilder = ({ orderByColumns, setOrderByColumns, availableColumns }) => {
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
    const sortDirections = ['ASC', 'DESC'];

    const addOrderByColumn = () => {
        const newOrderBy = {
            id: generateId(),
            column: availableColumns.length > 0 ? availableColumns[0].name : '',
            direction: 'ASC'
        };
        setOrderByColumns([...orderByColumns, newOrderBy]);
    };

    const removeOrderByColumn = (id) => {
        const newOrderBy = orderByColumns.filter(item => item.id !== id);
        setOrderByColumns(newOrderBy);
    };

    const updateOrderByColumn = (id, field, value) => {
        const newOrderBy = orderByColumns.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setOrderByColumns(newOrderBy);
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Sorting (ORDER BY):</label>
                <button
                    onClick={addOrderByColumn}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-400"
                >
                    <Plus size={16} />
                </button>
            </div>

            {orderByColumns.length > 0 ? (
                <div className="space-y-2">
                    {orderByColumns.map(item => (
                        <div key={item.id} className="flex flex-wrap items-center gap-2 p-2 bg-[#1f1f1f] rounded">
                            <div className="flex-1 min-w-[150px]">
                                <select
                                    value={item.column}
                                    onChange={(e) => updateOrderByColumn(item.id, 'column', e.target.value)}
                                    className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                >
                                    {availableColumns.map(column => (
                                        <option key={column.name} value={column.name}>
                                            {column.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-24">
                                <select
                                    value={item.direction}
                                    onChange={(e) => updateOrderByColumn(item.id, 'direction', e.target.value)}
                                    className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                >
                                    {sortDirections.map(dir => (
                                        <option key={dir} value={dir}>{dir}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => removeOrderByColumn(item.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">No sorting columns</p>
            )}
        </div>
    );
};

export default OrderByBuilder;