import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { SkillNodeData } from "@/app/components/custom-nodes/SkillNode";

type RFState = {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addSkillNode: (skillName: string) => void;
};
const initialNodes: Node<SkillNodeData>[] = [
  {
    id: "1",
    type: "skill",
    position: { x: 250, y: 50 },
    data: { label: "Frontend", progress: 80 },
  },
  {
    id: "2",
    type: "skill",
    position: { x: 100, y: 250 },
    data: { label: "React", progress: 95 },
  },
  {
    id: "3",
    type: "skill",
    position: { x: 400, y: 250 },
    data: { label: "Next.js", progress: 70 },
  },
];

const useSkillMapStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      type: "smoothstep",
    },
    {
      id: "e1-3",
      source: "1",
      target: "3",
      animated: true,
      type: "smoothstep",
    },
  ],
  onNodesChange: (changes: NodeChange[]) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes: EdgeChange[]) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection: Connection) =>
    set({
      edges: addEdge(
        { ...connection, animated: true, type: "smoothstep" },
        get().edges
      ),
    }),
  addSkillNode: (skillName: string) => {
    const newNode: Node<SkillNodeData> = {
      id: `${Date.now()}`,
      type: "skill",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: skillName,
        progress: 0,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },
}));

export default useSkillMapStore;
