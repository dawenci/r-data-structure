import { BinarySearchTree } from './BinarySearchTree'
import { Node, Nil } from './Node'

export class AvlNode<K, V> implements Node<K, V> {
  parent: this = null
  left: this = null
  right: this = null
  constructor(public key: K, public value?: V) {}

  /**
   * 记录高度
   *
   * @private
   * @type {number}
   * @memberof AVLNode
   */
  private _height: number = 0

  /**
   * 辅助属性，用来记录高度修改前的值，回溯判断用
   * 在设置 height 时，自动维护，不要手动修改
   *
   * @private
   * @type {number}
   * @memberof AVLNode
   */
  private _prevHeight: number = 0

  /**
   * 获取刷新前的高度
   *
   * @readonly
   * @type {number}
   * @memberof AVLNode
   */
  public get prevHeight(): number {
    return this._prevHeight | 0
  }

  public get height() {
    return this._height | 0
  }

  public set height(value) {
    this._prevHeight = this._height | 0
    this._height = value | 0
  }

  /**
   * 获取左子树高度
   * Convenience function to get the height of the left child of the node,
   * returning -1 if the node is null.
   *
   * @readonly
   * @type {number}
   * @memberof AVLNode
   */
  public get leftHeight(): number {
    if (this.left === null) return -1
    return this.left.height | 0
  }

  /**
   * 获取右子树高度
   * Convenience function to get the height of the right child of the node,
   * returning -1 if the node is null.
   *
   * @readonly
   * @type {number}
   * @memberof AVLNode
   */
  public get rightHeight(): number {
    if (this.right === null) return -1
    return this.right.height | 0
  }

  /**
   * 获取平衡因子
   * Gets the balanced factor of a node, indicating whether the left or right sub-trees are unbalanced.
   *
   * @readonly
   * @type {number}
   * @memberof AVLNode
   */
  public get balanceFactor(): number {
    return this.leftHeight - this.rightHeight
  }

  /**
   *
   * @returns
   * @memberof Node
   */
  public updateHeight() {
    const { leftHeight, rightHeight } = this
    const height = ((leftHeight > rightHeight ? leftHeight : rightHeight) + 1) | 0
    this.height = height
  }
}

// 平衡情况
const SLIGHTLY_UNBALANCED_RIGHT = -1
const SLIGHTLY_UNBALANCED_LEFT = 1
const UNBALANCED_RIGHT = -2
const UNBALANCED_LEFT = 2

export class Avl<K, V, T extends AvlNode<K, V>> extends BinarySearchTree<K, V, T> {
  constructor(compare?: (a: K, b: K) => number) {
    super(compare)
  }

  // @override
  rotateRight(node: T): T {
    const pivot = super.rotateRight(node)
    node.updateHeight()
    pivot.updateHeight()
    return pivot
  }

  // @override
  rotateLeft(node: T): T {
    const pivot = super.rotateLeft(node)
    node.updateHeight()
    pivot.updateHeight()
    return pivot
  }

  // @override
  insert(key: K, value?: V): void {
    const node = new AvlNode<K, V>(key, value) as T
    const insertPoint = this.nodeInsert(node)
    // 本次插入是重复结点，直接更新 key / value
    // 无新结点插入，所以无需进行插入后的调整
    if (insertPoint === null) return

    // 新增结点成功时，回溯调整搜索路径上的结点
    this._adjustAfterInsertion(insertPoint)
  }

  // @override
  delete(key: K): boolean {
    // 搜索待删除结点
    let targetNode = this.nodeSearch(key)
    // 未找到 value 对应结点
    if (targetNode === null) return false

    // 同时拥有左右子树，先转换成只有一颗子树的情况再统一处理：
    // 将待删节点的值跟前驱或者后继节点（此处使用前驱）交换 key 和 value，
    // 然后问题就变成了如何删除前驱或者后继节点，从而简化成只有一个子节点的删除情况
    if (targetNode.left !== null && targetNode.right !== null) {
      // 找到前驱结点
      const scapegoat = this.inorderPredecessor(targetNode)
      // 交换
      targetNode.key = scapegoat.key
      targetNode.value = scapegoat.value
      targetNode = scapegoat
    }

    // 需要真实删除的结点的父结点
    const parent = targetNode.parent

    // 待删结点少于两颗子树时，使用子树 (或 null，没子树时) 顶替移除的结点即可
    const child = targetNode.left || targetNode.right
    this.replaceNode(targetNode, child)
    this.decreaseSize()

    // 回溯调整搜索路径上的结点
    if (parent !== null) {
      this._adjustAfterRemoval(parent)
    }

    return true
  }

