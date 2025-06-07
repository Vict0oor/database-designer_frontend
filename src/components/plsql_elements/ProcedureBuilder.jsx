import React, { useState, useEffect } from 'react';
import { ATTRIBUTE_TYPES, LENGTH_SUPPORTING_TYPES, PRECISION_SUPPORTING_TYPES } from '../../constants/attributeTypes';
import { Trash2, ArrowDown, ArrowUp, PlusCircle, ChevronDown, ChevronRight } from "lucide-react";
import SQLBuilder from './SQLBuilder';

const ProcedureBuilder = ({ onJsonUpdate, databaseTables }) => {
  const [procedureName, setProcedureName] = useState('');
  const [parameters, setParameters] = useState([]);
  const [variables, setVariables] = useState([]);
  const [steps, setSteps] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [availableColumns, setAvailableColumns] = useState([]);

  const paramTypes = ['IN', 'OUT', 'IN OUT'];

  const stepTypes = [
    'QUERY', 'SELECT INTO', 'IF-ELSE', 'LOOP', 'EXCEPTION', 'CUSTOM'
  ];

  const exceptionTypes = [
    'NO_DATA_FOUND',
    'TOO_MANY_ROWS',
    'DUP_VAL_ON_INDEX',
    'VALUE_ERROR',
    'ZERO_DIVIDE',
    'OTHERS',
    'CUSTOM_WHEN'
  ];

  const loopTypes = [
    'FOR', 'WHILE'
  ];

  useEffect(() => {
    if (selectedTable && databaseTables) {
      const tableInfo = databaseTables.find(table => table.name === selectedTable);
      if (tableInfo) {
        setAvailableColumns(tableInfo.columns || []);
      } else {
        setAvailableColumns([]);
      }
    } else {
      setAvailableColumns([]);
    }
  }, [selectedTable, databaseTables]);

  const addParameter = () => {
    setParameters([...parameters, {
      name: '',
      type: ATTRIBUTE_TYPES[0],
      size: '',
      precision: '',
      direction: paramTypes[0]
    }]);
  };

  const removeParameter = (index) => {
    const newParams = [...parameters];
    newParams.splice(index, 1);
    setParameters(newParams);
  };

  const updateParameter = (index, field, value) => {
    const newParams = [...parameters];
    newParams[index][field] = value;
    setParameters(newParams);
  };

  const supportsLength = (dataType) => {
    return LENGTH_SUPPORTING_TYPES.includes(dataType) || PRECISION_SUPPORTING_TYPES.includes(dataType);
  };

  const supportsPrecision = (dataType) => {
    return PRECISION_SUPPORTING_TYPES.includes(dataType);
  };

  const addVariable = () => {
    setVariables([...variables, {
      name: '',
      type: ATTRIBUTE_TYPES[0],
      size: '',
      precision: '',
      defaultValue: ''
    }]);
  };

  const removeVariable = (index) => {
    const newVars = [...variables];
    newVars.splice(index, 1);
    setVariables(newVars);
  };

  const updateVariable = (index, field, value) => {
    const newVars = [...variables];
    newVars[index][field] = value;
    setVariables(newVars);
  };

  const addStep = (parentPath = null) => {
    if (!parentPath) {
      setSteps([...steps, {
        type: stepTypes[0],
        content: '',
        condition: stepTypes[0] === 'IF-ELSE' ? '' : undefined,
        queryData: stepTypes[0] === 'QUERY' || stepTypes[0] === 'SELECT INTO' ? {} : undefined,
        intoTarget: stepTypes[0] === 'SELECT INTO' ? '' : undefined,
        loopType: stepTypes[0] === 'LOOP' ? loopTypes[0] : undefined,
        loopCondition: stepTypes[0] === 'LOOP' ? '' : undefined,
        exceptionType: stepTypes[0] === 'EXCEPTION' ? exceptionTypes[0] : undefined,
        customExceptionName: stepTypes[0] === 'EXCEPTION' ? '' : undefined,
        nestedSteps: [],
        expanded: true
      }]);
    } else {
      const updatedSteps = [...steps];
      const addStepAtPath = (stepsArray, path, currentIndex = 0) => {
        if (currentIndex === path.length - 1) {
          stepsArray[path[currentIndex]].nestedSteps.push({
            type: stepTypes[0],
            content: '',
            condition: stepTypes[0] === 'IF-ELSE' ? '' : undefined,
            queryData: stepTypes[0] === 'QUERY' || stepTypes[0] === 'SELECT INTO' ? {} : undefined,
            intoTarget: stepTypes[0] === 'SELECT INTO' ? '' : undefined,
            loopType: stepTypes[0] === 'LOOP' ? loopTypes[0] : undefined,
            loopCondition: stepTypes[0] === 'LOOP' ? '' : undefined,
            exceptionType: stepTypes[0] === 'EXCEPTION' ? exceptionTypes[0] : undefined,
            customExceptionName: stepTypes[0] === 'EXCEPTION' ? '' : undefined,
            nestedSteps: [],
            expanded: true
          });
          return stepsArray;
        }

        stepsArray[path[currentIndex]].nestedSteps = addStepAtPath(
          stepsArray[path[currentIndex]].nestedSteps,
          path,
          currentIndex + 1
        );

        return stepsArray;
      };

      setSteps(addStepAtPath(updatedSteps, parentPath));
    }
  };

  const removeStep = (path) => {
    if (path.length === 1) {
      const newSteps = [...steps];
      newSteps.splice(path[0], 1);
      setSteps(newSteps);
    } else {
      const updatedSteps = [...steps];
      const removeStepAtPath = (stepsArray, path, currentIndex = 0) => {
        if (currentIndex === path.length - 2) {
          stepsArray[path[currentIndex]].nestedSteps.splice(path[path.length - 1], 1);
          return stepsArray;
        }

        stepsArray[path[currentIndex]].nestedSteps = removeStepAtPath(
          stepsArray[path[currentIndex]].nestedSteps,
          path,
          currentIndex + 1
        );

        return stepsArray;
      };

      setSteps(removeStepAtPath(updatedSteps, path));
    }
  };

  const updateStep = (path, field, value) => {
    if (path.length === 1) {
      const newSteps = [...steps];
      newSteps[path[0]][field] = value;
      setSteps(newSteps);
    } else {
      const updatedSteps = [...steps];
      const updateStepAtPath = (stepsArray, path, field, value, currentIndex = 0) => {
        if (currentIndex === path.length - 1) {
          stepsArray[path[currentIndex]][field] = value;
          return stepsArray;
        }

        stepsArray[path[currentIndex]].nestedSteps = updateStepAtPath(
          stepsArray[path[currentIndex]].nestedSteps,
          path,
          field,
          value,
          currentIndex + 1
        );

        return stepsArray;
      };

      setSteps(updateStepAtPath(updatedSteps, path, field, value));
    }
  };

  const updateStepQueryData = (path, queryData) => {
    if (path.length === 1) {
      const newSteps = [...steps];
      newSteps[path[0]].queryData = queryData;
      setSteps(newSteps);
    } else {
      const updatedSteps = [...steps];
      const updateQueryDataAtPath = (stepsArray, path, queryData, currentIndex = 0) => {
        if (currentIndex === path.length - 1) {
          stepsArray[path[currentIndex]].queryData = queryData;
          return stepsArray;
        }

        stepsArray[path[currentIndex]].nestedSteps = updateQueryDataAtPath(
          stepsArray[path[currentIndex]].nestedSteps,
          path,
          queryData,
          currentIndex + 1
        );

        return stepsArray;
      };

      setSteps(updateQueryDataAtPath(updatedSteps, path, queryData));
    }
  };

  const toggleExpanded = (path) => {
    if (path.length === 1) {
      const newSteps = [...steps];
      newSteps[path[0]].expanded = !newSteps[path[0]].expanded;
      setSteps(newSteps);
    } else {
      const updatedSteps = [...steps];
      const toggleExpandedAtPath = (stepsArray, path, currentIndex = 0) => {
        if (currentIndex === path.length - 1) {
          stepsArray[path[currentIndex]].expanded = !stepsArray[path[currentIndex]].expanded;
          return stepsArray;
        }

        stepsArray[path[currentIndex]].nestedSteps = toggleExpandedAtPath(
          stepsArray[path[currentIndex]].nestedSteps,
          path,
          currentIndex + 1
        );

        return stepsArray;
      };

      setSteps(toggleExpandedAtPath(updatedSteps, path));
    }
  };

  const moveStepUp = (path) => {
    if (path.length === 1 && path[0] > 0) {
      const newSteps = [...steps];
      const temp = newSteps[path[0]];
      newSteps[path[0]] = newSteps[path[0] - 1];
      newSteps[path[0] - 1] = temp;
      setSteps(newSteps);
    } else if (path.length > 1) {
      const lastIndex = path[path.length - 1];
      if (lastIndex > 0) {
        const updatedSteps = [...steps];
        const moveStepUpAtPath = (stepsArray, path, currentIndex = 0) => {
          if (currentIndex === path.length - 2) {
            const nestedSteps = stepsArray[path[currentIndex]].nestedSteps;
            const temp = nestedSteps[path[path.length - 1]];
            nestedSteps[path[path.length - 1]] = nestedSteps[path[path.length - 1] - 1];
            nestedSteps[path[path.length - 1] - 1] = temp;
            return stepsArray;
          }

          stepsArray[path[currentIndex]].nestedSteps = moveStepUpAtPath(
            stepsArray[path[currentIndex]].nestedSteps,
            path,
            currentIndex + 1
          );

          return stepsArray;
        };

        setSteps(moveStepUpAtPath(updatedSteps, path));
      }
    }
  };

  const moveStepDown = (path) => {
    if (path.length === 1 && path[0] < steps.length - 1) {
      const newSteps = [...steps];
      const temp = newSteps[path[0]];
      newSteps[path[0]] = newSteps[path[0] + 1];
      newSteps[path[0] + 1] = temp;
      setSteps(newSteps);
    } else if (path.length > 1) {
      const updatedSteps = [...steps];
      const moveStepDownAtPath = (stepsArray, path, currentIndex = 0) => {
        if (currentIndex === path.length - 2) {
          const nestedSteps = stepsArray[path[currentIndex]].nestedSteps;
          const lastIndex = path[path.length - 1];
          if (lastIndex < nestedSteps.length - 1) {
            const temp = nestedSteps[lastIndex];
            nestedSteps[lastIndex] = nestedSteps[lastIndex + 1];
            nestedSteps[lastIndex + 1] = temp;
          }
          return stepsArray;
        }

        stepsArray[path[currentIndex]].nestedSteps = moveStepDownAtPath(
          stepsArray[path[currentIndex]].nestedSteps,
          path,
          currentIndex + 1
        );

        return stepsArray;
      };

      setSteps(moveStepDownAtPath(updatedSteps, path));
    }
  };

  const renderSteps = (stepsArray, path = []) => {
    return stepsArray.map((step, index) => {
      const currentPath = [...path, index];
      return (
        <div key={currentPath.join('-')} className="p-3 mb-3 bg-black rounded border">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {step.nestedSteps && step.nestedSteps.length > 0 && (
                <button
                  onClick={() => toggleExpanded(currentPath)}
                  className="mr-2 cursor-pointer"
                >
                  {step.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
              )}
              <h3 className="font-semibold">
                Step {currentPath.map(p => p + 1).join('.')}
              </h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveStepUp(currentPath)}
                disabled={(path.length === 0 && index === 0) || (path.length > 0 && index === 0)}
                className={"px-2 py-1 rounded"}
              >
                <ArrowUp />
              </button>
              <button
                onClick={() => moveStepDown(currentPath)}
                disabled={(path.length === 0 && index === stepsArray.length - 1) ||
                  (path.length > 0 && index === stepsArray.length - 1)}
                className={"px-2 py-1 rounded"}
              >
                <ArrowDown />
              </button>
              <button
                onClick={() => removeStep(currentPath)}
                className="cursor-pointer px-2 py-1 rounded hover:bg-text-600"
              >
                <Trash2 />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1 text-sm">Step type:</label>
              <select
                value={step.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  updateStep(currentPath, 'type', newType);

                  if (newType === 'IF-ELSE') {
                    updateStep(currentPath, 'condition', '');
                    updateStep(currentPath, 'content', undefined);
                  }

                  if (newType === 'QUERY') {
                    updateStep(currentPath, 'queryData', {});
                    updateStep(currentPath, 'intoTarget', undefined);
                  }

                  if (newType === 'SELECT INTO') {
                    updateStep(currentPath, 'queryData', {});
                    updateStep(currentPath, 'intoTarget', '');
                  }

                  if (newType === 'LOOP') {
                    updateStep(currentPath, 'loopType', loopTypes[0]);
                    updateStep(currentPath, 'loopCondition', '');
                  }
                  if (newType === 'EXCEPTION') {
                    updateStep(currentPath, 'exceptionType', exceptionTypes[0]);
                    updateStep(currentPath, 'customExceptionName', '');
                  }
                }}
                className="w-full p-1 border rounded"
              >
                {stepTypes.map((type) => (
                  <option className="bg-black" key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {step.type === 'QUERY' && (
            <div className="mt-4 border-t pt-4">
              <SQLBuilder
                onJsonUpdate={(queryData) => updateStepQueryData(currentPath, queryData)}
                databaseTables={databaseTables}
                isHeader={false}
              />
            </div>
          )}

          {step.type === 'IF-ELSE' && (
            <div className="mb-4 border-t pt-2 mt-2">
              <div className="mb-2">
                <label className="block mb-1 text-sm">Condition:</label>
                <input
                  type="text"
                  value={step.condition || ''}
                  onChange={(e) => updateStep(currentPath, 'condition', e.target.value)}
                  className="w-full p-1 border rounded"
                  placeholder="x > 10"
                />
              </div>

              <div className="mb-2 mt-4">
                <button
                  onClick={() => addStep(currentPath)}
                  className="flex items-center gap-1 bg-orange-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-orange-400"
                >
                  <PlusCircle size={16} />
                  Add nested step
                </button>
              </div>

              {step.expanded && step.nestedSteps && step.nestedSteps.length > 0 && (
                <div className="pl-4 border-l ml-2 mt-3">
                  {renderSteps(step.nestedSteps, currentPath)}
                </div>
              )}
            </div>
          )}


          {step.type === 'SELECT INTO' && (
            <div className="mt-4 border-t pt-4">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block mb-1 text-sm">Into Variable/Parameter:</label>
                  <select
                    value={step.intoTarget || ''}
                    onChange={(e) => updateStep(currentPath, 'intoTarget', e.target.value)}
                    className="w-full p-1 border rounded bg-black text-white appearance-none"
                  >
                    <option value="">Select target variable</option>

                    <optgroup label="Variables">
                      {variables.map((variable, idx) => (
                        <option key={`var-${idx}`} value={variable.name} className="bg-black text-white">
                          {variable.name || `var${idx + 1}`}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Parameters (OUT/IN OUT)">
                      {parameters
                        .filter(param => param.direction === 'OUT' || param.direction === 'IN OUT')
                        .map((param, idx) => (
                          <option key={`param-${idx}`} value={param.name} className="bg-black text-white">
                            {param.name || `param${idx + 1}`}
                          </option>
                        ))}
                    </optgroup>
                  </select>

                </div>
              </div>

              <SQLBuilder
                onJsonUpdate={(queryData) => {
                  updateStepQueryData(currentPath, queryData);
                }}
                databaseTables={databaseTables}
                isHeader={false}
                isSelectInto={true}
              />
            </div>
          )}

          {step.type === 'LOOP' && (
            <div className="mb-4 border-t pt-2 mt-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="flex-1 min-w-[200px]">
                  <label className="block mb-1 text-sm">Loop type:</label>
                  <select
                    value={step.loopType || loopTypes[0]}
                    onChange={(e) => updateStep(currentPath, 'loopType', e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    {loopTypes.map((type) => (
                      <option className="bg-black" key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[300px]">
                  <label className="block mb-1 text-sm">Loop condition:</label>
                  <input
                    type="text"
                    value={step.loopCondition || ''}
                    onChange={(e) => updateStep(currentPath, 'loopCondition', e.target.value)}
                    className="w-full p-1 border rounded"
                    placeholder={
                      step.loopType === 'FOR' ? 'i IN 1..10' :
                        step.loopType === 'WHILE' ? 'counter <= 10' :
                          'rec IN cursor_name'
                    }
                  />
                </div>
              </div>

              <div className="mb-2 mt-4">
                <button
                  onClick={() => addStep(currentPath)}
                  className="flex items-center gap-1 bg-orange-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-orange-400"
                >
                  <PlusCircle size={16} />
                  Add nested step
                </button>
              </div>

              {step.expanded && step.nestedSteps && step.nestedSteps.length > 0 && (
                <div className="pl-4 border-l ml-2 mt-3">
                  {renderSteps(step.nestedSteps, currentPath)}
                </div>
              )}
            </div>
          )}

          {step.type === 'EXCEPTION' ? (
            <div className="mb-4 border-t pt-2 mt-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="flex-1 min-w-[200px]">
                  <label className="block mb-1 text-sm">Exception type:</label>
                  <select
                    value={step.exceptionType || exceptionTypes[0]}
                    onChange={(e) => {
                      updateStep(currentPath, 'exceptionType', e.target.value);
                      if (e.target.value !== 'CUSTOM_WHEN') {
                        updateStep(currentPath, 'customExceptionName', '');
                      }
                    }}
                    className="w-full p-1 border rounded"
                  >
                    {exceptionTypes.map((type) => (
                      <option className="bg-black" key={type} value={type}>
                        {type === 'CUSTOM_WHEN' ? 'Custom WHEN condition' : type}
                      </option>
                    ))}
                  </select>
                </div>

                {step.exceptionType === 'CUSTOM_WHEN' && (
                  <div className="flex-1 min-w-[200px]">
                    <label className="block mb-1 text-sm">Custom exception name:</label>
                    <input
                      type="text"
                      value={step.customExceptionName || ''}
                      onChange={(e) => updateStep(currentPath, 'customExceptionName', e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="my_custom_exception"
                    />
                  </div>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-1 text-sm">Exception handling code:</label>
                <textarea
                  value={step.content || ''}
                  onChange={(e) => updateStep(currentPath, 'content', e.target.value)}
                  className="w-full p-1 border rounded"
                  rows="3"
                  placeholder="-- Exception handling code&#10;ROLLBACK;&#10;RAISE_APPLICATION_ERROR(-20001, 'Custom error message');"
                ></textarea>
              </div>

              <div className="mb-2 mt-4">
                <button
                  onClick={() => addStep(currentPath)}
                  className="flex items-center gap-1 bg-orange-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-orange-400"
                >
                  <PlusCircle size={16} />
                  Add nested step in exception handler
                </button>
              </div>

              {step.expanded && step.nestedSteps && step.nestedSteps.length > 0 && (
                <div className="pl-4 border-l ml-2 mt-3">
                  {renderSteps(step.nestedSteps, currentPath)}
                </div>
              )}
            </div>
          ) : step.type === 'CUSTOM' ? (
            <div className="mb-2">
              <label className="block mb-1 text-sm">Contents:</label>
              <textarea
                value={step.content || ''}
                onChange={(e) => updateStep(currentPath, 'content', e.target.value)}
                className="w-full p-1 border rounded"
                rows="3"
                placeholder="-- Własny kod PL/SQL"
              ></textarea>
            </div>
          ) : null}
        </div>
      );
    });
  };

  const convertStepsToJson = (stepsArray, parentIndex = '') => {
    return stepsArray.map((step, index) => {
      const stepNumber = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
      const baseStep = {
        stepNumber,
        type: step.type
      };

      const nestedStepsJson = step.nestedSteps && step.nestedSteps.length > 0
        ? convertStepsToJson(step.nestedSteps, stepNumber)
        : [];

      switch (step.type) {
        case 'QUERY':
          if (step.queryData) {
            const queryStep = {
              ...baseStep,
              queryType: step.queryData.type || 'SELECT',
              tableName: step.queryData.table || '',
              ...(step.queryData.type === 'SELECT' && {
                columns: step.queryData.columns || ['*'],
                whereCondition: step.queryData.where || null,
                orderBy: step.queryData.orderBy || null,
                groupBy: step.queryData.groupBy || null,
                limit: step.queryData.limit || null
              }),
              ...(step.queryData.type === 'INSERT' && {
                values: step.queryData.values?.map(v => ({
                  column: v.column,
                  columnType: v.columnType,
                  value: v.value
                })) || []
              }),
              ...(step.queryData.type === 'UPDATE' && {
                values: step.queryData.values?.map(v => ({
                  column: v.column,
                  columnType: v.columnType,
                  value: v.value
                })) || [],
                whereCondition: step.queryData.where || null
              }),
              ...(step.queryData.type === 'DELETE' && {
                whereCondition: step.queryData.where || null
              })
            };

            if (nestedStepsJson.length > 0) {
              queryStep.nestedSteps = nestedStepsJson;
            }

            return queryStep;
          }
          return {
            ...baseStep,
            queryType: 'SELECT',
            tableName: '',
            columns: ['*'],
            ...(nestedStepsJson.length > 0 && { nestedSteps: nestedStepsJson })
          };
        case 'IF-ELSE':
          return {
            ...baseStep,
            condition: step.condition || 'condition',
            ...(nestedStepsJson.length > 0 && { nestedSteps: nestedStepsJson })
          };
        case 'LOOP':
          return {
            ...baseStep,
            loopType: step.loopType || 'FOR',
            loopCondition: step.loopCondition || '',
            ...(nestedStepsJson.length > 0 && { nestedSteps: nestedStepsJson })
          };
        case 'EXCEPTION':
          const exceptionStep = {
            ...baseStep,
            exceptionType: step.exceptionType || 'WHEN OTHERS',
            exceptionHandling: step.content || 'null'
          };
          if (step.exceptionType === 'CUSTOM_WHEN') {
            exceptionStep.customExceptionName = step.customExceptionName || 'custom_exception';
          }

          if (nestedStepsJson.length > 0) {
            exceptionStep.nestedSteps = nestedStepsJson;
          }

          return exceptionStep;
        case 'CUSTOM':
          return {
            ...baseStep,
            customCode: step.content || '-- PL/SQL Code',
            ...(nestedStepsJson.length > 0 && { nestedSteps: nestedStepsJson })
          };
        case 'SELECT INTO':
          if (step.queryData) {
            const selectIntoStep = {
              ...baseStep,
              intoTarget: step.intoTarget || '',
              queryType: 'SELECT',
              tableName: step.queryData.table || '',
              columns: step.queryData.columns || ['*'],
              whereCondition: step.queryData.where || null,
              orderBy: step.queryData.orderBy || null,
              groupBy: step.queryData.groupBy || null,
              limit: step.queryData.limit || null
            };

            if (nestedStepsJson.length > 0) {
              selectIntoStep.nestedSteps = nestedStepsJson;
            }

            return selectIntoStep;
          }
          return {
            ...baseStep,
            intoTarget: step.intoTarget || '',
            queryType: 'SELECT',
            tableName: '',
            columns: ['*'],
            ...(nestedStepsJson.length > 0 && { nestedSteps: nestedStepsJson })
          };
        default:
          return {
            ...baseStep,
            ...(nestedStepsJson.length > 0 && { nestedSteps: nestedStepsJson })
          };
      }
    });
  };

  useEffect(() => {
    const generateJson = () => {
      const procedureData = {
        name: procedureName || 'my_procedure',
        parameters: parameters.map((param, index) => ({
          name: param.name || `param${index + 1}`,
          direction: param.direction || 'IN',
          type: param.type || 'VARCHAR',
          size: supportsLength(param.type) ? param.size || null : null,
          precision: supportsPrecision(param.type) ? param.precision || null : null
        })),
        variables: variables.map((variable) => ({
          name: variable.name || 'v_var',
          type: variable.type || 'VARCHAR',
          size: supportsLength(variable.type) ? variable.size || null : null,
          precision: supportsPrecision(variable.type) ? variable.precision || null : null,
          defaultValue: variable.defaultValue || null
        })),
        steps: convertStepsToJson(steps)
      };

      onJsonUpdate(procedureData, "PROCEDURE");
    };

    generateJson();
  }, [procedureName, parameters, variables, steps]);

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Procedure Builder PL/SQL</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-xl">Procedure name:</label>
        <input
          type="text"
          value={procedureName}
          onChange={(e) => setProcedureName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="example_procedure"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Parameters</h2>
          <button
            onClick={addParameter}
            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-400 cursor-pointer"
          >
            Add parameter
          </button>
        </div>

        {parameters.map((param, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2 p-3 mb-2 bg-black rounded border">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm">Name:</label>
              <input
                type="text"
                value={param.name}
                onChange={(e) => updateParameter(index, 'name', e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="Parameter name"
              />
            </div>

            <div className="flex-1 min-w-[100px]">
              <label className="block mb-1 text-sm">Parameter mode:</label>
              <select
                value={param.direction}
                onChange={(e) => updateParameter(index, 'direction', e.target.value)}
                className="w-full p-1 border rounded"
              >
                {paramTypes.map((type) => (
                  <option className="bg-black" key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[100px]">
              <label className="block mb-1 text-sm">Data type:</label>
              <select
                value={param.type}
                onChange={(e) => updateParameter(index, 'type', e.target.value)}
                className="w-full p-1 border rounded"
              >
                {ATTRIBUTE_TYPES.map((type) => (
                  <option className="bg-black" key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {supportsLength(param.type) && (
              <div className="w-20">
                <label className="block mb-1 text-sm">Length:</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={param.size}
                  onChange={(e) => updateParameter(index, 'size', e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                  className="w-full p-1 border rounded"
                  placeholder="Length"
                />
              </div>
            )}

            {supportsPrecision(param.type) && (
              <div className="w-20">
                <label className="block mb-1 text-sm">Precision:</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={param.precision}
                  onChange={(e) => updateParameter(index, 'precision', e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value)))}
                  className="w-full p-1 border rounded"
                  placeholder="Precision"
                />
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={() => removeParameter(index)}
                className="hover:text-red-600 p-1 cursor-pointer"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}

        {parameters.length === 0 && (
          <p className="text-gray-500 italic">No parameters defined.</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Local variables</h2>
          <button
            onClick={addVariable}
            className="bg-orange-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-orange-400"
          >
            Add variable
          </button>
        </div>

        {variables.map((variable, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2 p-3 mb-2 bg-black rounded border">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm">Name:</label>
              <input
                type="text"
                value={variable.name}
                onChange={(e) => updateVariable(index, 'name', e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="Variable name"
              />
            </div>

            <div className="flex-1 min-w-[100px]">
              <label className="block mb-1 text-sm">Data type:</label>
              <select
                value={variable.type}
                onChange={(e) => updateVariable(index, 'type', e.target.value)}
                className="w-full p-1 border rounded"
              >
                {ATTRIBUTE_TYPES.map((type) => (
                  <option className="bg-black" key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {supportsLength(variable.type) && (
              <div className="w-20">
                <label className="block mb-1 text-sm">Length:</label>
                <input
                  type="text"
                  value={variable.size}
                  onChange={(e) => updateVariable(index, 'size', e.target.value)}
                  className="w-full p-1 border rounded"
                  placeholder="Length"
                />
              </div>
            )}

            {supportsPrecision(variable.type) && (
              <div className="w-20">
                <label className="block mb-1 text-sm">Precision:</label>
                <input
                  type="text"
                  value={variable.precision}
                  onChange={(e) => updateVariable(index, 'precision', e.target.value)}
                  className="w-full p-1 border rounded"
                  placeholder="Precision"
                />
              </div>
            )}

            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm">Default value:</label>
              <input
                type="text"
                value={variable.defaultValue}
                onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="Default value"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => removeVariable(index)}
                className="p-1 rounded hover:text-red-600 cursor-pointer"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}

        {variables.length === 0 && (
          <p className="text-gray-500 italic">No variables defined.</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Procedure Steps</h2>
          <button
            onClick={() => addStep()}
            className="bg-orange-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-orange-400"
          >
            Add step
          </button>
        </div>

        {renderSteps(steps)}

        {steps.length === 0 && (
          <p className="text-gray-500 italic">
            No defined steps.</p>
        )}
      </div>
    </div>
  );
};

export default ProcedureBuilder;