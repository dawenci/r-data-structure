import { Comparable } from './Comparable';
import { BinarySearchTree } from './BinarySearchTree';
import { Node } from './Node';
export declare class AVLNode<K extends Comparable, V> implements Node<K, V> {
    key: K;
    value?: V;
    parent: this;
    left: this;
    right: this;
    constructor(key: K, value?: V);
    /**
     * 记录高度
     *
     * @private
     * @type {number}
     * @memberof AVLNode
     */
    private _height;
    /**
     * 辅助属性，用来记录高度修改前的值，回溯判断用
     * 在设置 height 时，自动维护，不要手动修改
     *
     * @private
     * @type {number}
     * @memberof AVLNode
     */
    private _prevHeight;
    /**
     * 获取刷新前的高度
     *
     * @readonly
     * @type {number}
     * @memberof AVLNode
     */
    readonly prevHeight: number;
    height: number;
    /**
     * 获取左子树高度
     * Convenience function to get the height of the left child of the node,
     * returning -1 if the node is null.
     *
     * @readonly
     * @type {number}
     * @memberof AVLNode
     */
    readonly leftHeight: number;
    /**
     * 获取右子树高度
     * Convenience function to get the height of the right child of the node,
     * returning -1 if the node is null.
     *
     * @readonly
     * @type {number}
     * @memberof AVLNode
     */
    readonly rightHeight: number;
    /**
     * 获取平衡因子
     * Gets the balanced factor of a node, indicating whether the left or right sub-trees are unbalanced.
     *
     * @readonly
     * @type {number}
     * @memberof AVLNode
     */
    readonly balanceFactor: number;
    /**
     *
     * @returns
     * @memberof Node
     */
    updateHeight(): void;
}
export declare class AVLTree<K extends Comparable, V, T extends AVLNode<K, V>> extends BinarySearchTree<K, V, T> {
    rotateRight(node: T): T;
    rotateLeft(node: T): T;
    insert(key: K, value?: V): void;
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @param {K} key
     * @returns {boolean} 是否成功删除结点
     * @memberof AVLTree
     */
    delete(key: K): boolean;
    /**
     * AVL 树插入结点后调整动作
     * 自底向上调整结点的高度
     * 遇到离 current 最近的不平衡点需要做旋转调整
     * 注意: 对最近的不平衡点调整后 或者 结点的高度值没有变化时
     * 上层结点便不需要更新
     * 调整次数不大于1
     *
     * @private
     * @param {T} backtracking
     * @memberof AVLTree
     */
    private _adjustAfterInsertion;
    /**
     * AVL树删除结点后调整动作
     * 自底向上调整结点的高度
     * 遇到离 current 最近的不平衡点需要做旋转调整
     * 注意: 对最近的不平衡点调整后，其上层结点仍然可能需要调整
     * 调整次数可能不止一次
     *
     * @private
     * @param {T} backtracking
     * @memberof AVLTree
     */
    private _adjustAfterRemoval;
    /**
     * Adjust a left left skewed subtree
     *
     * @private
     * @param {T} node
     * @returns {T}
     * @memberof AVLTree
     */
    private _adjustLeftLeft;
    /**
     * Adjust a right right skewed subtree
     *
     * @private
     * @param {T} node
     * @returns {T}
     * @memberof AVLTree
     */
    private _adjustRightRight;
    /**
     * Adjust a left right skewed subtree
     *
     * @private
     * @param {T} node
     * @returns {T}
     * @memberof AVLTree
     */
    private _adjustLeftRight;
    /**
     * Adjust a right left skewed subtree
     *
     * @private
     * @param {T} node
     * @returns {T}
     * @memberof AVLTree
     */
    private _adjustRightLeft;
    /**
     * 检查结点是否平衡
     *
     * @private
     * @param {T} node
     * @returns {boolean}
     * @memberof AVLTree
     */
    private _isUnbalanced;
    /**
     * Rebalance subtree tmp based on balance factor & skew
     *
     * @private
     * @param {T} node
     * @returns {T}
     * @memberof AVLTree
     */
    private _rebalance;
}
