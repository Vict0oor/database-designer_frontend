import { useEffect, useState } from "react";

const RelationshipDialog = ({ open, onOpenChange, onSave, entities, selectedRelationship }) => {
  const [sourceEntityId, setSourceEntityId] = useState("");
  const [targetEntityId, setTargetEntityId] = useState("");
  const [relationshipType, setRelationshipType] = useState("one-to-many");
  const [inheritanceBase, setInheritanceBase] = useState("source");

  useEffect(() => {
    if (selectedRelationship) {
      setSourceEntityId(selectedRelationship.sourceEntityId);
      setTargetEntityId(selectedRelationship.targetEntityId);
      setRelationshipType(selectedRelationship.type);
      if (selectedRelationship.type === "inheritance") {
        setInheritanceBase(selectedRelationship.sourceCardinality === "base" ? "source" : "target");
      }
    } else {
      setSourceEntityId("");
      setTargetEntityId("");
      setRelationshipType("one-to-many");
      setInheritanceBase("source");
    }
  }, [selectedRelationship]);

  const handleSave = () => {
    if (!sourceEntityId || !targetEntityId) return;

    let newRelationship = {
      id: selectedRelationship ? selectedRelationship.id : `rel-${Date.now()}`,
      sourceEntityId,
      targetEntityId,
      type: relationshipType,
    };

    if (relationshipType === "inheritance") {
      if (inheritanceBase === "source") {
        newRelationship = {
          ...newRelationship,
          sourceCardinality: "base",
          targetCardinality: "derived",
        };
      } else {
        newRelationship = {
          ...newRelationship,
          sourceCardinality: "derived",
          targetCardinality: "base",
        };
      }
    }

    onSave(newRelationship);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    >
      <div className="bg-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {selectedRelationship ? "Edit Relationship" : "Add Relationship"}
        </h2>
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Relationship Type</label>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              className="w-full border p-2 rounded bg-black cursor-pointer"
            >
              <option value="one-to-one">One-to-One</option>
              <option value="one-to-many">One-to-Many</option>
              <option value="many-to-many">Many-to-Many</option>
              <option value="inheritance">Inheritance</option>
            </select>
          </div>

          {relationshipType === "inheritance" && (
            <div>
              <label className="block text-sm font-medium">Select Base Table</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inheritanceBase"
                    value="source"
                    checked={inheritanceBase === "source"}
                    onChange={(e) => setInheritanceBase(e.target.value)}
                    className="mr-1"
                  />
                  <span className="text-green-600">Source</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inheritanceBase"
                    value="target"
                    checked={inheritanceBase === "target"}
                    onChange={(e) => setInheritanceBase(e.target.value)}
                    className="mr-1"
                  />
                  <span className="text-red-500">Target</span>
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-300 cursor-pointer rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 cursor-pointer text-white rounded"
          >
            {selectedRelationship ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDialog;
