import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useNodesState,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import { PoolObjectNode } from "./PoolObjectNode";
import {
  createPoolObject,
  toReactFlowNode,
  type PoolLayoutType,
  type PoolObject,
} from "./poolTypes";

const initialPoolObjects: PoolObject[] = [
  createPoolObject(
    "1",
    "poolChair",
    "Chair 1",
    { x: 0, y: 0 },
    {
      shapeSettings: { type: "rectangle", rounded: true },
    }
  ),
  createPoolObject("2", "poolUmbrella", "Umbrella 1", { x: 0, y: 100 }),
];

const initialNodes: Node<PoolObject>[] = [
  toReactFlowNode(initialPoolObjects[0]),
  toReactFlowNode(initialPoolObjects[1]),
];

const nodeTypes = {
  poolObject: PoolObjectNode,
};

type PoolLayoutProps = {
  layout?: PoolLayoutType;
};

// Higher-order component to wrap with ReactFlowProvider
function withReactFlowProvider<T extends object>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent(props: T) {
    return (
      <ReactFlowProvider>
        <Component {...props} />
      </ReactFlowProvider>
    );
  };
}

function PoolLayoutInner({ layout }: PoolLayoutProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [selectedNodes, setSelectedNodes] = useState<Node<PoolObject>[]>([]);
  const [copiedNodes, setCopiedNodes] = useState<Node<PoolObject>[]>([]);
  const [menu, setMenu] = useState<{
    nodes: Node<PoolObject>[];
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Selection utilities using ReactFlow recommended patterns
  const selectNodes = useCallback(
    (nodeIds: string[]) => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          selected: nodeIds.includes(node.id),
        }))
      );
    },
    [setNodes]
  );

  const selectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: true,
      }))
    );
  }, [setNodes]);

  const deselectAll = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: false,
      }))
    );
  }, [setNodes]);

  const selectByType = useCallback(
    (typeId: string) => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          selected: node.data.typeId === typeId,
        }))
      );
    },
    [setNodes]
  );

  const onSelectionContextMenu = useCallback(
    (event: React.MouseEvent, nodes: Node<PoolObject>[]) => {
      event.preventDefault();

      if (!ref.current) return;
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        nodes: nodes,
        top:
          event.clientY < pane.height - 200
            ? event.clientY - pane.top
            : undefined,
        left:
          event.clientX < pane.width - 200
            ? event.clientX - pane.left
            : undefined,
        right:
          event.clientX >= pane.width - 200
            ? pane.width - event.clientX
            : undefined,
        bottom:
          event.clientY >= pane.height - 200
            ? pane.height - event.clientY
            : undefined,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const alignNodesAlongYAxis = useCallback(() => {
    const nodesToAlign = menu?.nodes || selectedNodes;
    if (nodesToAlign.length < 2) return;

    const averageY =
      nodesToAlign.reduce((sum, node) => sum + node.position.y, 0) /
      nodesToAlign.length;

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const isSelected = nodesToAlign.some(
          (selectedNode) => selectedNode.id === node.id
        );
        if (isSelected) {
          return {
            ...node,
            position: {
              ...node.position,
              y: averageY,
            },
          };
        }
        return node;
      })
    );
    setMenu(null);
  }, [menu?.nodes, selectedNodes, setNodes]);

  const copyNodes = useCallback(() => {
    const nodesToCopy = menu?.nodes || selectedNodes;
    setCopiedNodes(nodesToCopy);
    setMenu(null);
  }, [menu, selectedNodes]);

  const pasteNodes = useCallback(() => {
    if (copiedNodes.length === 0) return;

    const newNodes = copiedNodes.map((n) => ({
      ...n,
      position: {
        x: n.position.x + 20,
        y: n.position.y + 20,
      },
      id: crypto.randomUUID(),
      selected: true, // Pre-select the new nodes
    }));

    setNodes((prev) => [
      ...prev.map(node => ({ ...node, selected: false })), // Deselect existing nodes
      ...newNodes,
    ]);
  }, [copiedNodes, setNodes]);

  const deleteNodes = useCallback(() => {
    const nodesToDelete = menu?.nodes || selectedNodes;
    const nodeIdsToDelete = new Set(nodesToDelete.map((n) => n.id));

    setNodes((prev) => prev.filter((node) => !nodeIdsToDelete.has(node.id)));
    setMenu(null);
  }, [menu?.nodes, selectedNodes, setNodes]);

  const onCopy = useCallback(() => {
    setCopiedNodes(selectedNodes);
  }, [selectedNodes]);

  const onPaste = useCallback(() => {
    if (copiedNodes.length === 0) return;

    const newNodeIds: string[] = [];
    const newNodes = copiedNodes.map((n) => {
      const newId = crypto.randomUUID();
      newNodeIds.push(newId);
      return {
        ...n,
        position: {
          x: n.position.x + 20,
          y: n.position.y + 20,
        },
        id: newId,
        selected: true, // Pre-select the new nodes
      };
    });

    setNodes((prev) => [
      ...prev.map(node => ({ ...node, selected: false })), // Deselect existing nodes
      ...newNodes,
    ]);
  }, [copiedNodes, setNodes]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        ref={ref}
        snapGrid={[10, 10]}
        snapToGrid
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onPaneClick={onPaneClick}
        onSelectionContextMenu={onSelectionContextMenu}
        onSelectionChange={({ nodes }) => {
          setSelectedNodes(nodes);
        }}
        selectionMode={SelectionMode.Partial}
        onCopy={onCopy}
        onPaste={onPaste}
        fitView
      >
        <Background />
        <Controls />
        {menu && (
          <div
            className="absolute z-50 bg-popover text-popover-foreground min-w-32 overflow-hidden rounded-md border p-1 shadow-md"
            style={{
              top: menu.top,
              left: menu.left,
              right: menu.right,
              bottom: menu.bottom,
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={alignNodesAlongYAxis}
            >
              Align Y-Axis
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={copyNodes}
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={deleteNodes}
            >
              Delete
            </Button>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}

// Export the wrapped component
export const PoolLayout = withReactFlowProvider(PoolLayoutInner);
