import { Node, Nil } from './Node'
import {
  inorder,
  preorder,
  postorder,
  inorderRange
} from './iterator'

import {
  setRoot,
  setLeft,
  setRight,
  rotateLeft,
  rotateRight,
  minimumNode,
  maximumNode,
  baseFor
} from './helpers'

export abstract class BinarySearchTree<K, V, T extends Node<K, V>> {
  private _root: T | Nil = null

  private _size: number = 0

  compare: (a: K, b: K) => number

  constructor(compare?: (a: K, b: K) => number) {
    this.compare = compare || ((a: any, b: any) => (a - b) | 0)
  }

  /**
   * 获取根结点
   */
  get root(): T {
    return this._root
  }

  /**
   * 结点数量
   */
  get size(): number {
    return this._size
  }

  /**
   * 插入数据
   *
   * @param {K} key
   * @param {V} [value]
   * @memberof BinarySearchTree
   */
  abstract insert(key: K, value?: V): void

  /**
   * 移除数据
   *
   * 算法逻辑：
   * 
   * 分有三种情况，
   * 1：删除结点恰好为叶子结点
   * 只需要将其父结点指向空，然后 delete 该结点即可
   * 
   * 2：删除结点恰好有一个分支
   * 将其父亲结点指向其儿子结点即可，然后delete掉它
   * 
   * 3：删除结点恰好有两个分支
   * 第一种方法：找到该结点的前驱，然后将它的数据与要删除的结点交换，最后删除这个前驱即可
   * 第二种方法：找到该结点的后继，然后将它的数据与要删除的结点交换，最后删除这个后继即可
   * 利用的是：前驱没有右子树，后继没有左子树的特性，其中前驱为小于该结点的最大结点，
   * 前驱没有右子树，而后继为大于该结点的最小结点，后继没有左子树
   *
   * @param {K} key
   * @returns {void}
   * @memberof BinarySearchTree
   */
  abstract delete(key: K): void

  /**
   * 清空数据
   */
  clear(): void {
    this._size = 0
    setRoot(this, null)
  }

  /**
   * 获取中序遍历顺序时，node 的后继结点
   * return the next node of the given node when preforming inorder traversal
   * 
   * 1. 结点有右孩子，则在中序遍历中，node 的后继是其右子树的最左结点（右子树中最小元素）
   * 2. 往上搜索，找到第一个以左子树包含该结点的祖先结点，该祖先结点（含父结点）即为后继，分解说明：
   *   2.1 结点为其父结点的左孩子，后继为其父结点
   *   2.2 结点为其父结点的右孩子，则往上搜索，直到它们 n-1 代祖先是它第 n 代祖先的左孩子，则它的后继就是第 n 个祖先。
   * 3. 如果一直搜索到根结点，也没有找到 n-1 代祖先是它第 n 代祖先的左孩子，则该结点是整个树的中序遍历中的最后一个结点，即它没有后继。
   *
   * @param {T} node
   * @returns {(T | Nil)}
   */
  inorderSuccessor(node: T): T | Nil {
    if (node === null) return null
    // 1. 有右子树，找到右子树最小元素
    if (node.right !== null) {
      return minimumNode(node.right)
    }
    // 2. 没有右子树，往上搜索
    let parent = node.parent
    while (parent != null) {
      if (node === parent.left) {
        return parent
      }
      node = parent
      parent = node.parent
    }
    // 3. 搜索到根
    return null
  }

