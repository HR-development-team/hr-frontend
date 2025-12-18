import { TreeNode } from "primereact/treenode";

// --- LEVEL 1: OFFICE (Flat or Tree) ---
export interface OfficeStructure {
  id?: number; // Optional, depending if your API sends it
  office_code: string;
  name: string;
  address: string;
  description?: string;
  children?: OfficeStructure[]; // Optional if office has sub-offices
}

export interface OfficeNodeData
  extends Omit<OfficeStructure, "id" | "children"> {
  type: string;
}

// --- LEVEL 2: POSITION (Recursive Tree) ---
// Updated to match your API response exactly
export interface PositionStructure {
  // API doesn't return 'id', strictly uses 'position_code'
  position_code: string;
  name: string;
  // These can be null in the API (e.g. Vacant positions)
  employee_code: string | null;
  employee_name: string | null;
  children: PositionStructure[];
}

export interface PositionNodeData extends Omit<PositionStructure, "children"> {
  type: string;
  image?: string; // Optional field for UI
}

// --- UTILS ---
export interface SafeTreeNode extends TreeNode {
  type?: string;
  children?: SafeTreeNode[];
  data: OfficeNodeData | PositionNodeData; // Generic typing helper
}
