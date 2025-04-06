import React, { useState } from "react";
import { Database, FileJson } from "lucide-react"

const Header = () => {
    const [activeTab, setActiveTab] = useState("erd");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <header className="w-full h-16 bg-orange-500 border-b-2 border-orange-500 overflow-hidden">
            <div className="flex w-full h-full">
                <button
                    onClick={() => handleTabChange("erd")}
                    className={`w-1/2 h-full bg-black text-white font-medium ${activeTab === "erd" ? "bg-orange-500" : ""} cursor-pointer`}
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
                        transition: "background-color 0.3s ease, transform 0.3s ease",
                        transform: activeTab === "erd" ? "scaleY(1.05)" : "scaleY(1)",
                    }}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <Database />
                        <span className="text-center block">Generate Database From ERD Diagram</span>
                    </div>

                </button>

                <button
                    onClick={() => handleTabChange("plsql")}
                    className={`w-1/2 h-full bg-black text-white font-medium ${activeTab === "plsql" ? "bg-orange-500" : ""} cursor-pointer`}
                    style={{
                        clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
                        transition: "background-color 0.3s ease, transform 0.3s ease",
                        transform: activeTab === "plsql" ? "scaleY(1.05)" : "scaleY(1)",
                    }}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <FileJson />
                        <span className="text-center block">Generate PL/SQL</span>
                    </div>

                </button>
            </div>
        </header>
    );
};

export default Header;
