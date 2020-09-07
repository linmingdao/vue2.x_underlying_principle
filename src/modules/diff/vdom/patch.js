export function render(vnode, container) {
    let ele = createDomElementFromVNode(vnode);
    container.appendChild(ele);
}

function createDomElementFromVNode(vnode) {
    let { type, children, text } = vnode;
    if (type) {
        // 标签
        vnode.domElement = document.createElement(type);
    } else {
        // 文本
        vnode.domElement = document.createTextNode(text);
    }

    console.log(children);
    // if (children.length) {
    //     createDomElementFromVNode();
    // }

    return vnode.domElement;
}
