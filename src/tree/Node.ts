export type Nil = null

export interface Node<K, V> {
  parent: this | Nil,
  left: this | Nil,
  right: this | Nil,
  key: K,
  value?: V,
  [other: string]: any
}
