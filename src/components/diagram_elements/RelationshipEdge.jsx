import { memo } from "react";
import { getBezierPath, EdgeLabelRenderer } from "reactflow";
import { Trash2 } from "lucide-react";

const RelationshipEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    let sourceSymbol = "";
    let targetSymbol = "";

    if (data?.type === "one-to-one") {
      sourceSymbol = "1";
      targetSymbol = "1";
    } else if (data?.type === "many-to-many") {
      sourceSymbol = "N";
      targetSymbol = "N";
    } else if (data?.type === "one-to-many") {
      sourceSymbol = data.sourceCardinality === "one" ? "1" : "N";
      targetSymbol = data.targetCardinality === "one" ? "1" : "N";
    }

    const handleDelete = (event) => {
      event.stopPropagation();
      if (data?.onDelete) {
        data.onDelete();
      }
    }

    return (
      <>
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          strokeWidth={2}
        />

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan flex items-center gap-1"
          >
            <div className="bg-black border rounded-md px-2 py-1 text-xs shadow-sm flex items-center gap-2">
              <span>{data?.type}</span>
              <button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={handleDelete}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </EdgeLabelRenderer>

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${
                sourceX + (targetX - sourceX) * 0.1
              }px,${sourceY + (targetY - sourceY) * 0.1}px)`,
              pointerEvents: "none",
            }}
            className="nodrag nopan"
          >
            <div className="bg-black border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
              {sourceSymbol}
            </div>
          </div>
        </EdgeLabelRenderer>

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${
                targetX - (targetX - sourceX) * 0.2
              }px,${targetY - (targetY - sourceY) * 0.2}px)`,
              pointerEvents: "none",
            }}
            className="nodrag nopan"
          >
            <div className="bg-black border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
              {targetSymbol}
            </div>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

export default RelationshipEdge;
