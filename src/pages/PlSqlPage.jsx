import { useState } from "react";
import Header from "../components/Header";
import { Database, FileText } from "lucide-react";
import React from "react";
import DatabseConnectionForm from "../components/forms/databseConnectionForm";
import SqlFileForm from "../components/forms/SqlFileForm";

const PlSqlPage = () => {
    const [loadOption, setLoadOption] = useState(null);

    const handleOptionClick = (option) => {
        setLoadOption(option);
    };

    const handleBackClick = () => {
        setLoadOption(null);
    };

    return (
        <div className="mx-auto">
            <Header />

            {!loadOption && (
                <div className="flex flex-col justify-center items-center h-[80vh]">
                    <h2 className="text-2xl  p-4 rounded-t-md text-white bg-black font-semibold border-1">
                        Select Entity Loading Method
                    </h2>

                    <div className="w-3/4 h-80 bg-black rounded-xl grid grid-cols-2 overflow-hidden border-1">
                        <button
                            onClick={() => handleOptionClick("database")}
                            className="flex flex-col items-center justify-center text-white cursor-pointer hover:bg-orange-500 transition-all h-full"
                        >
                            <Database className="text-5xl mb-4" style={{ width: '60px', height: '60px' }} />
                            <span className="text-xl font-semibold">Load from Database</span>
                        </button>

                        <button
                            onClick={() => handleOptionClick("sql")}
                            className="flex flex-col items-center justify-center text-white cursor-pointer hover:bg-orange-500 transition-all h-full"
                        >
                            <FileText className="text-5xl mb-4" style={{ width: '60px', height: '60px' }} />
                            <span className="text-xl font-semibold">Load from SQL File</span>
                        </button>
                    </div>
                </div>
            )}

            {
                loadOption === "database" ? (
                    <div className="flex justify-center items-center h-[80vh]">
                        <DatabseConnectionForm onBack={handleBackClick} />
                    </div>
                ) : (
                    <SqlFileForm onBack={handleBackClick} />
                )}
        </div>

    );
};

export default PlSqlPage;
