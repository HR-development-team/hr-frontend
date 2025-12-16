import { TreeNode } from "primereact/treenode";

export interface OfficeStructure {
  id: number;
  office_code: string;
  name: string;
  address: string;
  description?: string;
  children: OfficeStructure[];
}

export interface OfficeNodeData
  extends Omit<OfficeStructure, "id" | "children"> {
  type: string;
}

export interface PositionStructure {
  id: number;
  position_code: string;
  name: string;
  employee_code: string;
  employee_name: string;
  children: PositionStructure[];
}

export interface PositionNodeData
  extends Omit<PositionStructure, "id" | "children"> {
  type: string;
  image: string;
}

export interface SafeTreeNode extends TreeNode {
  type?: string;
  children?: SafeTreeNode[];
}
