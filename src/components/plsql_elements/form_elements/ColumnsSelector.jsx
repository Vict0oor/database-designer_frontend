import React from 'react';

const ColumnsSelector = ({ selectedColumns, setSelectedColumns, availableColumns }) => {
    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium">Columns:</label>
            <select
                multiple
                value={selectedColumns}
                onChange={(e) => {
                    const selected = Array.from(
                        e.target.selectedOptions,
                        option => option.value
                    );
                    setSelectedColumns(selected);
                }}
                className="w-full p-2 border rounded bg-black text-white"
                size="5"
            >
                <option value="*">* (all columns)</option>
                {availableColumns.map(column => (
                    <option key={column.name} value={column.name}>
                        {column.name} ({column.type})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ColumnsSelector;