  /**
   * 获取中序遍历顺序时，node 的前驱结点
   * return the previous node of the given node when preforming inorder traversal
   * 
   * 1. 结点有左孩子，则在中序遍历中，node 的前驱是其左子树的最右结点（左子树中最大元素）
   * 2. 往上搜索，找到第一个以右子树包含该结点的祖先结点，该祖先结点（含父结点）即为前驱，分解说明：
   *   2.1 结点为其父结点的右孩子，后继为其父结点
   *   2.2 结点为其父结点的左孩子，则需往上搜索，直到它们 n-1 代祖先是它第 n 代祖先的右孩子，则它的后继就是第 n 个祖先。
   * 3. 如果一直搜索到根结点，也没有找到 n-1 代祖先是它第 n 代祖先的右孩子，则该结点是整个树的中序遍历中的第一个结点，即它没有前驱。
   *
   * @param {T} node
   * @returns {(T | Nil)}
   */
  inorderPredecessor(node: T): T | Nil {
    if (node == null) return null

    // 1. 有左子树，找到左子树最大元素
    if (node.left !== null) {
      return maximumNode(node.left)
    }

    // 2. 没有左子树，往上搜索
    let parent = node.parent
    while (parent != null) {
      if (node == parent.right) {
        return parent
      }
      node = parent
      parent = node.parent
    }

    // 4. 搜索到根
    return null
  }

  /**
   * 中序迭代树结点
   *
   * @param {(key: K, value: V) => any} iteratee
   * @returns {void}
   */
  inorder(iteratee: (key: K, value: V) => any) {
    return baseFor(this, inorder(this._root), iteratee)
  }

  /**
   * 中序遍历的别名方法
   */
  forEach(iteratee: (key: K, value: V) => any) {
    return baseFor(this, inorder(this._root), iteratee)
  }  

  /**
   * 前序迭代树结点
   *
   * @param {(key: K, value: V) => any} iteratee
   * @returns {void}
   */
  preorder(iteratee: (key: K, value: V) => any) {
    return baseFor(this, preorder(this._root), iteratee)
  }

  /**
   * 后序迭代树结点
   *
   * @param {(key: K, value: V) => any} iteratee
   * @returns {void}
   */
  postorder(iteratee: (key: K, value: V) => any) {
    return baseFor(this, postorder(this._root), iteratee)
  }

  /**
   * 遍历 from 、to 两个 key 之间的所有结点
   */
  inorderRange(iteratee: (key: K, value: V) => any, fromKey: K, toKey: K): void {
    return baseFor(this, inorderRange(this._root, this.compare, fromKey, toKey), iteratee)    
  }

  /**
   * Implement "iterator protocol"
   */
  *keys() {
    const iterator = inorder(this._root)
    for (let node of iterator) yield node.key
  }

  /**
   * Implement "iterator protocol"
   */
  *values() {
    const iterator = inorder(this._root)
    for (let node of iterator) yield node.value
  }

  /**
   * Implement "iterable protocol"
   */
  *[Symbol.iterator]() {
    const iterator = inorder(this._root)
    for (let node of iterator) yield [ node.key, node.value ]
  }

  /**
   * 获取迭代器
   *
   * @returns
   */
  entries() {
    return this[Symbol.iterator]()
  }

  /**
   * Gets whether a node with a specific value is within the tree.
   *
   * @param {K} key The value being searched for.
   * @returns {boolean} Whether a node with the value exists.
   */
  has(key: K): boolean {
    if (this._root === null) return false
    return !!this.nodeSearch(key)
  }

  /**
   * Gets the value of a node within the tree with a specific value.
   *
   * @param {K} key The key being searched for.
   * @returns The node value or undefined if it doesn't exist.
   */
  value(key: K) {
    if (this._root === null) return
    const node = this.nodeSearch(key)
    return node && node.value
  }

  /**
   * Gets the data of a node within the tree with a specific value.
   *
   * @param {K} [key]
   * @param {(key: K, value: V) => any} callback
   */
  search(key: K, callback: (key: K, value: V) => any): void {
    if (this._root === null) {
      callback(null, null)
      return
    }
    const node = this.nodeSearch(key)
    callback(node.key, node.value)
  }

  /**
   * 获取最小节点的 K、V 值
   *
   * @returns {V}
   */
  minimum(): { key: K; value: V } | null {
    if (this._root === null) return null
    const node = minimumNode(this._root)
    return { key: node.key, value: node.value }
  }

