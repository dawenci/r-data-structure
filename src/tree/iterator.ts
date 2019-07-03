interface Node {
  parent: this | null
  left: this | null
  right: this | null
  [key: string]: any
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
export function *inorder(root: Node | null): IterableIterator<Node | null> {
  const stack: Array<Node> = []
  let current: Node | null = root
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
 * @template K
 * @template V
 * @template T
 * @param {(T | RbNil)} root
 * @returns {IterableIterator<RbNode<K, V>>}
 * @memberof BinarySearchTree
 */
export function *postorder(root: Node | null): IterableIterator<Node | null> {
  const stack: Array<Node> = []
  // 当前访问的结点
  let current: Node | null = root
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
 * 前序遍历迭代器
 *
 * @template K
 * @template V
 * @template T
 * @param {(T | RbNil)} root
 * @returns {IterableIterator<RbNode<K, V>>}
 * @memberof BinarySearchTree
 */
export function *preorder(root: Node | null): IterableIterator<Node | null> {
  const stack: Array<Node> = []
  let current: Node | null = root
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
