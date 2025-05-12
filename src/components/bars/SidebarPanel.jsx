import React, { useState } from "react";

const SidebarPanel = ({ tables, databaseData }) => {
    const [expandedTables, setExpandedTables] = useState({});

    const toggleTable = (tableName) => {
        setExpandedTables((prev) => ({
            ...prev,
            [tableName]: !prev[tableName],
        }));
    };
    console.log(databaseData);
    return (
        <div className="w-1/6 bg-black p-4 overflow-y-auto h-screen">
            <h3 className="text-white text-lg font-semibold mb-2">Connected database</h3>

            <div className="text-sm text-gray-300 space-y-1 mb-4">
                <div>
                    <span className="font-semibold text-white">Database name:</span> {databaseData?.database || "N/A"}
                </div>
                <div>
                    <span className="font-semibold text-white">Username:</span> {databaseData?.username || "N/A"}
                </div>
            </div>
            <div className="w-full h-[2px] bg-white mt-2" />
            <div className=" mt-2 ">
                <span className="text-lg font-semibold text-white">Tables</span> ({tables.length}) :
            </div>
            <ul className="mt-4 space-y-2">
                {tables.map((table, index) => (
                    <li key={index}>
                        <div
                            onClick={() => toggleTable(table.name)}
                            className="text-white cursor-pointer hover:bg-orange-500 p-2 rounded flex justify-between items-center"
                        >
                            {table.name}
                            <span>{expandedTables[table.name] ? "−" : "+"}</span>
                        </div>

                        {expandedTables[table.name] && (
                            <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-300">
                                {table.columns?.map((column, idx) => (
                                    <li key={idx}>
                                        • {column.name} <span className="text-gray-500">({column.type})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarPanel;
