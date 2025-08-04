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
  editingNodeId: string | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addSkillNode: (skillName: string) => void;
  loadMap: () => Promise<void>;
  setEditingNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, newData: Partial<SkillNodeData>) => void;
}
const debouncedSave = debounce((get: () => RFState) => {
  if (!get().isLoaded) return;
  const { nodes, edges } = get();
  console.log("Saving map to DB with latest state...");
  axios.post("/api/skillmap", { nodes, edges });
}, 2000);

const storeCreator: StateCreator<RFState> = (set, get) => ({
  nodes: [],
  edges: [],
  isLoaded: false,
  editingNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
    debouncedSave(get);
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
    debouncedSave(get);
  },
  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge(
        { ...connection, animated: true, type: "smoothstep" },
        state.edges
      ),
    }));
    debouncedSave(get);
  },
  addSkillNode: (skillName: string) => {
    const newNode: Node<SkillNodeData> = {
      id: `${Date.now()}`,
      type: "skill",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: skillName, progress: 0 },
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
    debouncedSave(get);
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
    debouncedSave(get);
  },
  setEditingNode: (nodeId) => {
    set({ editingNodeId: nodeId });
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
