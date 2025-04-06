import { Handle, Position } from "reactflow";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const TableNode = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-[280px] text-white rounded-lg border-2 shadow-lg transition-all duration-200 ${isHovered ? "border-orange-500" : "border-white"
        }`}
      style={{ backgroundColor: "#0e0e0e" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: "red", width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: "green", width: 10, height: 10 }}
      />

      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] rounded-t-lg">
        <span className="font-semibold">{data.label}</span>
        <div className="flex gap-2">
          <button
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
            onClick={data.onEdit}
          >
            <Edit size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
            onClick={data.onDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-white" />

      <div className="text-sm py-2">
        {data.attributes.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="text-xs font-medium text-gray-400 uppercase">
                  <th className="px-4 py-2 border-b-2 border-white">Attribute</th>
                  <th className="px-4 py-2 border-b-2 border-white">Type</th>
                </tr>
              </thead>
              <tbody>
                {[...data.attributes]
                  .sort((a, b) => (b.isPrimaryKey ? 1 : 0) - (a.isPrimaryKey ? 1 : 0))
                  .map((attr, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-orange-400 ${index % 2 === 0 ? "bg-[#0e0e0e]" : "bg-[#1e1e1e]"
                        }`}
                    >
                      <td className="px-4 py-2 border-b border-white">
                        <div className="flex items-center gap-2">
                          {attr.isPrimaryKey && (
                            <span className="text-xs bg-orange-500 text-white px-1 rounded">
                              PK
                            </span>
                          )}
                          <span>{attr.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-b border-white">
                        <div className="flex items-center gap-2">
                          <span>{attr.type}</span>
                          {!attr.isNullable && (
                            <span className="text-xs bg-red-600 text-white px-1 rounded">
                              NN
                            </span>
                          )}
                          {attr.isUnique && (
                            <span className="text-xs bg-blue-600 text-white px-1 rounded">
                              UQ
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="text-center py-2 text-gray-400">No attributes</div>
        )}
      </div>
    </div>
  );
};

export default TableNode;
