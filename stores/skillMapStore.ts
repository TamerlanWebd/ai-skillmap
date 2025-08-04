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

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  // Сюда мы будем добавлять новые действия, например, addSkillNode
};

const useSkillMapStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "1",
      type: "input",
      data: { label: "Frontend" },
      position: { x: 250, y: 5 },
    },
    { id: "2", data: { label: "React" }, position: { x: 100, y: 100 } },
    { id: "3", data: { label: "Next.js" }, position: { x: 400, y: 100 } },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
  ],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));

export default useSkillMapStore;