  /**
   * 获取最大点的 K、V 值
   *
   * @returns {V}
   */
  maximum(): { key: K; value: V } | null {
    if (this._root === null) return null
    const node = minimumNode(this._root)
    return { key: node.key, value: node.value }
  }

  /**
   * The minimum key in the tree.
   *
   * @returns {K}
   */
  minimumKey(): K {
    if (this._root === null) return
    return minimumNode(this._root).key
  }

  /**
   * The maximum key in the tree.
   *
   * @returns {K}
   */
  maximumKey(): K {
    if (this._root === null) return
    return maximumNode(this._root).key
  }

  /**
   * 返回最小 key 对应的结点值
   *
   * @returns {V}
   */
  minimumValue(): V {
    if (this._root === null) return
    return minimumNode(this._root).value
  }

  /**
   * 返回最大 key 对应的结点值
   *
   * @returns {V}
   */
  maximumValue(): V {
    if (this._root === null) return
    return maximumNode(this._root).value
  }

  /**
   * 增加结点数量
   *
   * @memberof BinarySearchTree
   */
  protected increaseSize(): void {
    this._size += 1
  }
  /**
   * 减少结点数量
   *
   * @memberof BinarySearchTree
   */
  protected decreaseSize(): void {
    this._size -= 1
  }

  /**
   * 将树上某个结点替换成另一个结点
   *
   * @protected
   * @param {T} node
   * @param {(T | Nil)} replacer
   * @returns {T} 返回被替换的结点
   * @memberof BinarySearchTree
   */
  protected replaceNode(node: T, replacer: T | Nil): T {
    if (node === replacer) return node

    // node 为 root 的情况
    if (node === this._root) {
      setRoot(this, replacer)
    }
    else {
      // 非 root，有父结点的情况
      const parent = node.parent
      if (parent.left === node) setLeft(parent, replacer)
      else setRight(parent, replacer)
    }

    return node
  }

  // 左旋，返回新顶点
  protected rotateLeft(node: T): T {
    const pivot = rotateLeft(node)
    if (node === this._root) setRoot(this, pivot)
    return pivot
  }

  // 右旋，返回新顶点
  protected rotateRight(node: T): T {
    const pivot = rotateRight(node)
    if (node === this._root) setRoot(this, pivot)
    return pivot
  }

  /**
   * 搜索 Node
   *
   * @protected
   * @param {Comparator<K>} compare
   * @param {*} [key] The key being searched for.
   * @returns {(T | Nil)} The node or null if it doesn't exist.
   * @memberof BinarySearchTree
   */
  protected nodeSearch(key: K): T | Nil {
    const compare = this.compare
    let current = this._root
    while (current !== null) {
      let result = compare(key, current.key)
      if (result === 0) return current
      if (result < 0) current = current.left
      else current = current.right
    }
    return null
  }

  /**
   * 在树里插入结点或者刷新重复结点
   * 返回新插入（或刷新）的结点
   *
   * @protected
   * @param {T} node
   * @returns {T} 返回新插入（或刷新）的结点
   * @memberof BinarySearchTree
   */
  protected nodeInsert(node: T): T {
    // 空树
    if (this._root === null) {
      setRoot(this, node)
      this.increaseSize()
      return null
    }

    const compare = this.compare
    const key = node.key
    let current: T = this._root

    // 查找待插入的位置
    while (true) {
      const result = compare(key, current.key)
      if (result > 0) {
        if (current.right === null) {
          setRight(current, node)
          this.increaseSize()
          return current
        }
        current = current.right
      }
      else if (result < 0) {
        if (current.left === null) {
          setLeft(current, node)
          this.increaseSize()
          return current
        }
        current = current.left
      }
      else {
        // No duplicates, just update key & value
        current.key = key
        current.value = node.value
        return null
      }
    }
  }
}
