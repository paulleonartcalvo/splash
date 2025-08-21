import type { Node } from "@xyflow/react";

// Shape definitions (hardcoded, predefined)
interface BaseShape {
  id: string;
  name: string;
}

interface RectangleShape extends BaseShape {
  type: 'rectangle';
  defaultRounded: boolean;
}

interface CircleShape extends BaseShape {
  type: 'circle';
}

export type Shape = RectangleShape | CircleShape;

// Shape-specific settings
interface RectangleSettings {
  type: 'rectangle';
  rounded: boolean;
  borderWidth?: number;
}

interface CircleSettings {
  type: 'circle';
  // Circle-specific settings could go here
}

export type ShapeSettings = RectangleSettings | CircleSettings;

// Object Type definitions (templates/categories)
interface PoolObjectType {
  id: string;
  name: string;
  shapeId: string; // References a Shape
  defaultSize: { width: number; height: number };
  defaultShapeSettings: ShapeSettings;
}

// Pool Object instances (actual objects in the layout)
export type PoolObject = {
  id: string;
  typeId: string; // References a PoolObjectType
  label: string;
  position: { x: number; y: number }; // Position in the layout
  rotation: number;
  size: { width: number; height: number }; // Keep for clean serialization
  shapeSettings: ShapeSettings;
};

// Predefined shapes (hardcoded)
const SHAPES: Record<string, Shape> = {
  rectangle: {
    id: 'rectangle',
    name: 'Rectangle',
    type: 'rectangle',
    defaultRounded: false
  },
  circle: {
    id: 'circle', 
    name: 'Circle',
    type: 'circle'
  }
};

// Object types (can be user-defined later)
const OBJECT_TYPES: Record<string, PoolObjectType> = {
  poolChair: {
    id: 'poolChair',
    name: 'Pool Chair',
    shapeId: 'rectangle',
    defaultSize: { width: 50, height: 120 },
    defaultShapeSettings: { type: 'rectangle', rounded: true }
  },
  poolUmbrella: {
    id: 'poolUmbrella',
    name: 'Pool Umbrella',
    shapeId: 'circle',
    defaultSize: { width: 80, height: 80 },
    defaultShapeSettings: { type: 'circle' }
  }
};

// Helper to sync PoolObject to ReactFlow Node
export function toReactFlowNode(poolObject: PoolObject): Node<PoolObject> {
  return {
    id: poolObject.id,
    type: "poolObject",
    data: poolObject,
    width: poolObject.size.width,
    height: poolObject.size.height,
    position: poolObject.position,
  };
}

// Helper to create PoolObject from type
export function createPoolObject(
  id: string,
  typeId: string,
  label: string,
  position: { x: number; y: number },
  overrides: Partial<Pick<PoolObject, 'size' | 'shapeSettings' | 'rotation'>> = {}
): PoolObject {
  const objectType = OBJECT_TYPES[typeId];
  if (!objectType) {
    throw new Error(`Unknown object type: ${typeId}`);
  }

  return {
    id,
    typeId,
    label,
    position,
    rotation: overrides.rotation ?? 0,
    size: overrides.size ?? objectType.defaultSize,
    shapeSettings: overrides.shapeSettings ?? objectType.defaultShapeSettings,
  };
}

// Helper functions
export function getObjectType(typeId: string): PoolObjectType | undefined {
  return OBJECT_TYPES[typeId];
}

export function getShape(shapeId: string): Shape | undefined {
  return SHAPES[shapeId];
}

// Pool layout types
export type PoolLayoutType = {
  objects: PoolObject[];
};