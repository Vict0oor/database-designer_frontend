import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { validateAttributeName, validateEntityName } from "../../utils/validation";
import { ATTRIBUTE_TYPES, DEFAULT_ATTRIBUTE_TYPE} from "../../constants/attributeTypes";


const TableDialog = ({ open, onOpenChange, onSave, editingEntity, entities}) => {
  const [entityName, setEntityName] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    type: DEFAULT_ATTRIBUTE_TYPE,
    isPrimaryKey: false,
    isNullable: true,
    isUnique: false,
    defaultValue: "",
  });

  useEffect(() => {
    if (open && editingEntity) {
      setEntityName(editingEntity.name);
      setAttributes(editingEntity.attributes);
    } else if (!open) {
      setEntityName("");
      setAttributes([]);
      setNewAttribute({
        name: "",
        type: DEFAULT_ATTRIBUTE_TYPE,
        isPrimaryKey: false,
        isNullable: true,
        isUnique: false,
        defaultValue: "",
      });
    }
  }, [open, editingEntity]);

  const handleAddAttribute = () => {
    const validationError = validateAttributeName(newAttribute.name, attributes);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (newAttribute.isPrimaryKey && attributes.some(attr => attr.isPrimaryKey)) {
      toast.error("There is already a primary key.");
      return;
    }

    const updatedAttributes = [...attributes, newAttribute];
    updatedAttributes.sort((a, b) => (b.isPrimaryKey ? 1 : 0) - (a.isPrimaryKey ? 1 : 0));

    setAttributes(updatedAttributes);
    setNewAttribute({
      name: "",
      type: DEFAULT_ATTRIBUTE_TYPE,
      isPrimaryKey: false,
      isNullable: true,
      isUnique: false,
      defaultValue: "",
    });
  };

  const handleRemoveAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!entityName.trim()) {
      toast.error("Entity name is required.");
      return;
    }

    if (entities.some((entity) => entity.name.toLowerCase() === entityName.toLowerCase() && entity.id !== editingEntity?.id)) {
      toast.error("An entity with this name already exists.");
      return;
    }

    const entityNameError = validateEntityName(entityName);
    if (entityNameError) {
      toast.error(entityNameError);
      return;
    }

    const primaryKeys = attributes.filter(attr => attr.isPrimaryKey);

    if (primaryKeys.length === 0) {
      toast.error("You need to define a primary key in the table.");
      return;
    }

    if (primaryKeys.length > 1) {
      toast.error("Entity must have exactly one Primary Key.");
      return;
    }

    const entity = {
      id: editingEntity?.id || "",
      name: entityName,
      attributes,
      position: editingEntity?.position || { x: 0, y: 0 },
    };

    onSave(entity);
  };

  return (
    open && (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        onClick={() => onOpenChange(false)}
      >
        <div
          className="bg-black p-6 rounded-lg shadow-lg w-[420px]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingEntity ? "Edit Entity" : "Add New Entity"}
          </h2>
          <label className="font-medium block mb-2">
            Entity Name
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g. users"
              className="w-full border p-2 rounded mt-1"
            />
          </label>

          <h3 className="font-medium mb-2">Attributes</h3>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newAttribute.name}
              onChange={(e) =>
                setNewAttribute({ ...newAttribute, name: e.target.value })
              }
              placeholder="Name"
              className="border p-2 flex-1 rounded"
            />
            <select
              value={newAttribute.type}
              onChange={(e) =>
                setNewAttribute({ ...newAttribute, type: e.target.value })
              }
              className="border p-2 rounded cursor-pointer"
            >
              {ATTRIBUTE_TYPES.map((type, index) => (
                <option key={index} value={type} className="bg-black text-white hover:bg-gray-800">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={newAttribute.isPrimaryKey}
                onChange={(e) =>
                  setNewAttribute({
                    ...newAttribute,
                    isPrimaryKey: e.target.checked,
                  })
                }
              />
              <span className="ml-2">Primary Key</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={newAttribute.isUnique}
                onChange={(e) =>
                  setNewAttribute({
                    ...newAttribute,
                    isUnique: e.target.checked,
                  })
                }
              />
              <span className="ml-2">Unique</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={!newAttribute.isNullable}
                onChange={(e) =>
                  setNewAttribute({
                    ...newAttribute,
                    isNullable: !e.target.checked,
                  })
                }
              />
              <span className="ml-2">Not Null</span>
            </label>
          </div>
          <button
            className="bg-orange-500 cursor-pointer flex space-x-1 text-white px-3 py-1 rounded mb-3 hover:bg-orange-400"
            onClick={handleAddAttribute}
          >
            <span >Add Attribute</span>
            <Plus/>
          </button>

          {attributes.length > 0 ? (
            <ul className="border p-2 rounded max-h-40 overflow-auto">
              {attributes.map((attr, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-3 px-4 mb-2 border border-gray-600 rounded-lg hover:bg-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-medium line-clamp-1">
                      {attr.name}{" "}
                      <span className="text-orange-500">({attr.type})</span>
                    </span>

                    <div className="flex gap-2 mt-1">
                      {attr.isPrimaryKey && (
                        <span className="text-xs bg-gray-600 text-white py-1 px-2 rounded-full">
                          Primary Key
                        </span>
                      )}
                      {attr.isUnique && (
                        <span className="text-xs bg-blue-500 text-white py-1 px-2 rounded-full">
                          Unique
                        </span>
                      )}
                      {!attr.isNullable && (
                        <span className="text-xs bg-red-500 text-white py-1 px-2 rounded-full">
                          Not Null
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleRemoveAttribute(index)}
                  >
                    <Trash2 />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No attributes added yet</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-gray-400 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-400"
              onClick={handleSave}
            >
              {editingEntity ? "Update Entity" : "Add Entity"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default TableDialog;