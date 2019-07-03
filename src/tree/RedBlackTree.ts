/*
 * 红黑树性质：
 *  1) 结点或红或黑
 *  2) 根结点为黑
 *  3) 叶子结点 (Nil) 为黑
 *  4) 红结点的左右子结点都为黑
 *  5) 根到所有叶子结点的简单路径包含同样数量的黑结点
 *
 * 性质 4 和 5  提供了 O(log n) 的复杂度保障。
 * 性质 4 暗示着路径上不存在连续的红色结点，所以，
 * 如果在所有简单路径中黑色结点数量为 B（最短路径是全黑结点），那么最长的可能路径长度为 2B（红黑交替）。
 */

import { BinarySearchTree } from './BinarySearchTree'
import { Node, Nil } from './Node'

import { setLeft, setRight } from './helpers'

const enum Color {
  Red = 1,
  Black = 0
}

export class RedBlackNode<K, V> implements Node<K, V> {
  parent: this = null
  left: this = null
  right: this = null

  constructor(public key: K, public value?: V) {}

  // 结点颜色，新插入结点默认红色
  color: Color = Color.Red
}

export class RedBlackTree<K, V, T extends RedBlackNode<K, V>> extends BinarySearchTree<K, V, T> {
  constructor(compare?: (a: K, b: K) => number) {
    super(compare)
  }

  // @override
  insert(key: K, value?: V): void {
    // 插入的结点为红色，因为插入红色结点不会破坏性质 5)，需要修复的情况只有 4)。
    const insert = new RedBlackNode<K, V>(key, value) as T
    // 返回插入点
    const insertPoint = this.nodeInsert(insert)

    // 因为：
    // A. 插入前是平衡的，
    // B. 插入的是红色的，因此：
    // 结合 A，B，只有 parent 为红色，才可能破坏性质 4)
    // 2. parent 是黑色的，无需调整
    //
    // 插入点为 null 有两种情况：
    // 1. 插入是已存在的结点，直接更新 key / value，无新结点插入，所以无需进行插入后的调整
    // 2. 插入的是 root，直接调整颜色即可
    if (insertPoint === null || insertPoint.color === Color.Black) {
      if (this.size === 1) {
        insert.color = Color.Black
      }
      return
    }

    // 其他情况（parent 为红色时），都会违背性质 4)，
    // 需要回溯 (从新插入结点开始) 调整搜索路径上的结点
    this._insertFixUp(insert, insertPoint)
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

    // 存储需要真实删除的结点的父结点
    const parent = targetNode.parent

    // 待删结点少于两颗子树时，使用子树 (或 null，没子树时) 顶替移除的结点即可
    const replacer = targetNode.left || targetNode.right
    this.replaceNode(targetNode, replacer)
    this.decreaseSize()

    // 删掉的是根，则现在是空树，符合所有性质，无需修复直接返回
    if (this.root === null) return true

    // 删掉的结点为红色，无需调整
    // 注：被删结点为红色时，该红色结点的两个黑色孩子必定是 Nil 节点
    // 否则被删前不符合性质 5)
    if (targetNode.color === Color.Red) {
      return true
    }

    // 删掉的为黑色结点，上顶补位的子结点为红色时，
    // 则直接将该子结点染成黑色即可恢复红黑树性质
    // 注：被删的黑色结点要么只有一个红色子结点，要么有两个 Nil 子结点
    if (replacer !== null && replacer.color === Color.Red) {
      replacer.color = Color.Black
      return true
    }

    // 最后一种情况，被删黑色结点有两个 Nil 子结点，
    // 需要进行 fix up 流程
    const nil = this._nil()

    // 暂时用 RBNilNode 代替 null，便于后续旋转操作
    if (replacer === parent.left) {
      setLeft(parent, nil)
    }
    else {
      setRight(parent, nil)
    }

    this._removeFixUp(nil)

    return true
  }

