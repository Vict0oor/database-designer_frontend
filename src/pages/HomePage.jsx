import React, { useState } from 'react';
import { Download, Code } from "lucide-react";
import Header from '../components/Header';
import DiagramMap from '../components/diagram_elements/DiagramMap';
import SqlCodeContainer from '../components/SqlCodeContainer';
import { useSqlCode } from '../api/hooks/sqlHooks';

const HomePage = () => {
  const [entities, setEntities] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [schemaJson, setSchemaJson] = useState(null);

  const { data: sqlCode, isLoading, error } = useSqlCode(schemaJson, shouldFetch);

  const generateJsonSchema = (entities, relationships) => {
    const tables = entities.map(entity => {
      const fields = entity.attributes.map(attr => ({
        name: attr.name,
        type: attr.type,
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
            className={`rounded-md p-3 flex space-x-2 transition-colors duration-200 ${
              sqlCode
                ? 'bg-black cursor-pointer hover:bg-orange-500'
                : 'bg-gray-400 cursor-not-allowed opacity-50'
            }`}
            onClick={sqlCode ? handleDownloadSql : null}
          >
            <Download />
            <button className='cursor-pointer' disabled={!sqlCode}>Download Sql</button>
          </div>
        </div>

        <div className='mt-5 mb-10'>
          <SqlCodeContainer sqlCode={sqlCode} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
