import { useState } from "react";
import Header from "../components/Header";
import { Database, FileText } from "lucide-react";
import React from "react";
import DatabseConnectionForm from "../components/forms/databseConnectionForm";
import SqlFileForm from "../components/forms/SqlFileForm";
import SidebarPanel from "../components/bars/SidebarPanel";
import PlSqlPanel from "../components/plsql_elements/PlSqlPanel";
import {
    Workflow,
    FunctionSquare,
    Repeat,
    FileCode
} from "lucide-react";

const TypeSelector = ({ onSelect }) => {
    const types = [
        { id: 'procedure', name: 'Procedure', icon: <Workflow className="w-10 h-10 mb-2" /> },
        { id: 'function', name: 'Function', icon: <FunctionSquare className="w-10 h-10 mb-2" /> },
        { id: 'query', name: 'SQL Query', icon: <FileCode className="w-10 h-10 mb-2" /> },
    ];

    return (
        <div className="w-full px-4">
            <div className="bg-black p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">
                    Select PL/SQL item type
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {types.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className="bg-[#151515] aspect-square w-full cursor-pointer text-white rounded-lg shadow text-xl font-medium hover:bg-orange-500 transition-all flex flex-col items-center justify-center"
                        >
                            {type.icon}
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const PlSqlPage = () => {
    const [loadOption, setLoadOption] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [tables, setTables] = useState([]);
    const [databaseInfo, setDatabaseInfo] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const handleOptionClick = (option) => {
        setLoadOption(option);
    };

    const handleBackClick = () => {
        setLoadOption(null);
        setIsConnected(false);
        setTables([]);
        setSelectedType(null);
    };

    const handleTablesSuccess = (tablesData, connectionData) => {
        setDatabaseInfo(connectionData);
        setTables(tablesData);
        setIsConnected(true);
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const renderMainContent = () => {
        if (!loadOption && !selectedType) {
            return (
                <div className="flex flex-col justify-center items-center h-[80vh] w-full">
                    <h2 className="text-2xl p-4 rounded-t-md text-white bg-black font-semibold border-1">
                        Select Entity Loading Method
                    </h2>
                    <div className="w-3/4 h-80 bg-black rounded-xl grid grid-cols-2 overflow-hidden border-1">
                        <button
                            onClick={() => handleOptionClick("database")}
                            className="flex flex-col items-center justify-center text-white cursor-pointer hover:bg-orange-500 transition-all h-full"
                        >
                            <Database className="text-5xl mb-4" style={{ width: "60px", height: "60px" }} />
                            <span className="text-xl font-semibold">Load from Database</span>
                        </button>
                        <button
                            onClick={() => handleOptionClick("sql")}
                            className="flex flex-col items-center justify-center text-white cursor-pointer hover:bg-orange-500 transition-all h-full"
                        >
                            <FileText className="text-5xl mb-4" style={{ width: "60px", height: "60px" }} />
                            <span className="text-xl font-semibold">Load from SQL File</span>
                        </button>
                    </div>
                </div>
            );
        }

        if (isConnected && !selectedType) {
            return (
                <div className="flex flex-col justify-center items-center mt-5 w-full">
                    <TypeSelector onSelect={handleTypeSelect} />
                </div>
            );
        }

        if (isConnected && selectedType) {
            return (
                <PlSqlPanel
                    selectedType={selectedType}
                    onTypeChange={(type) => setSelectedType(type)}
                    databaseTables={tables}
                    databaseConData={databaseInfo}
                />
            );
        }

        if (loadOption === "database" && !isConnected) {
            return (
                <div className="flex justify-center items-center h-[80vh] w-full">
                    <DatabseConnectionForm onBack={handleBackClick} onSucces={handleTablesSuccess} />
                </div>
            );
        }

        if (loadOption === "sql" && !isConnected) {
            return (
                <div className="flex justify-center items-center h-[80vh] w-full">
                    <SqlFileForm onBack={handleBackClick} />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="mx-auto">
            <Header />
            <div className="flex w-full gap-4">
                {isConnected && (
                    <div className="w-1/5">
                        <SidebarPanel tables={tables} databaseData={databaseInfo} />
                    </div>
                )}
                <div className={`flex-grow ${isConnected ? "w-3/4" : "w-full"}`}>{renderMainContent()}</div>
            </div>
        </div>
    );
};

export default PlSqlPage;