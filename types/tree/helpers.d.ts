/// <reference types="node" />
import { Node } from './Node';
export declare function setRoot<T extends Node<any, any>>(tree: any, node: T): void;
/**
 * 设置左子结点，同时维护 parent 关系
 */
export declare function setLeft<T extends Node<any, any>>(node: T, child: T): void;
/**
 * 设置右子结点，同时维护 parent 关系
 */
export declare function setRight<T extends Node<any, any>>(node: T, child: T): void;
export declare function rotateLeft<T extends Node<any, any>>(node: T): T;
export declare function rotateRight<T extends Node<any, any>>(node: T): T;
/**
 * Gets the maximum value node, rooted in a particular node.
 *
 * @param {T} subRoot The node to search.
 * @returns {T} The node with the maximum value in the tree.
 */
export declare function maximumNode<T extends Node<any, any>>(subRoot: T): T;
/**
 * Gets the minimum value node, rooted in a particular node.
 *
 * @param {T} subRoot The node to search.
 * @returns {T} The node with the minimum value in the tree.
 * @memberof BinarySearchTree
 */
export declare function minimumNode<T extends Node<any, any>>(subRoot: T): T;
/**
 * 迭代
 *
 * @param {IterableIterator<T>} iterator
 * @param {(key: K, value: V) => any} iteratee
 * @returns {void}
 */
export declare function baseFor<T extends Node<any, any>>(tree: any, iterator: IterableIterator<T>, iteratee: (key: any, value: any) => any): void;
