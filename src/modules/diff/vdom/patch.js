/**
 * 渲染函数
 * @param {*} vnode 虚拟节点
 * @param {*} container 要渲染的容器
 */
export function render(vnode, container) {
    let ele = createDomElementFromVNode(vnode);
    container.appendChild(ele);
}

/**
 * 将虚拟节点转换成真实节点
 * @param {*} vnode
 */
function createDomElementFromVNode(vnode) {
    let { type, text, children } = vnode;

    if (type) {
        // 标签, 并记录虚拟节点的真实节点, 用于后续方便更新真实dom
        vnode.domElement = document.createElement(type);

        // 根据当前的虚拟节点的属性更新真实的dom属性
        updateProperties(vnode);

        // 渲染子节点
        children.forEach(child => render(child, vnode.domElement));
    } else {
        // 文本, 并记录虚拟节点的真实节点, 用于后续方便更新真实dom
        vnode.domElement = document.createTextNode(text);
    }

    return vnode.domElement;
}

/**
 * 根据当前的虚拟节点的属性更新真实的dom属性
 * @param {*} vnode
 * @param {*} oldProps
 */
function updateProperties(newVnode, oldProps = {}) {
    // 获取真实的dom元素
    let newProps = newVnode.props;
    let domElement = newVnode.domElement;

    // 如果老的里面有, 新的里面没有, 那么说明这个属性被移除
    for (let oldPropName in oldProps) {
        if (!newProps[oldPropName]) {
            delete domElement[oldPropName];
        }
    }

    // 去除被删除的style
    let newStyleObj = newProps.style || {};
    let oldStyleObj = oldProps.style || {};
    for (let propName in oldStyleObj) {
        if (!newStyleObj[propName]) {
            domElement.style[propName] = '';
        }
    }

    // 重新覆盖属性
    for (let newPropName in newProps) {
        // @click addEventListener
        if (newPropName === 'style') {
            let styleObj = newProps.style;
            for (let s in styleObj) {
                domElement.style[s] = styleObj[s];
            }
        } else {
            domElement[newPropName] = newProps[newPropName];
        }
    }
}

export function patch(oldVnode, newVnode) {
    // 类型不同直接替换
    if (oldVnode.type !== newVnode.type) {
        return oldVnode.domElement.parentNode.replaceChild(createDomElementFromVNode(newVnode), oldVnode.domElement);
    }

    // 类型不同, 文本不同
    if (oldVnode.text) {
        if (oldVnode.text === newVnode.text) return;
        return (oldVnode.domElement.textContent = newVnode.text);
    }

    // 类型一样, 并且是标签, 那么可以复用节点
    let domElement = (newVnode.domElement = oldVnode.domElement);
    updateProperties(newVnode, oldVnode.props);

    let oldChildren = oldVnode.children;
    let newChildren = newVnode.children;

    // 1. 老的有儿子, 新的有儿子
    // 2. 老的有儿子, 新的没儿子
    // 3. 新增了儿子
    if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(domElement, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
        domElement.innerHTML = '';
    } else if (newChildren.length > 0) {
        newChildren.forEach(child => {
            domElement.appendChild(createDomElementFromVNode(child));
        });
    }
}

function isSameVnode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type;
}

function keyMapByIndex(oldChildren) {
    let map = {};

    for (let i = 0; i < oldChildren.length; i++) {
        let current = oldChildren[i];
        if (current.key) {
            map[current.key] = i;
        }
    }

    return map;
}

/**
 * diff, 会对常见的 dom 操作做优化,
 * 思考用 index 当做 key 的后果, 以及没有 key 的后果
 * @param {*} parent
 * @param {*} oldChildren
 * @param {*} newChildren
 */
function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[oldStartIndex];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newStartVnode = newChildren[newStartIndex];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    let map = keyMapByIndex(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex];
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex];
        } else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode);
            parent.insertBefore(oldStartVnode.domElement, oldEndVnode.domElement.nextSibling);
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            parent.insertBefore(oldEndVnode.domElement, oldStartVnode.domElement);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else {
            // 最坏情况: 暴力比对
            // 需要先拿到新的节点, 去老的节点中比对, 如果存在就复用, 不存在就创建插入即可
            let index = map[newStartVnode.key];
            if (index === undefined) {
                // 没有则创建, 并插入到当前 old 指针的前面, old 指针不动
                parent.insertBefore(createDomElementFromVNode(newStartVnode), oldStartVnode.domElement);
            } else {
                // 有则复用, 则 old 指针向后移动, 并且 old 的位置
                let toMoveNode = oldChildren[index];
                patch(toMoveNode, newStartVnode);
                parent.insertBefore(toMoveNode.domElement, oldStartVnode.domElement);
                oldChildren[index] = undefined;
            }

            newStartVnode = newChildren[++newStartIndex];
        }
    }

    // 有剩余, 新增了子节点
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let beforeElement = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].domElement : null;
            // 如果引用节点为 null，则将指定的节点添加到指定父节点的子节点列表的末尾
            // 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
            parent.insertBefore(createDomElementFromVNode(newChildren[i]), beforeElement);
            // parent.appendChild(createDomElementFromVNode(newChildren[i]));
        }
    }

    if (oldStartIndex <= oldEndIndex) {
        // 删除了子节点
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let oldVnode = oldChildren[i];
            if (oldVnode) {
                parent.removeChild(oldVnode.domElement);
            }
        }
    }
}