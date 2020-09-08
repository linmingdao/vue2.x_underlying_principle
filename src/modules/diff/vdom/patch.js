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
