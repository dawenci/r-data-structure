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
/**
* 遍历 from 、to 两个 key 之间的所有结点
*/
export declare function inorderRange(root: Node | null, compare: (a: any, b: any) => number, fromKey: any, toKey: any): IterableIterator<Node>;
export {};
