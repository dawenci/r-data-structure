import { Comparable } from './Comparable'

export interface Node<K extends Comparable, V> {
  parent: this,
  left: this,
  right: this,
  key: K,
  value?: V,
  [other: string]: any
}

export type Nil = null