  // AVL 树插入结点后调整动作
  // 自底向上调整结点的高度
  // 遇到离 current 最近的不平衡点需要做旋转调整
  // 注意: 对最近的不平衡点调整后 或者 结点的高度值没有变化时
  // 上层结点便不需要更新
  // 调整次数不大于1
  private _adjustAfterInsertion(backtracking: T): void {
    let current: T | Nil = backtracking
    // 往上回溯，查找最近的不平衡结点
    while (current !== null) {
      // 更新高度
      current.updateHeight()

      // 插入前后，回溯途径结点的高度没有变化，则无需继续回溯调整
      if (current.height === current.prevHeight) break

      // 若找到不平衡结点，执行一次调整即可
      if (this._isUnbalanced(current)) {
        this._rebalance(current)
        // 调整过，则上层无需再调整了
        break
      }

      current = current.parent
    }
  }

  // AVL树删除结点后调整动作
  // 自底向上调整结点的高度
  // 遇到离 current 最近的不平衡点需要做旋转调整
  // 注意: 对最近的不平衡点调整后，其上层结点仍然可能需要调整
  // 调整次数可能不止一次
  private _adjustAfterRemoval(backtracking: T): void {
    let current: T | Nil = backtracking
    while (current !== null) {
      // 更新高度
      current.updateHeight()
      // 删除前后，回溯途径结点的高度没有变化，则无需继续回溯调整
      if (current.height === current.prevHeight) break

      if (this._isUnbalanced(current)) {
        this._rebalance(current)
      }

      // 与插入不同，调整过后，仍然需要继续往上回溯
      // 上层结点（若有）仍需判断是否需要调整
      current = current.parent
    }
  }

  // 调整 left left 倾斜的子树
  private _adjustLeftLeft(node: T): T {
    return this.rotateRight(node)
  }

  // 调整 right right 倾斜的子树
  private _adjustRightRight(node: T): T {
    return this.rotateLeft(node)
  }

  // 调整 left right 倾斜的子树
  private _adjustLeftRight(node: T): T {
    this.rotateLeft(node.left)
    return this.rotateRight(node)
  }

  // 调整 right left 倾斜的子树
  private _adjustRightLeft(node: T): T {
    this.rotateRight(node.right)
    return this.rotateLeft(node)
  }

  // 检查结点是否平衡
  private _isUnbalanced(node: T): boolean {
    const factor = node.balanceFactor
    return factor === UNBALANCED_RIGHT || factor === UNBALANCED_LEFT
  }

  // 调整树以重平衡
  private _rebalance(node: T): T {
    const factor = node.balanceFactor
    // Right subtree longer (node.factor: -2)
    if (factor === UNBALANCED_RIGHT) {
      let right = node.right
      // RL, node.right.factor: 1
      if (right.balanceFactor === SLIGHTLY_UNBALANCED_LEFT) {
        return this._adjustRightLeft(node)
      }
      else {
        // RR, node.right.factor: 0|-1
        // 即 right.rightHeight >= right.leftHeight
        return this._adjustRightRight(node)
      }
    }
    else if (factor === UNBALANCED_LEFT) {
      // Left subtree longer (node.factor: 2)
      let left = node.left
      // LR, node.left.factor: -1
      if (left.balanceFactor === SLIGHTLY_UNBALANCED_RIGHT) {
        return this._adjustLeftRight(node)
      }
      else {
        // LL, node.left.factor: 1 | 0
        // 即 left.leftHeight >= left.rightHeight
        return this._adjustLeftLeft(node)
      }
    }
    return node
  }
}