  /**
   * 插入后的调整
   *
   * @private
   * @param {(T | Nil)} current
   * @param {(T | Nil)} parent
   * @memberof RedBlackTree
   */
  private _insertFixUp(current: T | Nil, parent: T | Nil) {
    // 需要调整的情况必定有以下特点：
    // 1. 插入结点为红色
    // 2. 父节点为红色
    // 3. 祖父结点为黑色
    while (parent !== null && parent.color === Color.Red) {
      // 祖父总是非空的（父节点为红，必定有黑色的祖父结点）
      const grandparent = parent.parent!

      // 父节点是否左侧
      const isLeftParent = parent === grandparent.left

      // 获取叔结点，叔结点可能为红也可能为黑
      const uncle = isLeftParent ? grandparent.right : grandparent.left

      /**
       * 情况 1: 叔结点为红色，颜色翻转 (color flips) 即可：
       * 1. 父结点转成黑色
       * 2. 叔结点转成黑色
       * 3. 祖父结点转成红色
       * 
       *       G           (g)
       *      / \          / \
       *    (p) (u)  -->  P   U
       *    /            /
       *  (c)          (c)
       *
       * 但因为 g 的父结点也可能为红色，而规则 4) 不允许这种情况，所以需要回溯处理 g（此时的情况相当于插入了红色的 g）.
       */
      if (uncle !== null && uncle.color === Color.Red) {
        parent.color = Color.Black
        uncle.color = Color.Black
        grandparent.color = Color.Red

        // 更新游标，如果 current 已经是 root，
        // 进阶着的循环条件判断会通不过，安全退出
        // 否则正常回溯
        current = grandparent
        parent = current.parent

        continue
      }

      // 除了上面存在红色叔结点的情况，以下叔结点为黑色的情况都是需要旋转的

      // 当前结点在右侧
      let isCurrentRight = current === parent.right

      // 父结点在左侧的情况
      if (isLeftParent) {
        if (isCurrentRight) {
         /*
          * 情况 2: 结点的叔结点为黑色，并且当前结点为父结点的右子结点，
          * 在 parent 上做左旋操作 (left rotate at parent)。
          * 
          *      G             G             G
          *     / \           / \           / \
          *   (p)  U  -->   (c)  U  -->   (p)  U
          *    \           /              /
          *    (c)       (p)            (c)
          *
          * 该操作的结果会转换成情况 3)，需要进一步解决。
          */
          this.rotateLeft(parent)
          current = parent
          parent = current.parent!
        }

         /*
          * 情况 3: 叔结点为黑色，当前结点为左子结点，
          * 祖父结点执行右旋转 (right rotate at grandparent)
          * 然后翻转父节点、祖父结点的颜色
          * 
          * 
          *        G           (p)           P
          *       / \          / \          / \
          *     (p)  U  -->  (c)  G  -->  (c) (g)
          *     /                  \             \
          *   (c)                   U             U 
          */
        this.rotateRight(grandparent)
        parent.color = Color.Black
        grandparent.color = Color.Red
      }

      // 父节点在右侧的情况，镜像左侧情况的处理方式即可
      else {
        // Case 2 镜像
        if (!isCurrentRight) {
          this.rotateRight(parent)
          current = parent
          parent = current.parent!
        }
        // Case 3 镜像
        this.rotateLeft(grandparent)
        parent.color = Color.Black
        grandparent.color = Color.Red
      }

      break
    }

    // 最后一步是染黑根结点进行兜底
    this.root.color = Color.Black
  }

  /**
   * 删除后的调整操作
   *
   * @private
   * @param {T} nil
   * @memberof RedBlackTree
   */
  private _removeFixUp(nil: T) {
    // 传进来的参数必定为 Nil
    let current = nil
    while (current.parent !== null) {
      const parent = current.parent
      const isLeftSibling = parent.left !== current
      const sibling = isLeftSibling ? parent.left : parent.right

      // sibling 黑色
      if (sibling === null || sibling.color === Color.Black) {
        // Case 1: sibling 为黑色，且 sibling 有一个与其方向一致的红色子结点 sr OR sl
        //
        //      p?              s?
        //     /  \            / \
        //   NIL   S   --->   P  SR
        //        / \        / \ / \
        //         (sr)    NIL
        //
        // 或者对称方向
        // 旋转和着色后完成删除
        const outwardSon = isLeftSibling ? sibling.left : sibling.right
        if (outwardSon !== null && outwardSon.color === Color.Red) {
          if (isLeftSibling) this.rotateRight(parent)
          else this.rotateLeft(parent)

          // 将 parent 的颜色转移到 sibling
          sibling.color = (parent !== null) ? parent.color : Color.Black
          parent.color = Color.Black
          outwardSon.color = Color.Black

          if (current === nil) this.replaceNode(nil, null)
          else current.color = Color.Black

          return
        }

        // Case 2:
        // sibling 为黑色，且 sibling 有一个与其方向不一致的红色子结点 sr OR sl
        //
        //       p?              p?
        //     /   \            /  \
        //   NIL   S   --->   NIL  SL
        //        / \             / \
        //     (sl)                 (s)
        //
        // 或者对称方向
        // 旋转和重新着色后，变成 Case 1        
        const inwardSon = isLeftSibling ? sibling.right : sibling.left
        if (inwardSon !== null && inwardSon.color === Color.Red) {
          if (isLeftSibling) this.rotateLeft(sibling)
          else this.rotateRight(sibling)

          inwardSon.color = Color.Black
          sibling.color = Color.Red
          continue
        }

        // Case 3
        // sibling 黑色，无红色子结点
        else {
          // Case 3.1
          // 如果此时 parent 为红色，重新着色即可完成删除
          //
          //     (p)           P
          //    /  \  --->    / \
          //  NIL   S       NIL (s)
          if (parent.color === Color.Red) {
            parent.color = Color.Black
            sibling.color = Color.Red

            if (current === nil) this.replaceNode(nil, null)
            else current.color = Color.Black

            return
          }

          // Case 3.2
          // 否则 parent 为黑色, 将额外的黑色存到 father, 重新着色 sibling，并上移指针回溯循环
          if (current === nil) this.replaceNode(nil, null)
          else current.color = Color.Black

          sibling.color = Color.Red
          current = parent

          continue
        }
      }

      // sibling 红色
      else {
        // Case 4, sibling 为红色，则 parent 必为黑色。
        //      P                S
        //    /  \             /   \
        //  NIL  (s)   --->  (p)   SR
        //      /  \        /  \   / \
        //     SL  SR     NIL  SL <----- new sibling
        //                    / \
        // 或者对称
        if (isLeftSibling) this.rotateRight(parent)
        else this.rotateLeft(parent)

        sibling.color = Color.Black
        parent.color = Color.Red
        continue
      }
    }

    if (this.root !== null) this.root.color = Color.Black
  }

  // 空节点
  private _nil(): T {
    const nil = new RedBlackNode(null, null)
    nil.color = Color.Black
    return nil as T
  }
}
