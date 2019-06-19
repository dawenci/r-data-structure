import { Comparable } from './Comparable';

export type Nil = null

export class Node<K extends Comparable<K>, V = any> {
  /**
   * 左子结点指针
   *
   * @type {(this | Nil)}
   * @memberof Node
   */
  left: this | Nil = null

  /**
   * 右子结点指针
   *
   * @type {(this | Nil)}
   * @memberof Node
   */
  right: this | Nil = null

  /**
   * 父结点指针
   * 只通过设置 left、right 设定该属性
   * 避免手动维护增加复杂性
   *
   * @type {(this | Nil)}
   * @memberof Node
   */
  parent: this | Nil = null

  /**
   * Creates an instance of Node.
   * @param {*} key
   * @param {*} value
   * @memberof Node
   */
  constructor(public key: K, public value: V) {}
}

export class BinarySearchTree<K extends Comparable<K>, V = any, T extends Node<K, V> = Node<K, V>> {
  private _root: T | Nil = null

  private _size: number = 0

  /**
   * 获取根结点
   *
   * @type {(T | Nil)}
   * @memberof BinarySearchTree
   */
  get root(): T | Nil {
    return this._root
  }

  /**
   * 结点数量
   *
   * @readonly
   * @memberof BinarySearchTree
   */
  get size() {
    return this._size
  }

  /// 设置左子结点，同时维护 parent 关系
  setLeft(node: T, child: T) {
    // 断开旧 left 结点
    if (node.left !== null) {
      node.left.parent = null;
    }
    // 连接新结点
    if (child !== null) {
      // 从旧 parent 中断开
      if (child.parent !== null) {
        child.parent.left === child 
          ? (child.parent.left = null)
          : (child.parent.right = null);
      }
      child.parent = node;
    }
    node.left = child;
  }

