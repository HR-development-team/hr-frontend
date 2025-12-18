import {
  OfficeNodeData,
  PositionNodeData,
  SafeTreeNode,
} from "../schemas/organizationSchema";

// 1. Define the allowed data types based on your schema
type AllowedNodeData = OfficeNodeData | PositionNodeData;

// 2. Constrain D to extend AllowedNodeData
interface TreeMapConfig<T, D extends AllowedNodeData> {
  getKey: (item: T) => string;
  getData: (item: T) => D;
  getChildren: (item: T) => T[] | undefined;
  nodeType?: string;
}

export const mapDataToTreeNode = <T, D extends AllowedNodeData>(
  items: T[],
  config: TreeMapConfig<T, D>
): SafeTreeNode[] => {
  return items.map((item) => {
    const childrenData = config.getChildren(item);

    const hasChildren = childrenData && childrenData.length > 0;

    // 3. Construct the object.
    // TypeScript now knows 'data' (D) fits inside SafeTreeNode['data']
    return {
      key: config.getKey(item),
      type: config.nodeType || "person",
      expanded: true,
      data: config.getData(item),
      children: hasChildren
        ? mapDataToTreeNode<T, D>(childrenData!, config)
        : [], // Use [] instead of undefined if SafeTreeNode expects an array, usually safer for PrimeReact
    };
  });
};
