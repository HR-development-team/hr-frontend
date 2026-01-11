import { TreeNode } from "primereact/treenode";

// --- LEVEL 1: OFFICE (Flat or Tree) ---
export interface OfficeStructure {
  id?: number; // Optional, depending if your API sends it
  office_code: string;
  name: string;
  address: string;
  description?: string;
  leader_name?: string;
  leader_position?: string;
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

export interface UnitData {
  id: number;
  name: string;
  description: string;
  code: string;
  type: "department" | "division";
}

export interface PositionData {
  id: number;
  position_code: string;
  division_code: string;
  name: string;
  employee_name: string | null;
  employee_code: string | null;
  holder: string;
  type: "position";
}

export type HierarchyNodeData = UnitData | PositionData | OfficeNodeData;

export interface HierarchyResponse {
  key: string;
  type: string;
  label: string;
  data: unknown;
  children: HierarchyResponse[];
}

export interface StructuredNodeCardProps {
  type: "department" | "division";
  name: string;
  code: string;
  leader_name?: string | null;
  leader_position?: string | null;
  description?: string;
}
