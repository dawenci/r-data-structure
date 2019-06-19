const AVLTree = window.DTree.AVLTree
const RBTree = window.DTree.RedBlackTree

class Key {
  constructor(value) {
    this.value = value;
  }
  compareTo(other) {
    return other.value - this.value;
  }
}

const testDatas = []
const testDatas2 = []
const testDatas3 = []

let randomSearchOrder
let randomSearchOrder2
let randomSearchOrder3

for (let i = 0; i < 500000; i += 1) {
  let value = Math.random()
  value = Math.ceil(value * 100000000)
  testDatas.push(new Key(value))
  testDatas2.push(new Key(value))
  testDatas3.push(new Key(value))
}

randomSearchOrder = testDatas.slice()
randomSearchOrder2 = testDatas2.slice()
randomSearchOrder3 = testDatas3.slice()

randomSearchOrder.sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
randomSearchOrder2.sort((a, b) => (Math.random() > 0.5 ? 1 : -1))
randomSearchOrder3.sort((a, b) => (Math.random() > 0.5 ? 1 : -1))

const avl = new AVLTree()
const rbt = new RBTree()
const arr = []

console.log('%c==============================================', 'color:#f80')
console.time('AVL Tree total:')
console.time('AVL Tree insert')
testDatas.forEach((val) => avl.insert(val, val))
console.timeEnd('AVL Tree insert')
console.time('AVL Tree search')
const searchResult = []
randomSearchOrder.forEach((val) => {
  searchResult.push(avl.getValue(val))
})
console.timeEnd('AVL Tree search')
console.time('AVL Tree traversal')
let traversal = []
avl.forEach((value, key, tree) => traversal.push(key))
console.timeEnd('AVL Tree traversal')
console.time('AVL Tree delete')
randomSearchOrder.forEach(val => {
  avl.delete(val)
})
console.timeEnd('AVL Tree delete')
console.timeEnd('AVL Tree total:')
console.log('%c==============================================', 'color:#f80')
console.log('AVL instance:', avl)
console.log('AVL search:', searchResult)
console.log('AVL traversal:', traversal)



console.log('%c==============================================', 'color:#f80')
console.time('RB Tree total:')
console.time('RB Tree insert')
testDatas2.forEach((val) => rbt.insert(val, val))
console.timeEnd('RB Tree insert')
console.time('RB Tree search')
const searchResult2 = []
randomSearchOrder2.forEach((val) => {
  searchResult2.push(rbt.getValue(val))
})
console.timeEnd('RB Tree search')
console.time('RB Tree traversal')
let traversal2 = []
rbt.forEach((value, key, tree) => traversal2.push(key))
console.timeEnd('RB Tree traversal')
console.time('RB Tree delete')
randomSearchOrder2.forEach(val => {
  rbt.delete(val)
})
console.timeEnd('RB Tree delete')
console.timeEnd('RB Tree total:')
console.log('%c==============================================', 'color:#f80')
console.log('RB instance:', rbt)
console.log('RB search:', searchResult2)
console.log('RB traversal:', traversal2)




// console.log('%c==============================================', 'color:#f80')
// console.time('ARR total:')
// console.time('ARR insert')
// testDatas3.forEach((val) => arr.push(val))
// console.timeEnd('ARR insert')
// console.time('ARR search')
// const searchResult3 = []
// randomSearchOrder3.forEach((val) => {
//   searchResult3.push(arr.find(item => item === val))
// })
// console.timeEnd('ARR search')
// console.time('ARR traversal')
// let traversal3 = []
// arr.sort((a, b) => a.value - b.value).forEach((value, key, tree) => traversal3.push(value))
// console.timeEnd('ARR traversal')
// console.time('ARR delete')
// randomSearchOrder3.forEach(val => {
//   arr.splice(arr.indexOf(val), 1)
// })
// console.timeEnd('ARR delete')
// console.timeEnd('ARR total:')
// console.log('%c==============================================', 'color:#f80')
// console.log('ARR instance:', arr)
// console.log('ARR search:', searchResult3)
// console.log('ARR traversal:', traversal3)
