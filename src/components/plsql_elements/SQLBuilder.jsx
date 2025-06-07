import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from "lucide-react";
import TableSelector from './form_elements/TableSelector';
import ColumnsSelector from './form_elements/ColumnsSelector';
import WhereConditionsBuilder from './form_elements/WhereConditionsBuilder';
import OrderByBuilder from './form_elements/OrderByBuilder';
import GroupByBuilder from './form_elements/GroupByBuilder';
import InsertValuesBuilder from './form_elements/InsertValuesBuilder';
import UpdateValuesBuilder from './form_elements/UpdateValuesBuilder';

const SQLBuilder = ({onJsonUpdate, databaseTables, isHeader = true, isSelectInto = false }) => {
    const [queryType, setQueryType] = useState(isSelectInto ? 'SELECT' : 'SELECT');
    const [selectedTable, setSelectedTable] = useState('');
    const [availableColumns, setAvailableColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(['*']);
    const [whereConditions, setWhereConditions] = useState([]);
    const [orderByColumns, setOrderByColumns] = useState([]);
    const [groupByColumns, setGroupByColumns] = useState([]);
    const [limitValue, setLimitValue] = useState('');
    const [insertValues, setInsertValues] = useState([]);
    const [updateValues, setUpdateValues] = useState([]);
    const [rawSql, setRawSql] = useState('');

    const queryTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];

    useEffect(() => {
        if (selectedTable && databaseTables) {
            const tableInfo = databaseTables.find(table => table.name === selectedTable);
            if (tableInfo) {
                setAvailableColumns(tableInfo.columns || []);

                setSelectedColumns(['*']);
                setWhereConditions([]);
                setOrderByColumns([]);
                setGroupByColumns([]);
                setLimitValue('');

                if (tableInfo.columns) {
                    const initialInsertValues = tableInfo.columns.map(column => ({
                        column: column.name,
                        value: '',
                        columnType: column.type
                    }));
                    setInsertValues(initialInsertValues);

                    const initialUpdateValues = tableInfo.columns.map(column => ({
                        column: column.name,
                        value: '',
                        include: false,
                        columnType: column.type
                    }));
                    setUpdateValues(initialUpdateValues);
                }
            } else {
                resetAllValues();
            }
        } else {
            resetAllValues();
        }
    }, [selectedTable, databaseTables, queryType]);

    const resetAllValues = () => {
        setAvailableColumns([]);
        setSelectedColumns(['*']);
        setWhereConditions([]);
        setOrderByColumns([]);
        setGroupByColumns([]);
        setLimitValue('');
        setInsertValues([]);
        setUpdateValues([]);
    };

    const buildQueryJson = () => {
        const query = {
            type: queryType,
            table: selectedTable,
        };

        if (queryType === 'SELECT') {
            query.columns = selectedColumns;
            if (whereConditions.length > 0) query.where = whereConditions;
            if (orderByColumns.length > 0) query.orderBy = orderByColumns;
            if (groupByColumns.length > 0) query.groupBy = groupByColumns;
            if (limitValue !== '') {
                const parsedLimit = parseInt(limitValue, 10);
                if (!isNaN(parsedLimit)) {
                    query.limit = parsedLimit;
                }
            }

        } else if (queryType === 'INSERT') {
            query.values = insertValues.filter(item => item.value.trim() !== '');
        } else if (queryType === 'UPDATE') {
            query.values = updateValues.filter(item => item.include && item.value.trim() !== '');
            if (whereConditions.length > 0) query.where = whereConditions;
        } else if (queryType === 'DELETE') {
            if (whereConditions.length > 0) query.where = whereConditions;
        }

        return query;
    };

    useEffect(() => {
        const queryJson = buildQueryJson();
        setRawSql(JSON.stringify(queryJson, null, 2));
        onJsonUpdate(queryJson, `QUERY_${queryType}`);
    }, [
        queryType, selectedTable, selectedColumns, whereConditions,
        orderByColumns, groupByColumns, limitValue, insertValues, updateValues
    ]);

    return (
        <div className="bg-black p-6 rounded-lg shadow-lg">

            {isHeader && <h1 className="text-2xl font-bold mb-6 text-center">SQL Query Builder</h1>}

            {!isSelectInto && (<div className="mb-6">
                <label className="block mb-2 font-medium">SQL query type:</label>
                <div className="flex flex-wrap gap-2">
                    {queryTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setQueryType(type)}
                            className={`px-4 py-2 rounded-lg cursor-pointer ${queryType === type ? 'bg-orange-500 text-white' : 'bg-[#1f1f1f] text-gray-200'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>)
            }

            <TableSelector
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                databaseTables={databaseTables}
            />

            {selectedTable && (
                <>
                    {queryType === 'SELECT' && (
                        <div className="space-y-4">
                            <ColumnsSelector
                                selectedColumns={selectedColumns}
                                setSelectedColumns={setSelectedColumns}
                                availableColumns={availableColumns}
                            />

                            <GroupByBuilder
                                groupByColumns={groupByColumns}
                                setGroupByColumns={setGroupByColumns}
                                availableColumns={availableColumns}
                            />

                            <OrderByBuilder
                                orderByColumns={orderByColumns}
                                setOrderByColumns={setOrderByColumns}
                                availableColumns={availableColumns}
                            />

                            <div className="mb-4">
                                <label className="block mb-2 font-medium">Limit:</label>
                                <input
                                    type="number"
                                    value={limitValue}
                                    onChange={(e) => setLimitValue(e.target.value)}
                                    className="w-full p-2 border rounded bg-[#000000] text-white"
                                    placeholder="e.g. 10"
                                    min="1"
                                />
                            </div>
                        </div>
                    )}

                    {queryType === 'INSERT' && (
                        <InsertValuesBuilder
                            insertValues={insertValues}
                            updateInsertValue={(index, value) => {
                                const newValues = [...insertValues];
                                newValues[index].value = value;
                                setInsertValues(newValues);
                            }}
                        />
                    )}

                    {queryType === 'UPDATE' && (
                        <UpdateValuesBuilder
                            updateValues={updateValues}
                            updateUpdateValue={(index, field, value) => {
                                const newValues = [...updateValues];
                                newValues[index][field] = field === 'include' ? !newValues[index].include : value;
                                setUpdateValues(newValues);
                            }}
                        />
                    )}

                    {queryType !== 'INSERT' && (
                        <WhereConditionsBuilder
                            whereConditions={whereConditions}
                            setWhereConditions={setWhereConditions}
                            availableColumns={availableColumns}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default SQLBuilder;