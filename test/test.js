const AVLTree = window.DTree.AVLTree
const RBTree = window.DTree.RedBlackTree
const testDatas = []
let randomSearchOrder
for (let i = 0; i < 1000000; i += 1) {
  let value = Math.random()
  value = Math.ceil(value * 1000000000)
  testDatas.push({value, compareTo(other) { return other.value - this.value }})
}
randomSearchOrder = testDatas.slice()
randomSearchOrder.sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
const tree = new AVLTree()
// const tree = new RBTree()
console.log('%c==============================================', 'color:#f80')
console.time('AVL Tree total:')
console.time('AVL Tree insert')
testDatas.forEach((val) => tree.insert(val, val))
console.timeEnd('AVL Tree insert')
console.time('AVL Tree search')
const searchResult = []
randomSearchOrder.forEach((val) => {
  searchResult.push(tree.getValue(val))
})
console.timeEnd('AVL Tree search')
console.time('AVL Tree traversal')
let traversal = []
tree.forEach((value, key, tree) => traversal.push(key))
console.timeEnd('AVL Tree traversal')
console.time('AVL Tree delete')
randomSearchOrder.forEach(val => {
  tree.delete(val)
})
console.timeEnd('AVL Tree delete')
console.timeEnd('AVL Tree total:')
console.log('%c==============================================', 'color:#f80')
console.log('Tree instance:', tree)
  // console.log('Tree (R) instance:', treeR)
console.log('Tree search:', searchResult)
  // console.log('Tree (R) search:', searchResultR)
console.log('Tree traversal:', traversal)
  // console.log('Tree (R) traversal:', traversalR)
