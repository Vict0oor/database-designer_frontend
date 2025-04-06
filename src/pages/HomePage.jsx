import React from 'react';
import { useState } from 'react'
import { Download, Code, Database, FileJson } from "lucide-react"
import Header from '../components/Header';
import DiagramMap from '../components/diagram_elements/DiagramMap';
import SqlCodeContainer from '../components/SqlCodeContainer';

const HomePage = () => {
  const [entities, setEntities] = useState([])
  const [relationships, setRelationships] = useState([])

  const generateJsonSchema = (entities, relationships) => {
    return {
      tables: entities.map(entity => {
        const baseFields = entity.attributes.map(attr => ({
          name: attr.name,
          type: attr.type,
          primaryKey: attr.isPrimaryKey,
          unique: attr.isUnique,
          nullable: attr.isNullable,
        }));
  
        const additionalFields = [];
  
        const entityRelationships = relationships
          .filter(rel => {
            if (rel.type === "many-to-many") {
              return rel.sourceEntityId === entity.id || rel.targetEntityId === entity.id;
            }
  
            if (rel.type === "one-to-many") {
              return rel.targetEntityId === entity.id; 
            }
  
            if (rel.type === "one-to-one") {
              return rel.targetEntityId === entity.id;
            }
  
            return false;
          })
          .map(rel => {
            const isSource = rel.sourceEntityId === entity.id;
            const otherEntityId = isSource ? rel.targetEntityId : rel.sourceEntityId;
            const referencedTable = entities.find(e => e.id === otherEntityId);
            const referencedField = referencedTable?.attributes.find(a => a.isPrimaryKey);
  
            const fieldName = `${referencedTable?.name?.toLowerCase()}_${referencedField?.name}`;
  
            if (!baseFields.find(f => f.name === fieldName)) {
              additionalFields.push({
                name: fieldName,
                type: referencedField?.type || "int",
                primaryKey: false,
                unique: false,
                nullable: true,
              });
            }
  
            return {
              fieldName,
              referencedTable: referencedTable?.name,
              referencedField: referencedField?.name,
              manyToMany: rel.type === "many-to-many",
            };
          });
  
        return {
          name: entity.name,
          fields: [...baseFields, ...additionalFields],
          relationships: entityRelationships,
        };
      })
    };
  };  
  
  const handleGenerateJson = () => {
    const jsonSchema = generateJsonSchema(entities, relationships);
    console.log("Generated JSON:", JSON.stringify(jsonSchema, null, 2));
  };

  return (

    <div className="mx-auto" >
      <Header />

      <div className='px-10'>
        <div className="mt-8 border-1 rounded-md">
          <DiagramMap entities={entities} relationships={relationships} setEntities={setEntities} setRelationships={setRelationships}/>
        </div>
        <div className="flex space-x-5 mt-5">
          <div className="bg-black rounded-md p-3 flex space-x-2 cursor-pointer hover:bg-orange-500 transition-colors duration-200"
             onClick={handleGenerateJson}>
            <Code />
            <button className='cursor-pointer'>Generate Sql </button>
          </div>
          <div className="bg-black rounded-md p-3 flex space-x-2 cursor-pointer hover:bg-orange-500 transition-colors duration-200">
            <Download />
            <button className='cursor-pointer'>Download Sql</button>
          </div>
        </div>

        <div className='mt-5 mb-10'>
          <SqlCodeContainer />
        </div>

      </div>
    </div>

  )
}

export default HomePage;
