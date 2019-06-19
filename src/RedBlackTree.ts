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

import { Comparable } from './Comparable'
import { Node, Nil, BinarySearchTree } from './BinarySearchTree'

const RED = true
const BLACK = false
export type Color = boolean

export class RBNode<K extends Comparable<K>, V = any> extends Node<K, V> {
  /**
   * 结点颜色，新插入结点默认红色
   *
   * @type {Color}
   * @memberof RBNode
   */
  color: Color = RED

  constructor(key: K, value?: V) {
    super(key, value)
  }
}

const NilKey = { compareTo: (other) => 0 }
export class RBNilNode<K extends Comparable<K>, V = any> extends RBNode<K, V> {
  constructor() {
    super(NilKey as K, null);
    this.color = BLACK
  }
}

export class RedBlackTree<K extends Comparable<K>, V = any, T extends RBNode<K, V> = RBNode<K, V>> extends BinarySearchTree<K, V, T> {
  isRed(node: T): boolean {
    if (node == null) return false;
    return node.color == RED;
  }

  isBlack(node: T): boolean {
    if (node == null) return true;
    return node.color == BLACK;
  }

  setBlack(node: T): void {
    if (node != null) node.color = BLACK;
  }

  setRed(node: T): void {
    if (node != null) node.color = RED;
  }

  /// 获取兄弟结点
  getSibling(node: T): T {
    const parent = node.parent;
    if (parent === null) return null;
    return parent.left === node
      ? parent.right
      : parent.left;
  }

  /// 获取叔叔结点
  getUncle(node: T): T {
    if (node.parent === null) return null;
    return this.getSibling(node.parent);
  }

  /// 获取祖父结点
  getGrandparent(node: T): T {
    if (node.parent === null) return null;
    return node.parent.parent;
  }    


  /**
   * Inserts a new node with a specific key and value into the tree.
   *
   * @param {K} key
   * @param {V} [value]
   * @memberof RedBlackTree
   */

  // @override
  insert(key: K, value?: V): void {
    // 插入的结点为红色，因为插入红色结点不会破坏性质 5)，需要修复的情况只有 4)。
    const insert = new RBNode(key, value) as T;
    // 返回插入点
    const insertPoint = this.nodeInsert(insert);

    // 插入点为 null 有两种情况：
    // 1. 插入是已存在的结点，直接更新 key / value，无新结点插入，所以无需进行插入后的调整
    // 2. 插入的是 root，直接调整颜色即可
    if (insertPoint === null) {
      if (this.size === 1) {
        insert.color = BLACK;
      }
      return;
    } 

    // 因为：
    // A. 插入前是平衡的，
    // B. 插入的是红色的，因此：
    // 结合 A，B，只有 parent 为红色，才可能破坏性质 4)
    // 2. parent 是黑色的，无需调整
    if (this.isBlack(insertPoint)) {
      return;
    }

    // 其他情况（parent 为红色时），都会违背性质 4)，
    // 需要回溯 (从新插入结点开始) 调整搜索路径上的结点
    this._insertFixUp(insert, insertPoint);
  }

  /**
   * Deletes a node with a specific key from the tree.
   *
   * @param {K} key
   * @returns {boolean} 是否成功删除结点
   * @memberof RedBlackTree
   */
  // @override
  delete(key: K): boolean {
    // 搜索待删除结点
    const targetNode = this.nodeSearch(key);
    // 未找到 value 对应结点
    if (targetNode == null) return false;

    // 执行删除结点操作
    const backtracking = this.nodeErase(targetNode)

    // 删掉的是根，则现在是空树，符合所有性质，无需修复直接返回
    if (this.root === null) {
      return true;
    }

    // 被删结点
    const removed = backtracking[2] as T;

    // 删掉的结点为红色，无需调整
    // 注：被删结点为红色时，该红色结点的两个黑色孩子必定是 Nil 节点
    // 否则被删前不符合性质 5)
    if (this.isRed(removed)) {
      return true;
    }

    // 被删位置补位的结点
    const replacer = backtracking[1] as T;

    // 删掉的为黑色结点，上顶补位的子结点为红色时，
    // 则直接将该子结点染成黑色即可恢复红黑树性质
    // 注：被删的黑色结点要么只有一个红色子结点，要么有两个 Nil 子结点
    if (this.isRed(replacer)) {
      replacer.color = BLACK;
      return true;
    }

    // 最后一种情况，被删黑色结点有两个 Nil 子结点，
    // 需要进行 fix up 流程
    const nil = new RBNilNode() as T;

    const parent = backtracking[0] as T;
    // 暂时用 RBNilNode 代替 null，便于后续旋转操作
    if (replacer == parent.left) {
      this.setLeft(parent, nil);
    }
    else {
      this.setRight(parent, nil);
    }
    this._removeFixUp(nil);

    return true;
  }

