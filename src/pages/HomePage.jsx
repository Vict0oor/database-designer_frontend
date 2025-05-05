import React, { useState } from 'react';
import { Download, Code, Terminal, X } from "lucide-react";
import Header from '../components/Header';
import DiagramMap from '../components/diagram_elements/DiagramMap';
import SqlCodeContainer from '../components/SqlCodeContainer';
import { useSqlCode } from '../api/hooks/sqlHooks';
import { useExecuteSqlCode } from '../api/hooks/databaseConnectionHooks';
import { toast } from 'react-toastify';
import { LENGTH_SUPPORTING_TYPES, PRECISION_SUPPORTING_TYPES } from '../constants/attributeTypes';

const HomePage = () => {
  const [entities, setEntities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [schemaJson, setSchemaJson] = useState(null);
  const [sqlCode, setSqlCode] = useState(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const [dbConnection, setDbConnection] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
  });

  const [terminalMessages, setTerminalMessages] = useState([]);

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleString();
  };

  const handleExecuteSuccess = (data) => {
    setTerminalMessages((prevMessages) => [
      ...prevMessages,
      { type: 'success', message: `Success: ${data}`, timestamp: getCurrentTime() },
    ]);
  };

  const handleExecuteError = (error) => {
    const errorMessage = error.response?.data || "Unknown error occurred.";
    setTerminalMessages((prevMessages) => [
      ...prevMessages,
      { type: 'error', message: `Error: ${errorMessage}`, timestamp: getCurrentTime() },
    ]);
  };

  const { mutate: executeSqlCode, isLoading: uploadLoading } = useExecuteSqlCode({
    onSuccess: handleExecuteSuccess,
    onError: handleExecuteError,
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!dbConnection.host || !dbConnection.port || !dbConnection.database || !dbConnection.username || !dbConnection.password) {
      const missingFields = [];
      if (!dbConnection.host) missingFields.push('Host');
      if (!dbConnection.port) missingFields.push('Port');
      if (!dbConnection.database) missingFields.push('Database Name');
      if (!dbConnection.username) missingFields.push('Username');
      if (!dbConnection.password) missingFields.push('Password');

      const missingFieldsMessage = `The following fields are missing: ${missingFields.join(', ')}`;
      setTerminalMessages((prevMessages) => [
        ...prevMessages,
        { type: 'error', message: missingFieldsMessage, timestamp: getCurrentTime() },
      ]);
      return;
    }

    executeSqlCode({ dbConnection, sqlCode });
  };

  const handleSuccessGenerateSqlCode = (data) => {
    setSqlCode(data);
  };

  const handleErrorGenerateSqlCode = (error) => {
    console.error("Error generating SQL code:", error);
    alert("An error occurred while generating the SQL code.");
  };

  const handleClearTerminal = () => {
    setTerminalMessages([]);
  };

  const { mutate: generateSqlCode, isLoading: isGeneratingSqlCode, error } = useSqlCode(handleSuccessGenerateSqlCode, handleErrorGenerateSqlCode);

  const getFullTypeDefinition = (attribute) => {
    const { type, length, precision, scale } = attribute;

    if (LENGTH_SUPPORTING_TYPES.includes(type) && length !== null) {
      return `${type}(${length})`;
    } else if (PRECISION_SUPPORTING_TYPES.includes(type)) {
      if (scale !== null && precision !== null) {
        return `${type}(${precision},${scale})`;
      } else if (precision !== null) {
        return `${type}(${precision})`;
      }
    }

    return type;
  };

  const generateJsonSchema = (entities, relationships) => {
    const tables = entities.map(entity => {
      const fields = entity.attributes.map(attr => ({
        name: attr.name,
        type: getFullTypeDefinition(attr), 
        primitiveType: attr.type,
        length: attr.length,
        precision: attr.precision,
        scale: attr.scale,
        primaryKey: attr.isPrimaryKey,
        unique: attr.isUnique,
        nullable: attr.isNullable,
      }));

      return {
        id: entity.id,
        name: entity.name,
        fields,
      };
    });

    const rels = relationships.map(rel => {
      const sourceTable = entities.find(e => e.id === rel.sourceEntityId);
      const targetTable = entities.find(e => e.id === rel.targetEntityId);

      let sourceCardinality = rel.sourceCardinality;
      let targetCardinality = rel.targetCardinality;

      if (rel.type === 'one-to-one') {
        sourceCardinality = 'one';
        targetCardinality = 'one';
      }

      if (rel.type === 'many-to-many') {
        sourceCardinality = 'many';
        targetCardinality = 'many';
      }

      return {
        id: rel.id,
        type: rel.type,
        sourceEntityId: rel.sourceEntityId,
        targetEntityId: rel.targetEntityId,
        sourceTableName: sourceTable ? sourceTable.name : null,
        targetTableName: targetTable ? targetTable.name : null,
        sourceCardinality,
        targetCardinality,
      };
    });

    return {
      tables,
      relationships: rels,
    };
  };
  const handleGenerateJson = () => {
    const json = generateJsonSchema(entities, relationships);
    setSchemaJson(json);
    setShouldFetch(true);
    generateSqlCode(json);
    console.log(JSON.stringify(json, null, 2));
  };

  const handleDownloadSql = () => {
    if (sqlCode) {
      const blob = new Blob([sqlCode], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated_sql_code.sql';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="mx-auto">
      <Header />

      <div className='px-10'>
        <div className="mt-8 border-1 rounded-md">
          <DiagramMap
            entities={entities}
            relationships={relationships}
            setEntities={setEntities}
            setRelationships={setRelationships}
          />
        </div>

        <div className="flex space-x-5 mt-5">
          <div
            className="bg-black rounded-md p-3 flex space-x-2 cursor-pointer hover:bg-orange-500 transition-colors duration-200"
            onClick={handleGenerateJson}
          >
            <Code />
            <button className='cursor-pointer'>Generate Sql</button>
          </div>
          <div
            className={`rounded-md p-3 flex space-x-2 transition-colors duration-200 ${sqlCode
              ? 'bg-black cursor-pointer hover:bg-orange-500'
              : 'bg-gray-400 cursor-not-allowed opacity-50'
              }`}
            onClick={sqlCode ? handleDownloadSql : null}
          >
            <Download />
            <button className='cursor-pointer' disabled={!sqlCode}>Download Sql</button>
          </div>

          <button
            onClick={() => {
              if (sqlCode) {
                setIsTerminalOpen(true);
              }
            }}
            disabled={!sqlCode}
            className={`flex items-center space-x-2 py-2 px-4 rounded transition-colors duration-200
    ${sqlCode
                ? 'bg-black hover:bg-orange-500 text-white cursor-pointer'
                : 'bg-gray-400 text-white opacity-50 cursor-not-allowed'} `}
          >
            <Terminal size={20} />
            <span>Open Database Terminal</span>
          </button>

        </div>

        <div className='mt-5 mb-10'>
          <SqlCodeContainer sqlCode={sqlCode} isLoading={isGeneratingSqlCode} error={error} />
        </div>


        <div className={`fixed bottom-0 left-0 w-full bg-black p-5 transform ${isTerminalOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-500 z-50`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-orange-500">Database Connection Terminal</h2>
            <button onClick={() => setIsTerminalOpen(false)} className="text-orange-500 hover:text-orange-400 cursor-pointer">  <X size={26} /></button>
          </div>
          <form onSubmit={handleSubmitForm} className="space-y-3">

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <label className="block text-white mb-1">Host</label>
                <input
                  type="text"
                  placeholder="Host"
                  className="w-full p-1 border rounded"
                  value={dbConnection.host}
                  onChange={(e) => setDbConnection({ ...dbConnection, host: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white mb-1">Port</label>
                <input
                  type="text"
                  placeholder="Port"
                  className="w-full p-1 border rounded"
                  value={dbConnection.port}
                  onChange={(e) => setDbConnection({ ...dbConnection, port: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white mb-1">Database Name</label>
                <input
                  type="text"
                  placeholder="Database Name"
                  className="w-full p-1 border rounded"
                  value={dbConnection.database}
                  onChange={(e) => setDbConnection({ ...dbConnection, database: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-1 border rounded"
                  value={dbConnection.username}
                  onChange={(e) => setDbConnection({ ...dbConnection, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-1 border rounded"
                  value={dbConnection.password}
                  onChange={(e) => setDbConnection({ ...dbConnection, password: e.target.value })}
                />
              </div>
              <div className='mt-7'>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-400 cursor-pointer font-bold py-1 rounded transition-colors duration-200"
                >
                  Execute Script
                </button>
              </div>
            </div>

          </form>
          <div
            className="mt-4 text-white overflow-y-auto border p-1 rounded"
            style={{ maxHeight: '200px' }}
          >
            <div className='flex flex-col'>
              <span className='font-bold'>Terminal:</span>
              <span>Fill in the configuration fields correctly...</span>
            </div>

            {terminalMessages.map((msg, index) => (
              <p
                key={index}
                className={msg.type === 'success' ? 'text-green-500' : 'text-red-500'}
              >
                {msg.timestamp} - {msg.message}
              </p>
            ))}
          </div>
          <button
            onClick={handleClearTerminal}
            className="mt-3 px-10 cursor-pointer bg-white hover:bg-gray-300 text-black font-bold py-1 rounded"
          >
            Clear Terminal
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
