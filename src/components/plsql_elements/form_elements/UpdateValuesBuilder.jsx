import React from 'react';

const UpdateValuesBuilder = ({ updateValues, updateUpdateValue }) => {
    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium">Values to be updated:</label>
            <div className="space-y-2">
                {updateValues.map((item, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-2 p-2 bg-[#1f1f1f] rounded">
                        <input
                            type="checkbox"
                            checked={item.include}
                            onChange={() => updateUpdateValue(index, 'include', null)}
                            className="w-5 h-5"
                        />
                        <div className="w-1/4">
                            <span className="text-gray-300">{item.column}</span>
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={item.value}
                                onChange={(e) => updateUpdateValue(index, 'value', e.target.value)}
                                className={`w-full p-1 border rounded ${item.include ? 'bg-[#1f1f1f] text-white' : 'bg-[#121111] text-gray-500'}`}
                                placeholder="New Value"
                                disabled={!item.include}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdateValuesBuilder;