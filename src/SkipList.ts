class SkipNode<K, V> {
  key: K
  value: V
  nodeLevel: number

  [index: number]: SkipNode<K, V> | undefined

  constructor(key, value, nodeLevel) {
    this.key = key
    this.value = value
    this.nodeLevel = nodeLevel
  }
}

const MAX_LEVEL = 32
const PROBABILITY = 0.5

export class SkipList<K, V> {
  // 头指针
  _head: SkipNode<K, V>

  // 允许的最大层数
  _maxLevel: number

  _probability: number

  size: number

  compare: (a: K, b: K) => number

  constructor(options: any = {}) {
    let maxLevel = options.maxLevel || MAX_LEVEL
    this._probability = options.probability || PROBABILITY
    this._maxLevel = maxLevel
    this._head = new SkipNode<K, V>(null, 'HEAD', maxLevel)

    this.compare = options.compare || ((a: any, b: any) => (a - b) | 0)

    this.size = 0
  }

  insert(key: K, value: V) {
    const predecessors = this._predecessors(key)

    // undefined 则为 head
    const pred = predecessors[0] || this._head
    const next = pred[0]

    // 如果结点存在，则只刷新值
    if (next && this.compare(next.key, key) === 0) {
      next.value = value
      return
    }

    // 随机生成新结点的层数
    let nodeLevel = this._randomLevel()

    //创建新结点
    const newNode = new SkipNode<K, V>(key, value, nodeLevel)
    // connect pointers of predecessors and new node to respective successors
    let currentLevel = 0
    for (; currentLevel <= nodeLevel; currentLevel += 1) {
      const predecessor = predecessors[currentLevel] || this._head
      newNode[currentLevel] = predecessor[currentLevel]
      predecessor[currentLevel] = newNode
    }

    this.size += 1

    return true
  }

  delete(key: K) {
    const predecessors = this._predecessors(key)

    // undefined 则为 head
    const pred = predecessors[0] || this._head
    // 前驱的下个结点即为将删除的结点
    let removing = pred[0]

    // 结点不存在
    if (!removing || this.compare(removing.key, key) !== 0) {
      return false
    }

    // update pointers and delete node
    let currenLevel = 0
    for (; currenLevel <= removing.nodeLevel; currenLevel += 1) {
      const predecessor = predecessors[currenLevel] || this._head
      if (predecessor[currenLevel] !== removing) {
        // debugger
        break
      }
      predecessor[currenLevel] = removing[currenLevel]
    }

    this.size -= 1

    return true
  }

  value(key: K) {
    const compare = this.compare
    let currentLevel = this._maxLevel
    let pred = this._head
    let next
    while (currentLevel >= 0) {
      next = pred[currentLevel]
      while (next && compare(next.key, key) < 0) {
        pred = next
        next = pred[currentLevel]
      }
      currentLevel -= 1
    }
    const node = pred[0]
    return node && node.value
  }

  forEach(callback, thisArg) {
    if (!callback) return
    let node = this._head[0]
    while (node) {
      if (callback.call(thisArg, node.value, node.key, this) === false) return
      node = node[0]
    }
  }

  // 获取 key 在各层上的前驱结点
  _predecessors(key: K) {
    const compare = this.compare
    const predecessors: { [key: number]: SkipNode<K, V> } = {}

    // 从高层开始查找，在每层中：
    // 每当下个结点大于 key 时，则当前结点为该层的 key 的前驱，
    // 记录前驱后，继续查找下一层的前驱
    let currentLevel = this._maxLevel
    let node: SkipNode<K, V> = this._head
    while (currentLevel >= 0) {
      let next = node[currentLevel]
      while (next && compare(next.key, key) < 0) {
        node = next
        next = node[currentLevel]
      }

      // 以 层序号为 key 记录前驱结点，
      // 对于 head 使用 undefined 表示即可（测试更快）
      if (node !== this._head) {
        predecessors[currentLevel] = node
      }

      currentLevel -= 1
    }
    return predecessors
  }

  // Generates node levels in the range [0, maxLevel).
  _randomLevel(): number {
    const max = this._maxLevel - 1
    const probability = this._probability
    let level = 0
    // Math.random() 输出 [0, 1)
    while (level < max && Math.random() < probability) {
      level += 1
    }
    return level
  }
}
