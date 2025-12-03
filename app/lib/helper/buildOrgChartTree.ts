import { SafeTreeNode } from "../types/organization";

interface TreeMapConfig<T, D> {
  getKey: (item: T) => string;
  getData: (item: T) => D;
  getChildren: (item: T) => T[] | undefined;
  nodeType?: string;
}

export const mapDataToTreeNode = <T, D>(
  items: T[],
  config: TreeMapConfig<T, D>
): SafeTreeNode[] => {
  return items.map((item) => {
    const childrenData = config.getChildren(item);

    const hasChildren = childrenData && childrenData.length > 0;

    return {
      key: config.getKey(item),
      type: config.nodeType || "person",
      expanded: true,
      data: config.getData(item),
      children: hasChildren
        ? mapDataToTreeNode<T, D>(childrenData!, config)
        : undefined,
    };
  });
};
