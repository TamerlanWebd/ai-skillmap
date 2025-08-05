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
} from "reactflow";
import axios from "axios";
import debounce from "lodash.debounce";
import { SkillNodeData } from "@/app/components/custom-nodes/SkillNode";

const getInitialNodes = (): Node<SkillNodeData>[] => [
  {
    id: "welcome",
    type: "skill",
    position: { x: 250, y: 150 },
    data: { label: "Добро пожаловать в AI SkillMap!", progress: 100 },
  },
  {
    id: "add_skill",
    type: "skill",
    position: { x: 250, y: 350 },
    data: {
      label: "Дважды кликните, чтобы редактировать",
      progress: 0,
      url: "https://roadmap.sh",
    },
  },
];

interface RFState {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  isLoaded: boolean;
  isGenerating: boolean;
  editingNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addSkillNode: (skillName: string) => void;
  addMultipleNodes: (skillNames: string[]) => void;
  loadMap: () => Promise<void>;
  setEditingNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, newData: Partial<SkillNodeData>) => void;
  getAiSuggestions: () => Promise<void>;
}
const debouncedSave = debounce(
  (state: { nodes: Node<SkillNodeData>[]; edges: Edge[] }) => {
    console.log("Saving map to DB with latest state:", state);
    axios.post("/api/skillmap", { nodes: state.nodes, edges: state.edges });
  },
  2000
);

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
        { ...connection, animated: true, type: "smoothstep" },
        state.edges
      ),
    }));
    const { nodes, edges } = get();
    debouncedSave({ nodes, edges });
  },
  addSkillNode: (skillName: string) => {
    const newNode: Node<SkillNodeData> = {
      id: `${Date.now()}`,
      type: "skill",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: skillName, progress: 0 },
    };
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
    console.log("Loading map from DB...");
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
