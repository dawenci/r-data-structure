import Node, { Nil } from './Node';
export declare type Color = boolean;
export default class RBNode<K = any, V = any> extends Node<K, V> {
    /**
     * 结点颜色，新插入结点默认红色
     *
     * @type {Color}
     * @memberof RBNode
     */
    private _color;
    static isRed<T extends RBNode>(node: T | Nil): node is T;
    static isBlack<T extends RBNode>(node: T | Nil): boolean;
    static setBlack<T extends RBNode>(node: T | Nil): T | Nil;
    static setRed<T extends RBNode>(node: T | Nil): T | Nil;
    readonly isRed: boolean;
    readonly isBlack: boolean;
    setRed(): void;
    setBlack(): void;
}
