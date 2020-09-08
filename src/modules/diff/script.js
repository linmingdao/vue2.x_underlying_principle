import { h, render, patch } from './vdom/index.js';

export default {
    mounted() {
        // 虚拟节点
        let oldVnode = h(
            'ul', { id: 'wrapper', style: { background: '#eee', margin: '20px' }, key: 'oldul' },
            h('li', { key: 'A', style: { background: 'red', height: '30px', 'line-height': '40px' } }, 'A'),
            h('li', { key: 'B', style: { background: 'yellow', height: '30px', 'line-height': '40px' } }, 'B'),
            h('li', { key: 'C', style: { background: 'blue', height: '30px', 'line-height': '40px' } }, 'C'),
            h('li', { key: 'D', style: { background: 'green', height: '30px', 'line-height': '40px' } }, 'D')
        );

        // 将虚拟节点转换为真实节点
        render(oldVnode, document.querySelector('#app'));

        // 模拟视图更新
        setTimeout(() => {
            let newVnode = h(
                'ul', { id: 'wrapper', style: { background: '#ccc', margin: '20px' }, key: 'newul' },
                h('li', { key: 'G', style: { background: 'green', height: '30px', 'line-height': '40px' } }, 'G'),
                h('li', { key: 'C', style: { background: 'yellow', height: '30px', 'line-height': '40px' } }, 'C'),
                h('li', { key: 'A', style: { background: 'blue', height: '30px', 'line-height': '40px' } }, 'A'),
                h('li', { key: 'E', style: { background: 'red', height: '30px', 'line-height': '40px' } }, 'E'),
                h('li', { key: 'F', style: { background: 'gray', height: '30px', 'line-height': '40px' } }, 'F')
            );

            // 更新视图
            patch(oldVnode, newVnode);
        }, 5000);
    }
};