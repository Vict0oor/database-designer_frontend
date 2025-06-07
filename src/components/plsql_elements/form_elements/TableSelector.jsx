import React from 'react';

const TableSelector = ({ selectedTable, setSelectedTable, databaseTables }) => {
    return (
        <div className="mb-6">
            <label className="block mb-2 font-medium">Table:</label>
            <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full p-2 border rounded bg-[#000000] text-white"
            >
                <option value="">Select Table</option>
                {databaseTables && databaseTables.map(table => (
                    <option key={table.name} value={table.name}>
                        {table.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TableSelector;