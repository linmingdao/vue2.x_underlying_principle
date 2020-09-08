import { h, render, patch } from './vdom/index.js';

export default {
    mounted() {
        // 虚拟节点
        let oldVnode = h(
            'ul',
            { id: 'wrapper', style: { background: '#eee', margin: '20px' }, key: 'oldul' },
            h('li', { style: { background: 'red', height: '30px', 'line-height': '40px' } }, 'li_a'),
            h('li', { style: { background: 'yellow', height: '30px', 'line-height': '40px' } }, 'li_b'),
            h('li', { style: { background: 'blue', height: '30px', 'line-height': '40px' } }, 'li_c'),
            h('li', { style: { background: 'green', height: '30px', 'line-height': '40px' } }, 'li_d')
        );

        // 将虚拟节点转换为真实节点
        render(oldVnode, document.querySelector('#app'));

        // 模拟视图更新
        setTimeout(() => {
            let newVnode = h(
                'ul',
                { id: 'wrapper', style: { background: '#ccc', margin: '20px' }, key: 'newul' },
                h('li', { style: { background: 'red', height: '30px', 'line-height': '40px' } }, 'li_a1'),
                h('li', { style: { background: 'yellow', height: '30px', 'line-height': '40px' } }, 'li_b1'),
                h('li', { style: { background: 'blue', height: '30px', 'line-height': '40px' } }, 'li_c1'),
                h('li', { style: { background: 'green', height: '30px', 'line-height': '40px' } }, 'li_d1'),
                h('li', { style: { background: 'pink', height: '30px', 'line-height': '40px' } }, 'li_e')
            );

            // 更新视图
            patch(oldVnode, newVnode);
        }, 5000);
    }
};