  /**
   * 
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
    while (this.isRed(parent)) {
      // 祖父总是非空的（父节点为红，必定有黑色的祖父结点）
      let grandparent = parent.parent!

      // 父节点是否左侧
      let parentIsLeft = parent === grandparent.left

      // 获取叔结点，叔结点可能为红也可能为黑
      let uncle = parentIsLeft ? grandparent.right : grandparent.left as T | Nil

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
      if (this.isRed(uncle)) {
        parent.color = BLACK
        uncle.color = BLACK
        grandparent.color = RED

        // 更新游标，如果 current 已经是 root，
        // 进阶着的循环条件判断会通不过，安全退出
        // 否则正常回溯
        current = grandparent
        parent = current.parent

        continue
      }

      // 除了上面存在红色叔结点的情况，以下叔结点为黑色的情况都是需要旋转的

      // 当前结点在右侧
      let currentIsRight = current === parent.right

      // 父结点在左侧的情况
      if (parentIsLeft) {
        if (currentIsRight) {
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
        parent.color = BLACK
        grandparent.color = RED
      }
      else {
        // 父节点在右侧的情况，镜像左侧情况的处理方式即可
        /* Case 2 - right rotate at parent */
        if (!currentIsRight) {
          this.rotateRight(parent)
          current = parent
          parent = current.parent!
        }
        /* Case 3 - left rotate at gparent */
        this.rotateLeft(grandparent)
        parent.color = BLACK
        grandparent.color = RED
      }

      break
    }

    // 最后一步是染黑根结点进行兜底
    (this.root as T).color = BLACK
  }

  /**
   * 
   *
   * @private
   * @param {T} RBNil
   * @memberof RedBlackTree
   */
  private _removeFixUp(RBNil: T) {
    // 传进来的 replacer 必定为 Nil
    let current = RBNil as T
    while (current.parent !== null && current.parent !== RBNil) {
      let parent = current.parent
      let currentIsLeft = current === parent.left
      let siblingIsLeft = !currentIsLeft
      let sibling = (currentIsLeft ? parent.right : parent.left) as T

      // sibling 黑色
      if (this.isBlack(sibling)) {
        // Case 1: sibling 为黑色，且 sibling 有一个与其方向一致的红色子结点 sr OR sl
        //
        //       p?              s?
        //     /   \            / \
        //   NIL   S   --->    P  SR
        //        / \         / \ / \
        //         (sr)     NIL
        //
        // 或者对称方向
        // 旋转和着色后完成删除
        let outwardSon = siblingIsLeft ? sibling.left : sibling.right
        let inwardSon = siblingIsLeft ? sibling.right : sibling.left
        if (this.isRed(outwardSon)) {
          if (siblingIsLeft) {
            this.rotateRight(parent)
          }
          else {
            this.rotateLeft(parent)
          }

          // 将 parent 的颜色转移到 sibling
          if (this.isRed(parent)) sibling.color = RED
          else sibling.color = BLACK

          parent.color = BLACK
          outwardSon.color = BLACK
          if (current === RBNil) {
            this.replaceNode(RBNil, null)
          }
          else {
            current.color = BLACK
          }
          return
        }
        else if (this.isRed(inwardSon)) {
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
          siblingIsLeft ? this.rotateLeft(sibling) : this.rotateRight(sibling)
          inwardSon.color = BLACK
          sibling.color = RED
          continue
        }
        else {
          // Case 3
          // sibling 黑色，无红色子结点
          // Case 3.1
          // 如果此时 parent 为红色，重新着色即可完成删除
          //
          //     (p)           P
          //    /  \  --->    / \
          //  NIL  S        NIL (s)
          if (this.isRed(parent)) {
            parent.color = BLACK
            sibling.color = RED
            if (current === RBNil) {
              this.replaceNode(RBNil, null)
            }
            else {
              current.color = BLACK
            }
            return
          }
          else {
            // Case 3.2
            // 否则 parent 为黑色, 将额外的黑色存到father, 重新着色 sibling，并上移指针回溯循环
            if (current === RBNil) {
              this.replaceNode(RBNil, null)
            }
            else {
              current.color = BLACK
            }
            sibling.color = RED
            current = parent
            continue
          }
        }
      }
      else {
        // Case 4, sibling 为红色，则 parent 必为黑色。
        //      P                S
        //    /  \             /   \
        //  NIL  (s)   --->  (p)   SR
        //      /  \        /  \   / \
        //     SL  SR     NIL  SL <----- new sibling
        //                    / \
        // 或者对称
        siblingIsLeft ? this.rotateRight(parent) : this.rotateLeft(parent)
        sibling.color = BLACK
        parent.color = RED
        continue
      }
    }

    if (this.root !== null) (this.root as T).color = BLACK
  }
}
