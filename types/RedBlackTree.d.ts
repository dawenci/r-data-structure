import { Comparable } from './Comparable';
import { BinarySearchTree } from './BinarySearchTree';
import { Node } from './Node';
export declare type Color = number;
export declare class RBNode<K extends Comparable, V> implements Node<K, V> {
    key: K;
    value?: V;
    parent: this;
    left: this;
    right: this;
    constructor(key: K, value?: V);
    /**
     * 结点颜色，新插入结点默认红色
     *
     * @type {Color}
     * @memberof RBNode
     */
    color: Color;
}
export declare class RedBlackTree<K extends Comparable, V, T extends RBNode<K, V>> extends BinarySearchTree<K, V, T> {
    /**
     * Inserts a new node with a specific key and value into the tree.
     *
     * @param {K} key
     * @param {V} [value]
     * @memberof RedBlackTree
     */
    insert(key: K, value?: V): void;
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @param {K} key
     * @returns {boolean} 是否成功删除结点
     * @memberof RedBlackTree
     */
    delete(key: K): boolean;
    /**
     *
     *
     * @private
     * @param {(T | Nil)} current
     * @param {(T | Nil)} parent
     * @memberof RedBlackTree
     */
    private _insertFixUp;
    /**
     *
     *
     * @private
     * @param {T} RBNil
     * @memberof RedBlackTree
     */
    private _removeFixUp;
    private _nil;
}
