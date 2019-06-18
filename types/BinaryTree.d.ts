/// <reference types="node" />
import Node, { Nil } from './Node';
export default class BinaryTree<K = any, V = any, T extends Node<K, V> = Node<K, V>> {
    private _root;
    private _size;
    /**
     * 前序遍历迭代器
     *
     * @static
     * @template K
     * @template V
     * @template T
     * @param {(T | Nil)} root
     * @returns {IterableIterator<T>}
     * @memberof BinaryTree
     */
    static preorder<K = any, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T>;
    /**
     * 中序遍历迭代器
     *
     * @static
     * @template K
     * @template V
     * @template T
     * @param {(T | Nil)} root
     * @returns {IterableIterator<T>}
     * @memberof BinaryTree
     */
    static inorder<K = any, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T>;
    /**
     * 后续遍历迭代器
     *
     * @static
     * @template K
     * @template V
     * @template T
     * @param {(T | Nil)} root
     * @returns {IterableIterator<T>}
     * @memberof BinaryTree
     */
    static postorder<K = any, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T>;
    /**
     * 结点数量
     *
     * @readonly
     * @memberof BinaryTree
     */
    readonly size: number;
    /**
     * 重置结点数量
     *
     * @memberof BinaryTree
     */
    resetSize(): void;
    /**
     * 增加结点数量
     *
     * @memberof BinaryTree
     */
    increaseSize(): void;
    /**
     * 减少结点数量
     *
     * @memberof BinaryTree
     */
    decreaseSize(): void;
    /**
     * 获取根结点
     *
     * @type {(T | Nil)}
     * @memberof BinaryTree
     */
    /**
    * 设置根结点
    *
    * @memberof BinaryTree
    */
    root: T | Nil;
    /**
     * 清空树
     *
     * @memberof BinaryTree
     */
    clear(): void;
    /**
     * 获取根结点的前序遍历迭代器
     *
     * @returns
     * @memberof BinaryTree
     */
    preorder(): IterableIterator<T>;
    /**
     * 获取根结点的中序遍历迭代器
     *
     * @returns
     * @memberof BinaryTree
     */
    inorder(): IterableIterator<T>;
    /**
     * 获取根结点的后续遍历迭代器
     *
     * @returns
     * @memberof BinaryTree
     */
    postorder(): IterableIterator<T>;
    /**
     * 迭代器执行器
     *
     * @param {IterableIterator<T>} iterator
     * @param {((value: V, key: K, tree: this) => false | void)} iteratee
     * @param {*} [thisArg]
     * @returns
     * @memberof BinaryTree
     */
    baseFor(iterator: IterableIterator<T>, iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any): this;
}
