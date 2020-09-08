import { h, render } from './vdom/index.js';

export default {
    mounted() {
        // 虚拟节点
        let vnode = h(
            'div',
            { id: 'wrapper', style: { border: '1px solid red', height: '50px' }, a: 1, key: 'xx' },
            h('span', { style: { color: 'red' } }, 'Hello, '),
            'Vue'
        );

        // 将虚拟节点转换为真实节点
        render(vnode, document.querySelector('#app'));
    }
};
