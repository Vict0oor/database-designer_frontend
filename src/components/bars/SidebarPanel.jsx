import React, { useState } from "react";

const SidebarPanel = ({ tables, routines, databaseData }) => {
    const [expandedTables, setExpandedTables] = useState({});
    const [expandedRoutines, setExpandedRoutines] = useState({});

    const toggleTable = (tableName) => {
        setExpandedTables((prev) => ({
            ...prev,
            [tableName]: !prev[tableName],
        }));
    };

    const toggleRoutine = (routineName) => {
        setExpandedRoutines((prev) => ({
            ...prev,
            [routineName]: !prev[routineName],
        }));
    };

    const functions = routines?.filter(r => r.type === "FUNCTION") || [];
    const procedures = routines?.filter(r => r.type === "PROCEDURE") || [];

    return (
        <div className="w-full bg-black p-4 overflow-y-auto min-h-screen h-full">
            <h3 className="text-white text-lg font-semibold mb-2">Connected database</h3>

            <div className="text-sm text-gray-300 space-y-1 mb-4">
                <div>
                    <span className="font-semibold text-white">Database name:</span> {databaseData?.database || "N/A"}
                </div>
                <div>
                    <span className="font-semibold text-white">Username:</span> {databaseData?.username || "N/A"}
                </div>
            </div>

            <div className="w-full h-[2px] bg-white mt-2 mb-2" />

            <div className="mt-2">
                <span className="text-lg font-semibold text-white">Tables</span> ({tables.length}):
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
            {functions.length > 0 && (
                <>
                    <div className="w-full h-[2px] bg-white mt-6 mb-2" />
                    <div className="mt-2">
                        <span className="text-lg font-semibold text-white">Functions</span> ({functions.length}):
                    </div>
                    <ul className="mt-4 space-y-2">
                        {functions.map((routine, index) => (
                            <li key={index}>
                                <div
                                    onClick={() => toggleRoutine(routine.name)}
                                    className="text-white cursor-pointer hover:bg-orange-500 p-2 rounded flex justify-between items-center"
                                >
                                    <div>
                                        {routine.name}
                                        <span className="text-gray-400 text-sm"> ({routine.returnType})</span>
                                    </div>
                                    <span>{expandedRoutines[routine.name] ? "−" : "+"}</span>
                                </div>
                                {expandedRoutines[routine.name] && routine.parameters?.length > 0 && (
                                    <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-300">
                                        {routine.parameters.map((param, idx) => (
                                            <li key={idx}>
                                                • {param.name}{" "}
                                                <span className="text-gray-500">
                                                    ({param.mode} {param.dataType})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {procedures.length > 0 && (
                <>
                    <div className="w-full h-[2px] bg-white mt-6 mb-2" />
                    <div className="mt-2">
                        <span className="text-lg font-semibold text-white">Procedures</span> ({procedures.length}):
                    </div>
                    <ul className="mt-4 space-y-2">
                        {procedures.map((routine, index) => (
                            <li key={index}>
                                <div
                                    onClick={() => toggleRoutine(routine.name)}
                                    className="text-white cursor-pointer hover:bg-orange-500 p-2 rounded flex justify-between items-center"
                                >
                                    {routine.name}
                                    <span>{expandedRoutines[routine.name] ? "−" : "+"}</span>
                                </div>
                                {expandedRoutines[routine.name] && routine.parameters?.length > 0 && (
                                    <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-300">
                                        {routine.parameters.map((param, idx) => (
                                            <li key={idx}>
                                                • {param.name}{" "}
                                                <span className="text-gray-500">
                                                    ({param.mode} {param.dataType})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SidebarPanel;