  /// 设置右子结点，同时维护 parent 关系
  setRight(node: T, child: T) {
    // 断开旧 right 结点
    if (node.right !== null) {
      node.right.parent = null;
    }
    // 连接新结点
    if (child !== null) {
      // 从旧 parent 中断开
      if (child.parent !== null) {
        child.parent.left === child 
          ? (child.parent.left = null)
          : (child.parent.right = null);
      }
      child.parent = node;
    }
    node.right = child;
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
   * @memberof BinarySearchTree
   */
  inorderSuccessor(node: T): T | Nil {
    if (node === null) return null;
    // 1. 有右子树，找到右子树最小元素
    if (node.right !== null) {
      return this.minimumNode(node.right);
    }
    // 2. 没有右子树，往上搜索
    let parent = node.parent;
    while (parent != null) {
      if (node === parent.left) {
        return parent;
      }
      node = parent;
      parent = node.parent;
    }
    // 3. 搜索到根
    return null;
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
   * @memberof BinarySearchTree
   */
  inorderPredecessor(node: T): T | Nil {
    if (node == null) return null;

    // 1. 有左子树，找到左子树最大元素
    if (node.left !== null) {
      return this.maximumNode(node.left);
    }

    // 2. 没有左子树，往上搜索
    let parent = node.parent;
    while (parent != null) {
      if (node == parent.right) {
        return parent;
      }
      node = parent;
      parent = node.parent;
    }

    // 4. 搜索到根
    return null;
  }

  /**
   * Gets the minimum value node, rooted in a particular node.
   *
   * @param {T} subRoot The node to search.
   * @returns {T} The node with the minimum value in the tree.
   * @memberof BinarySearchTree
   */
  minimumNode(subRoot: T): T {
    let current: T | Nil = subRoot
    while (current.left !== null) current = current.left
    return current
  }

  /**
   * Gets the maximum value node, rooted in a particular node.
   *
   * @param {T} subRoot The node to search.
   * @returns {T} The node with the maximum value in the tree.
   * @memberof BinarySearchTree
   */
  maximumNode(subRoot: T): T {
    let current: T | Nil = subRoot
    while (current.right !== null) current = current.right
    return current
  }

  /// 设置根结点
  setRoot(node: T): void {
    if (node === null) {
      this._root = null;
      return;
    }
    this._root = node;
    // 如果本身在树中，则从树中脱落，成为独立的树根
    if (node.parent !== null) {
      node.parent.left === node 
        ? (node.parent.left = null)
        : (node.parent.right = null);
      node.parent = null;
    }
  }

  /**
   * 增加结点数量
   *
   * @memberof BinarySearchTree
   */
  increaseSize() {
    this._size += 1
  }
  /**
   * 减少结点数量
   *
   * @memberof BinarySearchTree
   */
  decreaseSize() {
    this._size -= 1
  }

  /**
   * 清空树
   *
   * @memberof BinarySearchTree
   */
  clear(): void {
    this._size = 0
    this.setRoot(null)
  }









  /**
   * 前序遍历迭代器
   *
   * @static
   * @template K
   * @template V
   * @template T
   * @param {(T | Nil)} root
   * @returns {IterableIterator<T>}
   * @memberof BinarySearchTree
   */
  static *preorder<K extends Comparable<K>, V = any, T extends Node<K, V> = Node<K, V>>(
    root: T | Nil
  ): IterableIterator<T> {
    const stack: Array<T> = []
    let current: T | Nil = root
    while (stack.length || current) {
      // 存入栈中，以后需要借助这些根结点进入右子树
      while (current) {
        yield current
        stack.push(current)
        if (!current.left) break
        current = current.left
      }
      // 当 p 为空时，说明根和左子树都遍历完了，该进入右子树了
      if (stack.length) {
        current = stack[stack.length - 1]
        stack.pop()
        current = current.right
      }
    }
  }

  /**
   * 中序遍历迭代器
   *
   * @static
   * @template K
   * @template V
   * @template T
   * @param {(T | Nil)} root
   * @returns {IterableIterator<T>}
   * @memberof BinarySearchTree
   */
  static *inorder<K  extends Comparable<K>, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T> {
    const stack: Array<T> = []
    let current: T | Nil = root
    while (stack.length || current) {
      while (current) {
        stack.push(current)
        current = current.left
      }
      if (stack.length) {
        // 指向栈顶
        current = stack[stack.length - 1]
        yield current
        stack.pop()
        current = current.right
      }
    }
  }

  /**
   * 后续遍历迭代器
   *
   * @static
   * @template K
   * @template V
   * @template T
   * @param {(T | Nil)} root
   * @returns {IterableIterator<T>}
   * @memberof BinarySearchTree
   */
  static *postorder<K extends Comparable<K>, V = any, T extends Node<K, V> = Node<K, V>>(
    root: T | Nil
  ): IterableIterator<T> {
    const stack: Array<T> = []
    // 当前访问的结点
    let current: T | Nil = root
    // 上次访问结点
    let lastVisit = null

    // 先把 node 移动到左子树最下边
    while (current) {
      stack.push(current)
      current = current.left
    }
    while (stack.length) {
      // 走到这里，node 都是空，并已经遍历到左子树底端 (看成扩充二叉树，则空，亦是某棵树的左孩子)
      current = stack[stack.length - 1]
      stack.pop()
      // 一个根结点被访问的前提是：无右子树或右子树已被访问过
      if (current.right === null || current.right === lastVisit) {
        yield current
        // 修改最近被访问的结点
        lastVisit = current
      }
      else {
        // 这里的 else 语句可换成带条件的 else if:
        // else if (node.left === lastVisit) // 若左子树刚被访问过，则需先进入右子树(根结点需再次入栈)
        // 因为：上面的条件没通过就一定是下面的条件满足。
        // 根结点再次入栈
        stack.push(current)
        // 进入右子树，且可肯定右子树一定不为空
        current = current.right
        while (current) {
          stack.push(current)
          current = current.left
        }
      }
    }
  }

  /**
   * 获取根结点的前序遍历迭代器
   *
   * @returns
   * @memberof BinarySearchTree
   */
  public preorder() {
    return BinarySearchTree.preorder(this._root)
  }

  /**
   * 获取根结点的中序遍历迭代器
   *
   * @returns
   * @memberof BinarySearchTree
   */
  public inorder() {
    return BinarySearchTree.inorder(this._root)
  }

  /**
   * 获取根结点的后续遍历迭代器
   *
   * @returns
   * @memberof BinarySearchTree
   */
  public postorder() {
    return BinarySearchTree.postorder(this._root)
  }

  /**
   * 迭代器执行器
   *
   * @param {IterableIterator<T>} iterator
   * @param {((value: V, key: K, tree: this) => false | void)} iteratee
   * @param {*} [thisArg]
   * @returns
   * @memberof BinarySearchTree
   */
  public baseFor(
    iterator: IterableIterator<T>,
    iteratee: (value: V, key: K, tree: this) => false | void,
    thisArg?: any
  ) {
    const tree = this
    if (typeof iteratee !== 'function') return
    if (tree.root === null) return
    for (let node of iterator) {
      if (iteratee.call(thisArg || tree, node.value, node.key, tree) === false) {
        break
      }
    }
    return tree
  }

  /**
   * Implement "iterable protocol"
   *
   * @memberof BinarySearchTree
   */
  *[Symbol.iterator]() {
    const iterator = this.inorder()
    for (let node of iterator) yield [ node.key, node.value ]
  }

  /**
   * Implement "iterator protocol"
   *
   * @memberof BinarySearchTree
   */
  *keys() {
    const iterator = this.inorder()
    for (let node of iterator) yield node.key
  }

  /**
   * Implement "iterator protocol"
   *
   * @memberof BinarySearchTree
   */
  *values() {
    const iterator = this.inorder()
    for (let node of iterator) yield node.value
  }

  /**
   * 获取迭代器
   *
   * @returns
   * @memberof BinarySearchTree
   */
  entries() {
    return this[Symbol.iterator]()
  }

  /**
   * 迭代树结点
   *
   * @param {((value: V, key: K, tree: this) => false | void)} iteratee
   * @param {*} [thisArg]
   * @returns
   * @memberof BinarySearchTree
   */
  forEach(iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any) {
    return this.baseFor(this.inorder(), iteratee, thisArg)
  }

  /**
   * 迭代指定 key 开始的树结点
   *
   * @param {K} key
   * @param {((value: V, key: K, tree: this) => false | void)} iteratee
   * @param {*} [thisArg]
   * @memberof BinarySearchTree
   */
  eachSuccessor(key: K, iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any) {
    let node = this.nodeSearch(key)
    while (node) {
      if (iteratee(node.value, node.key, this) === false) {
        return
      }
      node = this.inorderSuccessor(node)
    }
  }

  /**
   * 迭代指定 key 开始的树结点
   *
   * @param {K} key
   * @param {((value: V, key: K, tree: this) => false | void)} iteratee
   * @param {*} [thisArg]
   * @memberof BinarySearchTree
   */
  eachPredecessor(key: K, iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any) {
    let node = this.nodeSearch(key)
    while (node) {
      if (iteratee(node.value, node.key, this) === false) {
        return
      }
      node = this.inorderPredecessor(node)
    }
  }

  /**
   * 返回最小 key 对应的结点值
   *
   * @returns {V}
   * @memberof BinarySearchTree
   */
  minimum(): { key: K, value: V } | undefined {
    if (this._root === null) return;
    const node = this.minimumNode(this._root)
    return { key: node.key, value: node.value }
  }

  /**
   * 返回最大 key 对应的结点值
   *
   * @returns {V}
   * @memberof BinarySearchTree
   */
  maximum(): { key: K, value: V } {
    if (this._root === null) return
    const node = this.minimumNode(this._root)
    return { key: node.key, value: node.value }
  }

  /**
   * The minimum key in the tree.
   *
   * @returns {K}
   * @memberof BinarySearchTree
   */
  minimumKey(): K {
    if (this._root === null) return
    return this.minimumNode(this._root).key
  }

  /**
   * The maximum key in the tree.
   *
   * @returns {K}
   * @memberof BinarySearchTree
   */
  maximumKey(): K {
    if (this._root === null) return
    return this.maximumNode(this._root).key
  }

  /**
   * 返回最小 key 对应的结点值
   *
   * @returns {V}
   * @memberof BinarySearchTree
   */
  minimumValue(): V {
    if (this._root === null) return
    return this.minimumNode(this._root).value
  }

  /**
   * 返回最大 key 对应的结点值
   *
   * @returns {V}
   * @memberof BinarySearchTree
   */
  maximumValue(): V {
    if (this._root === null) return
    return this.maximumNode(this._root).value
  }

  /**
   * Gets whether a node with a specific value is within the tree.
   *
   * @param {K} key The value being searched for.
   * @returns {boolean} Whether a node with the value exists.
   * @memberof BinarySearchTree
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
   * @memberof BinarySearchTree
   */
  getValue(key: K) {
    if (this._root === null) return
    const node = this.nodeSearch(key)
    return node && node.value
  }

  /**
   * Gets the data of a node within the tree with a specific value.
   *
   * @param {K} [key]
   * @returns {({ key: K, value: V } | null)}
   * @memberof BinarySearchTree
   */
  search(key: K): { key: K, value: V } | null {
    if (this._root === null) return null
    const node = this.nodeSearch(key)
    return node ? { key: node.key, value: node.value } : null
  }

  /**
   * Inserts a new node with a specific key and value into the tree.
   *
   * @param {K} key
   * @param {V} [value]
   * @memberof BinarySearchTree
   */
  insert(key: K, value?: V): void {
    const node = new Node(key, value) as T
    this.nodeInsert(node)
  }

  /**
   * Deletes a node with a specific key from the tree.
   *
   * @param {K} key
   * @returns {boolean}
   * @memberof BinarySearchTree
   */
  delete(key: K): boolean {
    // 搜索待删除结点
    const targetNode = this.nodeSearch(key)
    // 未找到 value 对应结点
    if (targetNode === null) return false

    // 执行删除结点操作
    this.nodeErase(targetNode)

    return true
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
  replaceNode(node: T, replacer: T | Nil): T {
    if (node === replacer) return node

    // node 为 root 的情况
    if (node === this._root) {
      this.setRoot(replacer)
    }
    else {
      // 非 root，有父结点的情况
      const parent = node.parent as T
      if (parent.left === node) this.setLeft(parent, replacer)
      else this.setRight(parent, replacer)
    }

    return node
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
  rotateLeft(node: T): T {
    const parent = node.parent;
    // 记录原本在树上的位置
    const isLeft = parent !== null && parent.left == node;

    // 旋转
    const pivot = node.right;
    const pivotLeft = pivot.left;
    this.setRight(node, pivotLeft);
    this.setLeft(pivot, node);
    // 旋转完毕

    // 新顶点接上树上原本的位置
    if (parent !== null) {
      if (isLeft) this.setLeft(parent, pivot);
      else this.setRight(parent, pivot);
    }

    // ---
    if (node === this._root) {
      this.setRoot(pivot);
    }
    return pivot;
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
  rotateRight(node: T): T {
    const parent = node.parent;
    // 记录原本在树上的位置
    const isLeft = parent !== null && parent.left === node;    

    // 旋转
    const pivot = node.left;
    const pivotRight = pivot.right;
    this.setLeft(node, pivotRight);
    this.setRight(pivot, node);
    // 旋转完毕

    // 新顶点接上树上原本的位置
    if (parent !== null) {
      if (isLeft) this.setLeft(parent, pivot);
      else this.setRight(parent, pivot);
    }

    // ---
    if (node === this._root) {
      this.setRoot(pivot);
    }
    return pivot;
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
  nodeSearch(key: K): T | Nil {
    let current = this._root
    while (current !== null) {
      let result = current.key.compareTo(key)
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
  nodeInsert(node: T): T {
    // 空树
    if (this._root === null) {
      this.setRoot(node)
      this.increaseSize()
      return null
    }

    const key = node.key
    let current: T = this._root

    // 查找待插入的位置
    while (true) {
      const result = current.key.compareTo(key)
      if (result > 0) {
        if (current.right === null) {
          this.setRight(current, node)
          this.increaseSize();
          return current;
        }
        current = current.right
      }
      else if (result < 0) {
        if (current.left === null) {
          this.setLeft(current, node)
          this.increaseSize();
          return current;
        }
        current = current.left
      }
      else {
        // No duplicates, just update key & value
        current.key = key;
        current.value = node.value;
        return null;
      }
    }
  }

  /**
   * 从树上移除一个结点
   * 返回 [ 被删除元素的父结点, 被删除结点位置补位的结点（被删结点的子结点或 Nil）, 被删结点 ] 元组
   * 
   * 删除操作，有三种情况：
   * 1：删除结点恰好为叶子结点
   * 只需要将其父结点指向空，然后 delete 该结点即可
   * 
   * 2：删除结点恰好有一个分支
   * 将其父亲结点指向其儿子结点即可，然后delete掉它
   * 
   * 3：删除结点恰好有两个分支
   * 第一种方法：找到该结点的前驱，然后将它的值赋值给要删除的结点，最后删除这个前驱即可
   * 第二种方法：找到该结点的后继，然后将它的值赋值给要删除的结点，最后删除这个后继即可
   * 利用的是：前驱没有右子树，后继没有左子树的特性
   * 前驱：小于该结点的最大结点，前驱没有右子树 
   * 后继：大于该结点的最小结点，后继没有左子树 
   *
   * @protected
   * @param {T} node
   * @returns {([T | Nil, T | Nil, T])}
   * @memberof BinarySearchTree
   */
  nodeErase(node: T): [T | Nil, T | Nil, T] {
    // 同时拥有左右子树
    // 先转换成只有一颗子树的情况再统一处理
    if (node.left !== null && node.right !== null) {
      // OR const replacer = BinarySearchTree.inorderSuccessor(node) as Node
      const replacer = this.inorderPredecessor(node) as T

      // 使用前驱结点替换身份
      // 此时问题转换成删掉替代结点（前驱），
      // 从而简化成只有一个子结点的删除情况
      node.key = replacer.key
      node.value = replacer.value

      // 修改 node 指针
      node = replacer
    }

    // 删除点的父结点
    const parent = node.parent

    // 待删结点少于两颗子树时，使用子树 (或 null，没子树时) 顶替移除的结点即可
    const child = node.left || node.right
    this.replaceNode(node, child)
    this.decreaseSize()

    return [ parent, child, node ]
  }
}
