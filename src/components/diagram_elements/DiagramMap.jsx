import React, { useCallback, useRef, useState, useEffect } from "react";
import TableNode from "./TableNode";
import TableDialog from "../dialogs/TableDialog";
import RelationshipDialog from "../dialogs/RelationshipDialog";
import RelationshipEdge from "./RelationshipEdge";
import { Plus, Database } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "react-toastify";

const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipEdge,
};

const DiagramMap = ({ entities, relationships, setEntities, setRelationships }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [editingEntityId, setEditingEntityId] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [entityCounter, setEntityCounter] = useState(0);
  const [relationshipCounter, setRelationshipCounter] = useState(0);

  const [connectionStartNodeId, setConnectionStartNodeId] = useState(null);

  const reactFlowWrapper = useRef(null);

  const syncEntitiesToNodes = useCallback(() => {
    const newNodes = entities.map((entity) => ({
      id: entity.id,
      type: "tableNode",
      position: entity.position,
      data: {
        label: entity.name,
        attributes: entity.attributes,
        onEdit: () => handleEditEntity(entity.id),
        onDelete: () => handleDeleteEntity(entity.id),
      },
    }));

    setNodes(newNodes);
  }, [entities, setNodes]);

  const syncRelationshipsToEdges = useCallback(() => {
    const newEdges = relationships.map((rel) => ({
      id: rel.id,
      source: rel.sourceEntityId,
      target: rel.targetEntityId,
      type: "relationshipEdge",
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      data: {
        type: rel.type,
        sourceCardinality: rel.sourceCardinality,
        targetCardinality: rel.targetCardinality,
        onDelete: () => handleDeleteRelationship(rel.id),
      },
    }));

    setEdges(newEdges);
  }, [relationships, setEdges]);

  useEffect(() => {
    syncEntitiesToNodes();
  }, [entities]);

  useEffect(() => {
    syncRelationshipsToEdges();
  }, [relationships]);

  const generateEntityId = () => {
    setEntityCounter((prevCounter) => prevCounter + 1);
    return `entity-${entityCounter}`;
  };

  const generateRelationshipId = () => {
    setRelationshipCounter((prevCounter) => prevCounter + 1);
    return `rel-${relationshipCounter}`;
  };

  const handleAddEntity = (entity) => {
    if (editingEntityId) {
      const updatedEntities = entities.map((e) =>
        e.id === editingEntityId ? { ...entity, id: editingEntityId } : e
      );
      setEntities(updatedEntities);
    } else {
      const newEntity = {
        ...entity,
        id: generateEntityId(),
        position: { x: Math.random() * 300, y: Math.random() * 300 },
      };
      setEntities([...entities, newEntity]);
    }

    setEditingEntityId(null);
    setTableDialogOpen(false);

    syncEntitiesToNodes();
  };

  const handleEditEntity = (entityId) => {
    const entity = entities.find((e) => e.id === entityId);
    if (entity) {
      setEditingEntityId(entityId);
      setTableDialogOpen(true);
    }
  };

  const handleDeleteEntity = (entityId) => {
    setEntities(entities.filter((e) => e.id !== entityId));
    setRelationships(
      relationships.filter(
        (r) => r.sourceEntityId !== entityId && r.targetEntityId !== entityId
      )
    );

    syncEntitiesToNodes();
    syncRelationshipsToEdges();
  };

  const handleAddRelationship = (relationship) => {
    if (selectedEdge) {
      setRelationships((prev) =>
        prev.map((r) => (r.id === selectedEdge.id ? { ...r, ...relationship } : r))
      );
    } else {
      setRelationships((prev) => [
        ...prev,
        { ...relationship, id: `rel-${Date.now()}` },
      ]);
    }
    setRelationshipDialogOpen(false);
    setSelectedEdge(null);
  };
  

  const handleDeleteRelationship = (relationshipId) => {
    setRelationships(relationships.filter((r) => r.id !== relationshipId));

    syncRelationshipsToEdges();
  };

  const onNodeDragStop = (_, node) => {
    setEntities(
      entities.map((entity) =>
        entity.id === node.id ? { ...entity, position: node.position } : entity
      )
    );
  };

  const onConnectStart = useCallback((event, { nodeId }) => {
    setConnectionStartNodeId(nodeId);
  }, []);

  const onConnectEnd = useCallback(() => {
    setConnectionStartNodeId(null);
  }, []);

  const onConnect = useCallback(
    (connection) => {
      if (connection.source && connection.target) {

        if (connection.source === connection.target) {
          return;
        }

        const existingRelationship = relationships.find(
          (rel) =>
            (rel.sourceEntityId === connection.source && rel.targetEntityId === connection.target) ||
            (rel.sourceEntityId === connection.target && rel.targetEntityId === connection.source)
        );
  
        if (existingRelationship) {
          toast.error("Relationship between these tables already exists.");
          return;
        }
        const isSourceOne = connection.source === connectionStartNodeId;

        const newRelationship = {
          id: generateRelationshipId(),
          sourceEntityId: connection.source,
          targetEntityId: connection.target,
          type: "one-to-many",
          sourceCardinality: isSourceOne ? "one" : "many",
          targetCardinality: isSourceOne ? "many" : "one",
        };

        setRelationships((prev) => [...prev, newRelationship]);

        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              id: newRelationship.id,
              type: "relationshipEdge",
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              data: {
                type: newRelationship.type,
                sourceCardinality: newRelationship.sourceCardinality,
                targetCardinality: newRelationship.targetCardinality,
                onDelete: () => handleDeleteRelationship(newRelationship.id),
              },
            },
            eds
          )
        );

        setConnectionStartNodeId(null);
      }
    },
    [connectionStartNodeId, setEdges, setRelationships]
  );

  const onEdgeClick = (_, edge) => {
    setSelectedEdge(edge);
    setRelationshipDialogOpen(true);
  };
  

  return (
    <div className="w-full h-[650px]" ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="bottom-center">
          <div className="flex gap-2 bg-black p-2 rounded-md shadow hover:bg-orange-500 transition-colors duration-200 font-semibold">
            <button
              onClick={() => {
                setEditingEntityId(null);
                setTableDialogOpen(true);
              }}
              className="gap-2 cursor-pointer flex items-center text-white"
            >
              <Plus size={16} />
              <Database size={16} />
              Add Entity
            </button>
          </div>
        </Panel>
      </ReactFlow>
      <TableDialog
        open={tableDialogOpen}
        onOpenChange={setTableDialogOpen}
        onSave={handleAddEntity}
        editingEntity={
          editingEntityId
            ? entities.find((e) => e.id === editingEntityId)
            : undefined
        }
        entities={entities}
      />
      <RelationshipDialog
        open={relationshipDialogOpen}
        onOpenChange={setRelationshipDialogOpen}
        onSave={handleAddRelationship}
        entities={entities}
        selectedRelationship={
          selectedEdge
            ? relationships.find((r) => r.id === selectedEdge.id)
            : undefined
        }
      />
    </div>
  );
};

export default DiagramMap;
