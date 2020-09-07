import { h, render } from './vdom/index.js';

export default {
    data() {
        return {};
    },
    mounted() {
        // 虚拟节点
        let vnode = h('div', { id: 'wrapper', a: 1, key: 'xx' }, h('span', { style: { color: 'red' } }, 'hello'), 'zf');
        console.log(vnode);

        // 将虚拟节点转换为真实节点
        render(vnode, document.querySelector('#app'));
    }
};
