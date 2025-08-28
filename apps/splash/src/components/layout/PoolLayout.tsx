import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useNodesState,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTheme } from "../ui/theme-provider";
import { PoolObjectNode } from "./PoolObjectNode";
import { PoolObjectSettingsForm } from "./PoolObjectSettingsForm";
import {
  createPoolObject,
  getObjectType,
  OBJECT_TYPES,
  toReactFlowNode,
  type PoolLayoutType,
  type PoolObject,
} from "./poolTypes";

import { NewShapeForm } from "./NewShapeForm";
import "./pool-layout.css";
const initialPoolObjects: PoolObject[] = [
  // createPoolObject(
  //   "1",
  //   "poolChair",
  //   "Chair 1",
  //   { x: 0, y: 0 },
  //   {
  //     shapeSettings: { type: "rectangle", rounded: true },
  //   }
  // ),
  // createPoolObject("2", "poolUmbrella", "Umbrella 1", { x: 0, y: 100 }),
];

const initialNodes: Node<PoolObject>[] = [
  // toReactFlowNode(initialPoolObjects[0]),
  // toReactFlowNode(initialPoolObjects[1]),
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
  const themeMode = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const { screenToFlowPosition } = useReactFlow();

  const [selectedNodes, setSelectedNodes] = useState<Node<PoolObject>[]>([]);
  const [copiedNodes, setCopiedNodes] = useState<Node<PoolObject>[]>([]);
  const [menu, setMenu] = useState<{
    nodes: Node<PoolObject>[];
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  } | null>(null);
  const [editingNode, setEditingNode] = useState<PoolObject | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createTypeDialogOpen, setCreateTypeDialogOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<{
    isActive: boolean;
    nodeTypeId?: string;
  }>({ isActive: false });
  const [nodeCounter, setNodeCounter] = useState(3); // For unique IDs
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

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      // If there are selected nodes, just deselect them and don't paint
      if (selectedNodes.length > 0) {
        deselectAll();
        setMenu(null);
        return;
      }

      // Normal painting behavior when no nodes are selected
      if (creationMode.isActive && creationMode.nodeTypeId) {
        console.log("HI");
        const objectType = getObjectType(creationMode.nodeTypeId);
        console.log(creationMode);
        console.log(OBJECT_TYPES);
        if (!objectType) {
          console.error("Unknown object type:", creationMode.nodeTypeId);
          return;
        }

        // Use screenToFlowPosition to get correct coordinates
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newObject = createPoolObject(
          `n${nodeCounter}`,
          creationMode.nodeTypeId,
          `${objectType.name} ${nodeCounter}`,
          position
        );

        const newNode = toReactFlowNode(newObject);
        console.log(newNode);
        setNodes((prev) => [
          ...prev.map((node) => ({ ...node, selected: false })), // Deselect existing
          { ...newNode, selected: false }, // Don't select new node
        ]);
        setNodeCounter((prev) => prev + 1);
      } else {
        setMenu(null); // Close context menu
      }
    },
    [
      creationMode,
      nodeCounter,
      setNodes,
      screenToFlowPosition,
      selectedNodes,
      deselectAll,
    ]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node<PoolObject>) => {
      event.stopPropagation();
      setEditingNode(node.data);
      setDialogOpen(true);
    },
    []
  );

  const updateNode = useCallback(
    (updatedNode: PoolObject) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id === updatedNode.id) {
            return {
              ...node,
              data: updatedNode,
            };
          }
          return node;
        })
      );
      setDialogOpen(false);
      setEditingNode(null);
    },
    [setNodes]
  );

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
      ...prev.map((node) => ({ ...node, selected: false })), // Deselect existing nodes
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
      ...prev.map((node) => ({ ...node, selected: false })), // Deselect existing nodes
      ...newNodes,
    ]);
  }, [copiedNodes, setNodes]);

  // Handle escape key to deselect first, then exit creation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedNodes.length > 0) {
          // First priority: deselect nodes if any are selected
          deselectAll();
        } else if (creationMode.isActive) {
          // Second priority: exit creation mode if nothing is selected
          setCreationMode({ isActive: false });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodes.length, creationMode.isActive, deselectAll]);

  return (
    <div
      className={`h-full w-full ${creationMode.isActive ? "cursor-crosshair" : ""}`}
    >
      <ReactFlow
        colorMode={themeMode.theme}
        ref={ref}
        // className="[&_.react-flow__pane.draggable]:cursor-pointer [&_.react-flow__pane]:cursor-default"
        className={creationMode.isActive ? "cursor-crosshair" : ""}
        snapGrid={[10, 10]}
        snapToGrid
        nodes={nodes}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onPaneClick={onPaneClick}
        onSelectionContextMenu={onSelectionContextMenu}
        onSelectionChange={({ nodes }) => {
          setSelectedNodes(nodes);
        }}
        selectNodesOnDrag={false}
        selectionMode={SelectionMode.Partial}
        onCopy={onCopy}
        onPaste={onPaste}
        fitView
        nodeOrigin={[0.5, 0.5]}
      >
        <Background />
        <Controls />

        <Panel position="top-right" className="select-none">
          <div className="flex items-center gap-2">
            {/* Object Type Selector */}
            <Select
              value={creationMode.nodeTypeId || ""}
              onValueChange={(typeId) =>
                setCreationMode({ isActive: true, nodeTypeId: typeId })
              }
            >
              <SelectTrigger className="w-48 bg-background/95 backdrop-blur-sm shadow-lg border border-border">
                <SelectValue placeholder="Select type to paint" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OBJECT_TYPES).map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Create New Type Button */}
            <Button
              variant="outline"
              size="icon"
              className="bg-background/95 backdrop-blur-sm shadow-lg border border-border"
              onClick={() => setCreateTypeDialogOpen(true)}
            >
              +
            </Button>
          </div>
        </Panel>
        {menu && (
          <div
            className="select-none absolute z-50 bg-popover text-popover-foreground min-w-32 overflow-hidden rounded-md border p-1 shadow-md"
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
              Align Vertically
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingNode(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Object</DialogTitle>

            <DialogDescription>
              Here you can update all the settings related to this object
            </DialogDescription>
          </DialogHeader>
          {editingNode && (
            <PoolObjectSettingsForm value={editingNode} onSubmit={updateNode} />
          )}
        </DialogContent>
      </Dialog>

      {/* Create New Object Type Dialog */}
      <Dialog
        open={createTypeDialogOpen}
        onOpenChange={setCreateTypeDialogOpen}
      >
        <DialogHeader>
          <DialogTitle>Create New Object Type</DialogTitle>
          <DialogDescription>
            Define a new type of object that can be placed in your pool layout.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <NewShapeForm />
        </DialogContent>
        <DialogFooter></DialogFooter>
      </Dialog>
    </div>
  );
}

// Export the wrapped component
export const PoolLayout = withReactFlowProvider(PoolLayoutInner);
