import { create } from "zustand";
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
    data: { label: "Добавьте свой первый навык", progress: 0 },
  },
];

type RFState = {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  isLoaded: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addSkillNode: (skillName: string) => void;
  loadMap: () => Promise<void>;
  saveMap: () => void;
};

const debouncedSave = debounce((nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0 && edges.length === 0) return;
  console.log("Saving map to DB...");
  axios.post("/api/skillmap", { nodes, edges });
}, 2000);

const useSkillMapStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  isLoaded: false,

  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
    get().saveMap();
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
    get().saveMap();
  },
  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge(
        { ...connection, animated: true, type: "smoothstep" },
        state.edges
      ),
    }));
    get().saveMap();
  },

  addSkillNode: (skillName: string) => {
    const newNode: Node<SkillNodeData> = {
      id: `${Date.now()}`,
      type: "skill",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: skillName, progress: 0 },
    };

    set((state) => ({ nodes: [...state.nodes, newNode] }));
    get().saveMap();
  },

  loadMap: async () => {
    if (get().isLoaded) return;
    try {
      console.log("Loading map from DB...");
      const response = await axios.get("/api/skillmap");
      const { nodes, edges } = response.data;

      if (!nodes || nodes.length === 0) {
        set({ nodes: getInitialNodes(), edges: [], isLoaded: true });
      } else {
        set({ nodes, edges, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load map, using initial state.", error);
      set({ nodes: getInitialNodes(), edges: [], isLoaded: true });
    }
  },

  saveMap: () => {
    if (!get().isLoaded) return;
    const { nodes, edges } = get();
    debouncedSave(nodes, edges);
  },
}));

export default useSkillMapStore;
