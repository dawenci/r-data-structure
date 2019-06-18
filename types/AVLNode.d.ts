import Node from './Node';
export default class AVLNode<K = any, V = any> extends Node<K, V> {
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
    /**
     * 右旋，返回新顶点，注意旋转完毕会从原本的树上脱落
     * @returns {AVLNode} The root of the sub-tree; the node where this node used to be.
     * @memberof AVLNode
     */
    rotateRight(): this;
    /**
     * 左旋，返回新顶点，注意旋转完毕会从原本的树上脱落
     * @returns {AVLNode} The root of the sub-tree; the node where this node used to be.
     * @memberof AVLNode
     */
    rotateLeft(): this;
}
