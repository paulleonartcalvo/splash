import { type NodeProps } from "@xyflow/react";
import { type PoolObject, getObjectType, getShape } from "./poolTypes";

type PoolObjectNodeProps = NodeProps & {
  type: "poolObject";
  data: PoolObject;
};

export function PoolObjectNode(props: PoolObjectNodeProps) {
  const objectType = getObjectType(props.data.typeId);
  const shape = objectType ? getShape(objectType.shapeId) : null;
  
  if (!objectType || !shape) {
    return (
      <div className="bg-red-100 border-red-300 rounded p-2 text-xs text-red-600">
        Invalid object type
      </div>
    );
  }

  // Use shape-specific settings with type safety
  const { shapeSettings } = props.data;
  
  let borderRadius = 'rounded-sm';
  let borderWidth = 'border';
  let outlineClass = '';

  if (shapeSettings.type === 'rectangle') {
    borderRadius = shapeSettings.rounded ? 'rounded-lg' : 'rounded-sm';
    if (shapeSettings.borderWidth) {
      borderWidth = `border-${shapeSettings.borderWidth}`;
    }
  } else if (shapeSettings.type === 'circle') {
    borderRadius = 'rounded-full';
  }

  // Add selection styling with outline (doesn't cause layout shift)
  if (props.selected) {
    outlineClass = 'outline outline-2 outline-gray-400 outline-offset-0';
  }

  return (
    <div
      id={props.id}
      className={`flex flex-col justify-center items-center h-full w-full bg-muted ${borderWidth} border-muted ${borderRadius} overflow-hidden transition-colors hover:bg-muted/80 ${outlineClass}`}
      style={{
        width: props.data.size.width,
        height: props.data.size.height,
      }}
    >
      <span className="text-xs text-muted-foreground font-medium p-1 truncate w-full text-center">
        {objectType.name}
      </span>
      <span className="text-xs text-muted-foreground/70 font-medium p-1">
        {props.data.label}
      </span>
    </div>
  );
}
