const AVLTree = require('../dist/cjs/AVLTree').default
const RBTree = require('../dist/cjs/RedBlackTree').default
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()
const items = []
for (let i = 0; i < 10000; i += 1) {
  let item = { key: Math.random(), value: Math.random() }
  items.push(item)
}
const insertOrder = items.slice().sort(() => (Math.random() > 0.5 ? 1 : -1))
const searchOrder = items.slice().sort(() => (Math.random() > 0.5 ? 1 : -1))
const deleteOrder = items.slice().sort(() => (Math.random() > 0.5 ? 1 : -1))

function array() {
  const array = []
    // const items = []
  // Insert
  insertOrder.forEach(item => array.push(item))
  // Search
  const searchResult = []
  searchOrder.forEach(itemToSearch => {
    let len = array.length
    while (len--) {
      let item = array[len]
      if (item.key === itemToSearch.key) {
        searchResult.push(item)
      }
    }
  })
  // Traversal
  const traversal = []
  array.slice().sort((a, b) => a - b).forEach(item => {
    traversal.push(item.value)
  })
  // Delete
  deleteOrder.forEach(itemToDelete => {
    let len = array.length
    while (len--) {
      if (array[len].key === itemToDelete.key) {
        array.splice(len, 1)
      }
    }
  })
  // return { array, searchResult, traversal }
}

function avltree() {
  const tree = new AVLTree({ comparator: 'key' })
  // Insert
  insertOrder.forEach(item => tree.insert(item, item.value))
  // Search
  const searchResult = []
  searchOrder.forEach(itemToSearch => {
    searchResult.push(tree.get(itemToSearch))
  })
  // Traversal
  let traversal = []
  tree.forEach((value, key, tree) => {
    traversal.push(key)
  })
  // Delete
  deleteOrder.forEach(itemToDelete => {
    tree.delete(itemToDelete)
  })
  // return { tree, searchResult, traversal }
}

function rbtree() {
  const tree = new RBTree({ comparator: 'key' })
  // Insert
  insertOrder.forEach(item => tree.insert(item, item.value))
  // Search
  const searchResult = []
  searchOrder.forEach(itemToSearch => {
    searchResult.push(tree.get(itemToSearch))
  })
  // Traversal
  let traversal = []
  tree.forEach((value, key, tree) => {
    traversal.push(key)
  })
  // Delete
  deleteOrder.forEach(itemToDelete => {
    tree.delete(itemToDelete)
  })
  // return { tree, searchResult, traversal }
}
suite
  .add('ARRAY', array)
  .add('AVLTREE', avltree)
  .add('RBTREE', rbtree)
  .on('cycle', function(event) {
    console.log(String(event.target))
  })
  .run({ async: true })
// console.log(array())
// console.log(tree())
