import Node from './Node';
interface TraversalCallback {
    (node: Node): void;
}
export declare function preorderRecursive(subRoot: Node, visit: TraversalCallback, thisArg?: any): void;
export declare function inorderRecursive(node: Node, visit: TraversalCallback, thisArg?: any): void;
export declare function postorderRecursive(subRoot: Node, visit: TraversalCallback, thisArg?: any): void;
export declare function preorder(subRoot: Node, visit: TraversalCallback, thisArg?: any): void;
export declare function inorder(subRoot: Node, visit: TraversalCallback, thisArg?: any): void;
export declare function postorder(subRoot: Node, visit: TraversalCallback, thisArg?: any): void;
export {};
