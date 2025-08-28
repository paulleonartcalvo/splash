import type { Node } from "@xyflow/react";

// Shape definitions (hardcoded, predefined)
interface BaseShape {
  id: string;
  name: string;
}

interface RectangleShape extends BaseShape {
  type: "rectangle";
  defaultRounded: boolean;
}

interface CircleShape extends BaseShape {
  type: "circle";
}

export type Shape = RectangleShape | CircleShape;

// Shape-specific settings
interface RectangleSettings {
  type: "rectangle";
  rounded: boolean;
  defaultWidth: number;
  defaultHeight: number;
}

interface CircleSettings {
  type: "circle";
  radius: number;
}

export type ShapeSettingsMap = {
  rectangle: RectangleSettings;
  circle: CircleSettings;
};

export type ShapeSettings = RectangleSettings | CircleSettings;

// Object Type definitions (templates/categories)
export interface PoolObjectType {
  id: string;
  name: string;
  defaultShapeSettings: ShapeSettings;
}

// Pool Object instances (actual objects in the layout)
export type PoolObject = {
  id: string;
  typeId: string; // References a PoolObjectType
  label: string;
  position: { x: number; y: number }; // Position in the layout
  rotation: number;
  shapeSettings: ShapeSettings;
};

// Predefined shapes (hardcoded)
export const OBJECT_SHAPES: Record<string, Shape> = {
  rectangle: {
    id: "rectangle",
    name: "Rectangle",
    type: "rectangle",
    defaultRounded: false,
  },
  circle: {
    id: "circle",
    name: "Circle",
    type: "circle",
  },
};

// Object types (can be user-defined later)
export const OBJECT_TYPES: PoolObjectType[] = [
  {
    id: crypto.randomUUID(),
    name: "Pool Chair",
    defaultShapeSettings: { type: "rectangle", rounded: true, defaultWidth: 50, defaultHeight: 120 },
  },
  {
    id: crypto.randomUUID(),
    name: "Pool Umbrella",
    defaultShapeSettings: { type: "circle", radius: 40 },
  },
];

// Helper to extract size from shape settings
function getSizeFromShapeSettings(shapeSettings: ShapeSettings): { width: number; height: number } {
  if (shapeSettings.type === "rectangle") {
    return {
      width: shapeSettings.defaultWidth,
      height: shapeSettings.defaultHeight,
    };
  } else {
    return {
      width: shapeSettings.radius * 2,
      height: shapeSettings.radius * 2,
    };
  }
}

// Helper to sync PoolObject to ReactFlow Node
export function toReactFlowNode(poolObject: PoolObject): Node<PoolObject> {
  console.log("poolObject", poolObject);
  const size = getSizeFromShapeSettings(poolObject.shapeSettings);

  return {
    id: poolObject.id,
    type: "poolObject",
    data: poolObject,
    width: size.width,
    height: size.height,
    position: poolObject.position,
  };
}

// Helper to create PoolObject from type
export function createPoolObject(
  id: string,
  typeId: string,
  label: string,
  position: { x: number; y: number },
  overrides: Partial<
    Pick<PoolObject, "shapeSettings" | "rotation">
  > = {}
): PoolObject {
  const objectType = getObjectType(typeId);
  if (!objectType) {
    throw new Error(`Unknown object type: ${typeId}`);
  }

  return {
    id,
    typeId,
    label,
    position,
    rotation: overrides.rotation ?? 0,
    shapeSettings: overrides.shapeSettings ?? objectType.defaultShapeSettings,
  };
}

// Helper functions
export function getObjectType(typeId: string): PoolObjectType | undefined {
  return OBJECT_TYPES.find((type) => type.id === typeId);
}

export function getShape(shapeId: string): Shape | undefined {
  return OBJECT_SHAPES[shapeId];
}

// Pool layout types
export type PoolLayoutType = {
  objects: PoolObject[];
};
