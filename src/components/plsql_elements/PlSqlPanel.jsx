import React, { useState } from "react";
import SqlCodeContainer from "../SqlCodeContainer";
import ProcedureBuilder from "./ProcedureBuilder";
import FunctionBuilder from "./FunctionBuilder";
import RoutineExecutor from "./RoutineExecutor";
import { toast } from "react-toastify";
import SQLBuilder from "./SQLBuilder";
const typeLabels = {
    procedure: "Procedure",
    function: "Function",
    query: "SQL Query",
    execute: "Execute",
};
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useGenerateQuery } from "../../api/hooks/sqlHooks";
import { useGenerateProcedure, useGenerateFunction, useGenerateExeCode } from "../../api/hooks/sqlHooks";
import { useExecutePLSqlCode } from "../../api/hooks/databaseConnectionHooks";
import { motion, AnimatePresence } from "framer-motion";

const PlSqlPanel = ({ databaseConData, selectedType, onTypeChange, databaseTables, routines }) => {
    const [generatedCode, setGeneratedCode] = useState("");
    const [generateJson, setGenerateJson] = useState("");
    const [source, setSoruce] = useState("");
    const [resultRows, setResultRows] = useState([]);
    const [resultType, setResultType] = useState("");
    const [executionResult, setExecutionResult] = useState(null);
    const [showResultsPanel, setShowResultsPanel] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const { mutate: generateQueryMutate, isLoading } = useGenerateQuery(
        (data) => {
            setGeneratedCode(data);
        },
        (error) => {
            console.error("Query generation error:", error);
        }
    );

    const { mutate: generateProcedureMutate } = useGenerateProcedure(
        (procedureCode) => {
            setGeneratedCode(procedureCode);
        },
        (errorProcedure) => {
            console.error("Query generation error:", errorProcedure);
        }
    );

    const { mutate: generateFunctionMutate } = useGenerateFunction(
        (procedureCode) => {
            setGeneratedCode(procedureCode);
        },
        (errorProcedure) => {
            console.error("Query generation error:", errorProcedure);
        }
    );

    const { mutate: generateExeCodeMutate } = useGenerateExeCode(
        (procedureCode) => {
            setGeneratedCode(procedureCode);
        },
        (errorProcedure) => {
            console.error("Query generation error:", errorProcedure);
        }
    );

    const {
        mutate: executeCodeMutate,
        isLoading: isExecuting
    } = useExecutePLSqlCode({
        onSuccess: (response) => {
            setExecutionResult(response);
            setCurrentPage(1);

            if (response.status === "SUCCESS") {
                toast.success("Code executed successfully");
                setResultType(response.resultType || "");
                if (response.resultType === "RESULT_SET") {
                    setResultRows(response.result || []);
                } else {
                    setResultRows([]);
                }
            } else {
                toast.error("Execution failed: " + response.message);
                setResultType("ERROR");
                setResultRows([]);
            }
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || error.message || "Unknown error";
            toast.error("Execution error");
            setExecutionResult({ status: "ERROR", message: errorMessage });
            setResultType("ERROR");
            setResultRows([]);
        }
    });

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = resultRows.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(resultRows.length / rowsPerPage);

    const renderForm = () => {
        switch (selectedType) {
            case "procedure":
                return <ProcedureBuilder databaseTables={databaseTables} onJsonUpdate={handleJsonUpdate} />;
            case "function":
                return <FunctionBuilder databaseTables={databaseTables} onJsonUpdate={handleJsonUpdate} />;
            case "query":
                return <SQLBuilder databaseTables={databaseTables} onJsonUpdate={handleJsonUpdate} />;
            case "execute":
                return <RoutineExecutor availableRoutines={routines} onJsonUpdate={handleJsonUpdate} />;
            default:
                return null;
        }
    };

    const handleJsonUpdate = (json, soruce) => {
        console.log(json);
        setGenerateJson(json);
        setSoruce(soruce);
    };

    const handleExecuteCode = async () => {
        if (!generatedCode || !source) {
            toast("No code generated!");
            return;
        }

        const payload = {
            sqlCode: generatedCode,
            codeType: source,
            databaseConnectionRequest: {
                host: databaseConData.host,
                port: databaseConData.port,
                databaseName: databaseConData.database,
                username: databaseConData.username,
                password: databaseConData.password
            }
        };
        executeCodeMutate(payload);
    };

    const handleGenerateClick = () => {
        if (!generateJson) {
            alert("No JSON data to generate from!");
            return;
        }
        if (source?.toUpperCase().startsWith("QUERY")) {
            generateQueryMutate(generateJson);
        } else if (source === "PROCEDURE") {
            generateProcedureMutate(generateJson);
        } else if (source === "FUNCTION") {
            generateFunctionMutate(generateJson);
        } else if (source === "ROUTINE_EXECUTION") {
            generateExeCodeMutate(generateJson);
        } else {
            alert("Unsupported source type for generation");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Selected PL/SQL Element: {typeLabels[selectedType]}</h2>
                <select
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="border rounded p-2"
                >
                    {Object.entries(typeLabels).map(([value, label]) => (
                        <option className="bg-black" key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="border p-4 rounded">
                {renderForm()}
            </div>

            <div className="flex space-x-3">
                <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="bg-black p-3 rounded-md hover:bg-orange-500 cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? "Generating..." : "Generate PL/SQL Code"}
                </button>
                <button
                    onClick={handleExecuteCode}
                    disabled={!generatedCode}
                    className={`p-3 rounded-md cursor-pointer bg-black text-white 
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        ${generatedCode ? 'hover:bg-orange-500' : ''}`}
                >
                    Execute in Database
                </button>
            </div>

            {resultType && (
                <div>
                    <button
                        onClick={() => setShowResultsPanel(!showResultsPanel)}
                        className="mt-4 mb-4 px-4 py-2 bg-black cursor-pointer text-white rounded hover:bg-orange-500 flex items-center gap-2"
                    >
                        {showResultsPanel ? (
                            <>
                                Hide result <ChevronUp size={18} />
                            </>
                        ) : (
                            <>
                                Show result <ChevronDown size={18} />
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {showResultsPanel && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-auto border p-4 rounded bg-black mt-2 shadow-lg"
                            >
                                <h3 className="text-lg font-semibold mb-2">Execution result:</h3>

                                {resultType === "RESULT_SET" ? (
                                    resultRows.length === 0 ? (
                                        <p className="text-gray-600 italic">No results.</p>
                                    ) : (
                                        <>
                                            <table className="min-w-full border text-sm">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(resultRows[0]).map((col) => (
                                                            <th key={col} className="border px-2 py-1 bg-orange-500 text-left">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentRows.map((row, rowIndex) => (
                                                        <tr key={indexOfFirstRow + rowIndex}>
                                                            {Object.values(row).map((value, colIndex) => (
                                                                <td key={colIndex} className="border px-2 py-1">
                                                                    {value?.toString() ?? ""}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {totalPages > 1 && (
                                                <div className="flex justify-center mt-4 gap-2 items-center">
                                                    <button
                                                        className="p-1 rounded bg-[#171717] cursor-pointer text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        aria-label="Previous page"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>

                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i + 1)}
                                                            className={`px-3 py-1 rounded cursor-pointer ${currentPage === i + 1
                                                                ? "bg-orange-500 text-white"
                                                                : "bg-[#171717] text-white hover:bg-orange-500"
                                                                }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}

                                                    <button
                                                        className="p-1 rounded bg-[#171717] cursor-pointer text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        aria-label="Next page"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <p
                                        className={`text-base font-medium ${executionResult?.status === "ERROR"
                                            ? "text-red-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {executionResult?.message}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div>
                <SqlCodeContainer sqlCode={generatedCode} />
            </div>
        </div>
    );
};

export default PlSqlPanel;
