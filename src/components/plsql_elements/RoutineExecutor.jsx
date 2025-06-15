import React, { useState, useEffect } from 'react';
import { Play, Settings, CheckCircle } from "lucide-react";

const RoutineExecutor = ({ onJsonUpdate, availableRoutines = [] }) => {
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [parameterValues, setParameterValues] = useState({});
  const [resultVariable, setResultVariable] = useState('');

  const valueTypes = ['LITERAL', 'VARIABLE', 'PARAMETER', 'QUERY_RESULT'];

  const selectRoutine = (routineName) => {
    const routine = availableRoutines.find(r => r.name === routineName);
    setSelectedRoutine(routine);
    setParameterValues({});
    setResultVariable('');
  };

  const updateParameterValue = (paramName, field, value) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: {
        ...prev[paramName],
        [field]: value
      }
    }));
  };

  const renderParameterField = (param) => {
    const currentValue = parameterValues[param.name] || { type: 'LITERAL', value: ''};

    return (
      <div key={param.name} className="p-4 mb-4 rounded border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div>
            <label className="block mb-1 text-sm font-medium text-orange-500">
              {param.name}
            </label>
            <div className="text-xs text-gray-400">
              {param.dataType} ({param.mode})
            </div>
            <div className="text-xs text-gray-500">
              Position: {param.position}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Value Type:</label>
            <select
              value={currentValue.type || 'LITERAL'}
              onChange={(e) => updateParameterValue(param.name, 'type', e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            >
              {valueTypes.map(type => (
                <option key={type} value={type} className="bg-black">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">
              {currentValue.type === 'LITERAL' ? 'Value:' :
                currentValue.type === 'VARIABLE' ? 'Variable name:' :
                  currentValue.type === 'PARAMETER' ? 'Parameter name:' :
                    'SQL query:'}
            </label>
            {currentValue.type === 'QUERY_RESULT' ? (
              <textarea
                value={currentValue.value || ''}
                onChange={(e) => updateParameterValue(param.name, 'value', e.target.value)}
                className="w-full p-2 border rounded bg-black text-white"
                rows="2"
                placeholder="SELECT column FROM table..."
              />
            ) : (
              <input
                type="text"
                value={currentValue.value || ''}
                onChange={(e) => updateParameterValue(param.name, 'value', e.target.value)}
                className="w-full p-2 border rounded bg-black text-white"
                placeholder={
                  currentValue.type === 'LITERAL' ? 'Enter a value...' :
                    currentValue.type === 'VARIABLE' ? 'variable_name' :
                      currentValue.type === 'PARAMETER' ? 'parameter_name' :
                        'SELECT...'
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const generateJson = () => {
    if (!selectedRoutine) {
      return {
        routineName: null,
        routineType: null,
        returnType: null,
        resultVariable: null,
        parameters: []
      };
    }

    return {
      routineName: selectedRoutine.name,
      routineType: selectedRoutine.type,
      returnType: selectedRoutine.returnType || null,
      resultVariable: selectedRoutine.type === 'FUNCTION' ? resultVariable || null : null,
      parameters: selectedRoutine.parameters
        ? selectedRoutine.parameters
          .sort((a, b) => a.position - b.position)
          .map(param => ({
            name: param.name,
            mode: param.mode,
            dataType: param.dataType,
            position: param.position,
            valueType: parameterValues[param.name]?.type || 'LITERAL',
            value: parameterValues[param.name]?.value || '',
          }))
        : []
    };
  };

  useEffect(() => {
    const jsonData = generateJson();
    onJsonUpdate(jsonData, "ROUTINE_EXECUTION");
  }, [selectedRoutine, parameterValues, resultVariable]);

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Routine Executor Builder</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-xl">Select a procedure or function:</label>
        <select
          value={selectedRoutine ? selectedRoutine.name : ''}
          onChange={(e) => selectRoutine(e.target.value)}
          className="w-full p-3 border rounded bg-black text-white text-lg"
        >

          <optgroup label="Procedures">
            {availableRoutines
              .filter(routine => routine.type === 'PROCEDURE')
              .map(routine => (
                <option key={routine.name} value={routine.name} className="bg-black">
                  {routine.name}
                </option>
              ))}
          </optgroup>

          <optgroup label="Functions">
            {availableRoutines
              .filter(routine => routine.type === 'FUNCTION')
              .map(routine => (
                <option key={routine.name} value={routine.name} className="bg-black">
                  {routine.name}
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      {selectedRoutine && (
        <div className="mb-6 p-4 rounded border">
          <div className="flex items-center gap-3 mb-3">
            <div>
              <h2 className="text-xl font-semibold">{selectedRoutine.name}</h2>
              <div className="text-sm text-gray-400">
                Type: {selectedRoutine.type}
                {selectedRoutine.returnType && ` | Returns: ${selectedRoutine.returnType}`}
              </div>
            </div>
          </div>

          {selectedRoutine.type === 'FUNCTION' && (
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Result variable:</label>
              <input
                type="text"
                value={resultVariable}
                onChange={(e) => setResultVariable(e.target.value)}
                className="w-full p-2 border rounded bg-black text-white"
                placeholder="result_variable_name"
              />
            </div>
          )}
        </div>
      )}

      {selectedRoutine && selectedRoutine.parameters && selectedRoutine.parameters.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            Parameters ({selectedRoutine.parameters.length})
          </h3>
          {selectedRoutine.parameters
            .sort((a, b) => a.position - b.position)
            .map(param => renderParameterField(param))}
        </div>
      )}

      {selectedRoutine && (!selectedRoutine.parameters || selectedRoutine.parameters.length === 0) && (
        <div className="mb-6 p-4 rounded text-center text-gray-400">
          <p>This routine does not require any parameters</p>
        </div>
      )}

      {availableRoutines.length === 0 && (
        <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">No available routines</span>
          </div>
          <p className="text-sm mt-1">
            Pass available procedures and functions via the <code>availableRoutines</code> prop.
          </p>
        </div>
      )}

      {!selectedRoutine && availableRoutines.length > 0 && (
        <div className="text-center py-12 text-gray-400">
          <Play size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Select a procedure or function</p>
        </div>
      )}
    </div>
  );
};

export default RoutineExecutor;
