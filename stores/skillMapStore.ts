import { create, StateCreator } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  MarkerType,
} from "reactflow";
import axios from "axios";
import debounce from "lodash.debounce";

const getInitialNodes = (): Node[] => [
  {
    id: "welcome",
    type: "skill",
    position: { x: 250, y: 150 },
    data: { label: "Добро пожаловать в AI SkillMap!", progress: 100 },
  },
  {
    id: "group_1",
    type: "group",
    position: { x: 500, y: 100 },
    data: { label: "Пример группы" },
    style: { width: 456, height: 210 },
  },
];

interface RFState {
  nodes: Node[];
  edges: Edge[];
  isLoaded: boolean;
  isGenerating: boolean;
  editingNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addSkillNode: (skillName: string, type?: string) => void;
  addMultipleNodes: (skillNames: string[]) => void;
  loadMap: () => Promise<void>;
  setEditingNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  getAiSuggestions: () => Promise<void>;
  setNodeParent: (nodeId: string, parentId: string | undefined) => void;
}

const debouncedSave = debounce((state: { nodes: Node[]; edges: Edge[] }) => {
  axios.post("/api/skillmap", { nodes: state.nodes, edges: state.edges });
}, 2000);

const storeCreator: StateCreator<RFState> = (set, get) => ({
  nodes: [],
  edges: [],
  isLoaded: false,
  isGenerating: false,
  editingNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
    if (get().isLoaded) {
      const { nodes, edges } = get();
      debouncedSave({ nodes, edges });
    }
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
    if (get().isLoaded) {
      const { nodes, edges } = get();
      debouncedSave({ nodes, edges });
    }
  },
  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        state.edges
      ),
    }));
    const { nodes, edges } = get();
    debouncedSave({ nodes, edges });
  },
  addSkillNode: (skillName: string, type = "skill") => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: skillName, progress: type === "skill" ? 0 : undefined },
    };
    if (type === "group") {
      newNode.style = { width: 456, height: 210 };
    }
    set((state) => ({ nodes: [...state.nodes, newNode] }));
    const { nodes, edges } = get();
    debouncedSave({ nodes, edges });
  },
  addMultipleNodes: (skillNames: string[]) => {
    const newNodes = skillNames.map((name, index) => ({
      id: `${Date.now()}-${name}-${index}`,
      type: "skill",
      position: { x: Math.random() * 400, y: Math.random() * 600 },
      data: { label: name, progress: 0 },
    }));
    set((state) => ({ nodes: [...state.nodes, ...newNodes] }));
    const { nodes, edges } = get();
    debouncedSave({ nodes, edges });
  },
  updateNodeData: (nodeId, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    }));
    const { nodes, edges } = get();
    debouncedSave({ nodes, edges });
  },
  setNodeParent: (nodeId, parentId) => {
    set((state) => {
      let tempNodes = state.nodes.map((n) => {
        if (n.id === nodeId) {
          const oldParent = state.nodes.find(
            (oldN) => oldN.id === n.parentNode
          );
          let newPosition = n.position;
          if (oldParent) {
            newPosition = {
              x: n.position.x + oldParent.position.x,
              y: n.position.y + oldParent.position.y,
            };
          }
          return {
            ...n,
            position: newPosition,
            parentNode: parentId,
            extent: parentId ? ("parent" as const) : undefined,
          };
        }
        return n;
      });

      if (parentId) {
        const parentNode = tempNodes.find((n) => n.id === parentId);
        if (!parentNode) return { nodes: tempNodes };

        const childNodes = tempNodes.filter((n) => n.parentNode === parentId);

        const PADDING = 24;
        const HEADER_HEIGHT = 70;
        const NODE_WIDTH = 192;
        const NODE_HEIGHT = 150;
        const NODES_IN_ROW = 2;

        childNodes.forEach((child, index) => {
          const col = index % NODES_IN_ROW;
          const row = Math.floor(index / NODES_IN_ROW);

          const newPosition = {
            x: PADDING + col * (NODE_WIDTH + PADDING),
            y: HEADER_HEIGHT + row * (NODE_HEIGHT + PADDING),
          };

          const childIndex = tempNodes.findIndex((n) => n.id === child.id);
          if (childIndex !== -1) {
            tempNodes[childIndex] = {
              ...tempNodes[childIndex],
              position: newPosition,
            };
          }
        });

        const requiredRows = Math.ceil(childNodes.length / NODES_IN_ROW);
        const requiredHeight =
          HEADER_HEIGHT +
          requiredRows * NODE_HEIGHT +
          (requiredRows + 1) * PADDING;

        const parentIndex = tempNodes.findIndex((n) => n.id === parentId);
        if (parentIndex !== -1) {
          tempNodes[parentIndex] = {
            ...tempNodes[parentIndex],
            style: {
              ...tempNodes[parentIndex].style,
              height: Math.max(210, requiredHeight),
            },
          };
        }
      }
      return { nodes: tempNodes };
    });
    const { nodes, edges } = get();
    debouncedSave({ nodes, edges });
  },
  setEditingNode: (nodeId) => {
    set({ editingNodeId: nodeId });
  },
  getAiSuggestions: async () => {
    const { nodes } = get();
    const skillLabels = nodes.map((node) => node.data.label).filter(Boolean);
    if (skillLabels.length === 0) {
      alert("Добавьте хотя бы один навык, чтобы AI мог дать рекомендации.");
      return;
    }
    set({ isGenerating: true });
    try {
      const response = await axios.post("/api/ai/suggest", {
        skills: skillLabels,
      });
      const { suggestedSkills } = response.data;
      if (suggestedSkills && Array.isArray(suggestedSkills)) {
        get().addMultipleNodes(suggestedSkills);
      } else {
        throw new Error("Invalid response format from AI API.");
      }
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      alert("Не удалось получить рекомендации от AI. Попробуйте позже.");
    } finally {
      set({ isGenerating: false });
    }
  },
  loadMap: async () => {},
});

const useSkillMapStore = create(storeCreator);

const loadMap = async () => {
  const { isLoaded } = useSkillMapStore.getState();
  if (isLoaded) return;
  try {
    const response = await axios.get("/api/skillmap");
    const { nodes, edges } = response.data;
    if (!nodes || nodes.length === 0) {
      useSkillMapStore.setState({
        nodes: getInitialNodes(),
        edges: [],
        isLoaded: true,
      });
    } else {
      useSkillMapStore.setState({ nodes, edges, isLoaded: true });
    }
  } catch (error) {
    console.error("Failed to load map, using initial state.", error);
    useSkillMapStore.setState({
      nodes: getInitialNodes(),
      edges: [],
      isLoaded: true,
    });
  }
};

useSkillMapStore.setState({ loadMap });

export default useSkillMapStore;
