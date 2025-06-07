import React from 'react';

const InsertValuesBuilder = ({ insertValues, updateInsertValue }) => {
    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium">Values to insert:</label>
            <div className="space-y-2">
                {insertValues.map((item, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-2 p-2 bg-[#1f1f1f] rounded">
                        <div className="w-1/3">
                            <span className="text-gray-300">{item.column}</span>
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={item.value}
                                onChange={(e) => updateInsertValue(index, e.target.value)}
                                className="w-full p-1 border rounded bg-[#1f1f1f] text-white"
                                placeholder="Value"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
                Leave the fields blank for default values or NULL
            </p>
        </div>
    );
};

export default InsertValuesBuilder;