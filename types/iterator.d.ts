/// <reference types="node" />
interface Node {
    parent: this | null;
    left: this | null;
    right: this | null;
    [key: string]: any;
}
/**
 * 中序遍历迭代器
 *
 * @template K
 * @template V
 * @template T
 * @param {(T | RbNil)} root
 * @returns {IterableIterator<RbNode<K, V>>}
 * @memberof BinarySearchTree
 */
export declare function inorder(root: Node | null): IterableIterator<Node | null>;
/**
 * 后续遍历迭代器
 *
 * @template K
 * @template V
 * @template T
 * @param {(T | RbNil)} root
 * @returns {IterableIterator<RbNode<K, V>>}
 * @memberof BinarySearchTree
 */
export declare function postorder(root: Node | null): IterableIterator<Node | null>;
/**
 * 前序遍历迭代器
 *
 * @template K
 * @template V
 * @template T
 * @param {(T | RbNil)} root
 * @returns {IterableIterator<RbNode<K, V>>}
 * @memberof BinarySearchTree
 */
export declare function preorder(root: Node | null): IterableIterator<Node | null>;
export {};
