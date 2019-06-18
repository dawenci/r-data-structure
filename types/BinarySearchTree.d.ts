/// <reference types="node" />
import { Comparable } from './Comparable';
export declare type Nil = null;
export declare class Node<K extends Comparable<any>, V = any> {
    key: K;
    value: V;
    /**
     * 左子结点指针
     *
     * @type {(this | Nil)}
     * @memberof Node
     */
    left: this | Nil;
    /**
     * 右子结点指针
     *
     * @type {(this | Nil)}
     * @memberof Node
     */
    right: this | Nil;
    /**
     * 父结点指针
     * 只通过设置 left、right 设定该属性
     * 避免手动维护增加复杂性
     *
     * @type {(this | Nil)}
     * @memberof Node
     */
    parent: this | Nil;
    /**
     * Creates an instance of Node.
     * @param {*} key
     * @param {*} value
     * @memberof Node
     */
    constructor(key: K, value: V);
}
export declare class BinarySearchTree<K extends Comparable<any>, V = any, T extends Node<K, V> = Node<K, V>> {
    private _root;
    private _size;
    /**
     * 获取根结点
     *
     * @type {(T | Nil)}
     * @memberof BinarySearchTree
     */
    readonly root: T | Nil;
    /**
     * 结点数量
     *
     * @readonly
     * @memberof BinarySearchTree
     */
    readonly size: number;
    /**
     * 是否叶子结点
     *
     * @readonly
     * @type {boolean}
     * @memberof Node
     */
    isLeaf(node: T): boolean;
    setLeft(node: T, child: T): void;
    setRight(node: T, child: T): void;
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
    inorderSuccessor(node: T): T | Nil;
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
    inorderPredecessor(node: T): T | Nil;
    /**
     * Gets the minimum value node, rooted in a particular node.
     *
     * @param {T} subRoot The node to search.
     * @returns {T} The node with the minimum value in the tree.
     * @memberof BinarySearchTree
     */
    minimumNode(subRoot: T): T;
    /**
     * Gets the maximum value node, rooted in a particular node.
     *
     * @param {T} subRoot The node to search.
     * @returns {T} The node with the maximum value in the tree.
     * @memberof BinarySearchTree
     */
    maximumNode(subRoot: T): T;
    setRoot(node: T): void;
    /**
     * 增加结点数量
     *
     * @memberof BinarySearchTree
     */
    increaseSize(): void;
    /**
     * 减少结点数量
     *
     * @memberof BinarySearchTree
     */
    decreaseSize(): void;
    /**
     * 清空树
     *
     * @memberof BinarySearchTree
     */
    clear(): void;
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
    static preorder<K extends Comparable<any>, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T>;
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
    static inorder<K extends Comparable<any>, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T>;
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
    static postorder<K extends Comparable<any>, V = any, T extends Node<K, V> = Node<K, V>>(root: T | Nil): IterableIterator<T>;
    /**
     * 获取根结点的前序遍历迭代器
     *
     * @returns
     * @memberof BinarySearchTree
     */
    preorder(): IterableIterator<T>;
    /**
     * 获取根结点的中序遍历迭代器
     *
     * @returns
     * @memberof BinarySearchTree
     */
    inorder(): IterableIterator<T>;
    /**
     * 获取根结点的后续遍历迭代器
     *
     * @returns
     * @memberof BinarySearchTree
     */
    postorder(): IterableIterator<T>;
    /**
     * 迭代器执行器
     *
     * @param {IterableIterator<T>} iterator
     * @param {((value: V, key: K, tree: this) => false | void)} iteratee
     * @param {*} [thisArg]
     * @returns
     * @memberof BinarySearchTree
     */
    baseFor(iterator: IterableIterator<T>, iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any): this;
    /**
     * Implement "iterable protocol"
     *
     * @memberof BinarySearchTree
     */
    [Symbol.iterator](): IterableIterator<(K | V)[]>;
    /**
     * Implement "iterator protocol"
     *
     * @memberof BinarySearchTree
     */
    keys(): IterableIterator<K>;
    /**
     * Implement "iterator protocol"
     *
     * @memberof BinarySearchTree
     */
    values(): IterableIterator<V>;
    /**
     * 获取迭代器
     *
     * @returns
     * @memberof BinarySearchTree
     */
    entries(): IterableIterator<(K | V)[]>;
    /**
     * 迭代树结点
     *
     * @param {((value: V, key: K, tree: this) => false | void)} iteratee
     * @param {*} [thisArg]
     * @returns
     * @memberof BinarySearchTree
     */
    forEach(iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any): this;
    /**
     * 迭代指定 key 开始的树结点
     *
     * @param {K} key
     * @param {((value: V, key: K, tree: this) => false | void)} iteratee
     * @param {*} [thisArg]
     * @memberof BinarySearchTree
     */
    eachSuccessor(key: K, iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any): void;
    /**
     * 迭代指定 key 开始的树结点
     *
     * @param {K} key
     * @param {((value: V, key: K, tree: this) => false | void)} iteratee
     * @param {*} [thisArg]
     * @memberof BinarySearchTree
     */
    eachPredecessor(key: K, iteratee: (value: V, key: K, tree: this) => false | void, thisArg?: any): void;
    /**
     * 返回最小 key 对应的结点值
     *
     * @returns {V}
     * @memberof BinarySearchTree
     */
    minimum(): {
        key: K;
        value: V;
    } | undefined;
    /**
     * 返回最大 key 对应的结点值
     *
     * @returns {V}
     * @memberof BinarySearchTree
     */
    maximum(): {
        key: K;
        value: V;
    };
    /**
     * The minimum key in the tree.
     *
     * @returns {K}
     * @memberof BinarySearchTree
     */
    minimumKey(): K;
    /**
     * The maximum key in the tree.
     *
     * @returns {K}
     * @memberof BinarySearchTree
     */
    maximumKey(): K;
    /**
     * 返回最小 key 对应的结点值
     *
     * @returns {V}
     * @memberof BinarySearchTree
     */
    minimumValue(): V;
    /**
     * 返回最大 key 对应的结点值
     *
     * @returns {V}
     * @memberof BinarySearchTree
     */
    maximumValue(): V;
    /**
     * Gets whether a node with a specific value is within the tree.
     *
     * @param {K} key The value being searched for.
     * @returns {boolean} Whether a node with the value exists.
     * @memberof BinarySearchTree
     */
    has(key: K): boolean;
    /**
     * Gets the value of a node within the tree with a specific value.
     *
     * @param {K} key The key being searched for.
     * @returns The node value or undefined if it doesn't exist.
     * @memberof BinarySearchTree
     */
    getValue(key: K): V;
    /**
     * Gets the data of a node within the tree with a specific value.
     *
     * @param {K} [key]
     * @returns {({ key: K, value: V } | null)}
     * @memberof BinarySearchTree
     */
    search(key: K): {
        key: K;
        value: V;
    } | null;
    /**
     * Inserts a new node with a specific key and value into the tree.
     *
     * @param {K} key
     * @param {V} [value]
     * @memberof BinarySearchTree
     */
    insert(key: K, value?: V): void;
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @param {K} key
     * @returns {boolean}
     * @memberof BinarySearchTree
     */
    delete(key: K): boolean;
    /**
     * 将树上某个结点替换成另一个结点
     *
     * @protected
     * @param {T} node
     * @param {(T | Nil)} replacer
     * @returns {T} 返回被替换的结点
     * @memberof BinarySearchTree
     */
    replaceNode(node: T, replacer: T | Nil): T;
    rotateLeft(node: T): T;
    rotateRight(node: T): T;
    /**
     * 搜索 Node
     *
     * @protected
     * @param {Comparator<K>} compare
     * @param {*} [key] The key being searched for.
     * @returns {(T | Nil)} The node or null if it doesn't exist.
     * @memberof BinarySearchTree
     */
    nodeSearch(key: K): T | Nil;
    /**
     * 在树里插入结点或者刷新重复结点
     * 返回新插入（或刷新）的结点
     *
     * @protected
     * @param {T} node
     * @returns {T} 返回新插入（或刷新）的结点
     * @memberof BinarySearchTree
     */
    nodeInsert(node: T): T;
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
    nodeErase(node: T): [T | Nil, T | Nil, T];
}
