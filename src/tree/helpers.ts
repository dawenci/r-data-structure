import { Node, Nil } from './Node'

/// 设置根结点
export function setRoot<T extends Node<any, any>>(tree, node: T): void {
  if (node === null) {
    tree._root = null
    return
  }
  tree._root = node
  // 如果本身在树中，则从树中脱落，成为独立的树根
  if (node.parent !== null) {
    node.parent.left === node ? (node.parent.left = null) : (node.parent.right = null)
    node.parent = null
  }
}

/**
 * 设置左子结点，同时维护 parent 关系
 */

export function setLeft<T extends Node<any, any>>(node: T, child: T): void {
  // 断开旧 left 结点
  if (node.left !== null) {
    node.left.parent = null
  }
  // 连接新结点
  if (child !== null) {
    // 从旧 parent 中断开
    if (child.parent !== null) {
      child.parent.left === child ? (child.parent.left = null) : (child.parent.right = null)
    }
    child.parent = node
  }
  node.left = child
}

/**
 * 设置右子结点，同时维护 parent 关系
 */
export function setRight<T extends Node<any, any>>(node: T, child: T): void {
  // 断开旧 right 结点
  if (node.right !== null) {
    node.right.parent = null
  }
  // 连接新结点
  if (child !== null) {
    // 从旧 parent 中断开
    if (child.parent !== null) {
      child.parent.left === child ? (child.parent.left = null) : (child.parent.right = null)
    }
    child.parent = node
  }
  node.right = child
}

/// 左旋，返回新顶点，注意旋转完毕会从原本的树上脱落
/// Performs a left rotate on this node.
///
///     p                              g
///    / \                            / \
///   c   g   -> p.rotateLeft() ->   p   u
///      / \                        / \
///     s   u                      c   s
///
/// @returns {this} The root of the sub-tree; the node where this node used to be.
export function rotateLeft<T extends Node<any, any>>(node: T): T {
  const parent = node.parent
  // 记录原本在树上的位置
  const isLeft = parent !== null && parent.left == node

  // 旋转
  const pivot = node.right
  const pivotLeft = pivot.left
  setRight(node, pivotLeft)
  setLeft(pivot, node)
  // 旋转完毕

  // 新顶点接上树上原本的位置
  if (parent !== null) {
    if (isLeft) setLeft(parent, pivot)
    else setRight(parent, pivot)
  }

  return pivot
}

/// 右旋，返回新顶点，注意旋转完毕会从原本的树上脱落
/// Performs a right rotate on this node.
///
///       g                           p
///      / \                         / \
///     p   u -> g.rotateRight() -> c   g
///    / \                             / \
///   c   s                           s   u
///
/// @returns {this} The root of the sub-tree; the node where this node used to be.
export function rotateRight<T extends Node<any, any>>(node: T): T {
  const parent = node.parent
  // 记录原本在树上的位置
  const isLeft = parent !== null && parent.left === node

  // 旋转
  const pivot = node.left
  const pivotRight = pivot.right
  setLeft(node, pivotRight)
  setRight(pivot, node)
  // 旋转完毕

  // 新顶点接上树上原本的位置
  if (parent !== null) {
    if (isLeft) setLeft(parent, pivot)
    else setRight(parent, pivot)
  }

  return pivot
}

/**
 * Gets the maximum value node, rooted in a particular node.
 *
 * @param {T} subRoot The node to search.
 * @returns {T} The node with the maximum value in the tree.
 */
export function maximumNode<T extends Node<any, any>>(subRoot: T): T {
  let current = subRoot
  while (current.right !== null) {
    current = current.right
  }
  return current
}

/**
 * Gets the minimum value node, rooted in a particular node.
 *
 * @param {T} subRoot The node to search.
 * @returns {T} The node with the minimum value in the tree.
 * @memberof BinarySearchTree
 */
export function minimumNode<T extends Node<any, any>>(subRoot: T): T {
  let current = subRoot
  while (current.left !== null) {
    current = current.left
  }
  return current
}

/**
 * 迭代
 *
 * @param {IterableIterator<T>} iterator
 * @param {(key: K, value: V) => any} iteratee
 * @returns {void}
 */
export function baseFor<T extends Node<any, any>>(
  tree,
  iterator: IterableIterator<T>,
  iteratee: (key: any, value: any) => any
): void {
  if (typeof iteratee !== 'function') return
  if (tree.root === null) return
  for (let node of iterator) {
    if (iteratee(node.key, node.value) === false) {
      break
    }
  }
}
