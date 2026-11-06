/* Local preview adapter for the exported Design Canvas bindings. */
(() => {
  const style = document.createElement('style');
  style.textContent = 'sc-if:not([data-ready]),sc-if[hidden]{display:none!important}sc-if,sc-for{display:contents}';
  document.head.append(style);

  class DCLogic {
    state = {};
    setState(patch) {
      this.state = { ...this.state, ...patch };
      this.update();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const source = document.querySelector('script[data-dc-script]');
    const root = document.querySelector('x-dc');
    if (!source || !root) return;
    // Only execute the component code shipped in this local export.
    const Component = new Function('DCLogic', `${source.textContent}\nreturn Component;`)(DCLogic);
    const component = new Component();
    const resolve = (scope, path) => path.trim().split('.').reduce((v, key) => v?.[key], scope);
    const exact = /^\s*{{\s*([^{}]+?)\s*}}\s*$/;
    const interpolate = (template, scope) => template.replace(/{{\s*([^{}]+?)\s*}}/g, (_, path) => String(resolve(scope, path) ?? ''));

    function bind(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const template = node.textContent;
        return template.includes('{{') ? scope => { node.textContent = interpolate(template, scope); } : () => {};
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return () => {};
      if (node.matches('script,style')) return () => {};
      if (node.matches('sc-for')) {
        const path = node.getAttribute('list').match(exact)?.[1];
        const alias = node.getAttribute('as');
        const template = [...node.childNodes].map(child => child.cloneNode(true));
        const rows = [];
        node.replaceChildren();
        return scope => {
          const items = resolve(scope, path) || [];
          while (rows.length > items.length) rows.pop().nodes.forEach(child => child.remove());
          items.forEach((item, i) => {
            if (!rows[i]) {
              const nodes = template.map(child => child.cloneNode(true));
              const updates = nodes.map(bind);
              node.append(...nodes);
              rows.push({ nodes, updates });
            }
            rows[i].updates.forEach(update => update({ ...scope, [alias]: item }));
          });
        };
      }
      const updates = [];
      for (const attr of [...node.attributes]) {
        if (!attr.value.includes('{{')) continue;
        if (/^on/i.test(attr.name)) {
          const path = attr.value.match(exact)?.[1];
          node.removeAttribute(attr.name);
          let currentScope;
          node.addEventListener(attr.name.slice(2).toLowerCase(), event => {
            const handler = resolve(currentScope, path);
            if (typeof handler === 'function') handler(event);
          });
          updates.push(scope => { currentScope = scope; });
        } else if (node.matches('sc-if') && attr.name === 'value') {
          const path = attr.value.match(exact)?.[1];
          updates.push(scope => {
            node.hidden = !resolve(scope, path);
            node.setAttribute('data-ready', '');
          });
        } else {
          updates.push(scope => node.setAttribute(attr.name, interpolate(attr.value, scope)));
        }
      }
      updates.push(...[...node.childNodes].map(bind));
      return scope => updates.forEach(update => update(scope));
    }

    const update = bind(root);
    let previous = {};
    component.update = () => {
      update(component.renderVals());
      const state = component.state;
      const phone = root.querySelector('.ask-phone input');
      const message = root.querySelector('#ask-msg');
      if (phone && phone.value !== (state.phone || '')) phone.value = state.phone || '';
      if (message && message.value !== (state.msg || '')) message.value = state.msg || '';
      if (state.open && !previous.open) root.querySelector('.chat-x')?.focus();
      if (state.open && state.sent && !previous.sent) root.querySelector('.ask-done button')?.focus();
      if (state.open && !state.sent && previous.sent) message?.focus();
      previous = { ...state };
    };
    component.update();
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && component.state.open) {
        component.setState({ open: false });
        root.querySelector('.dk-chat')?.focus();
      }
    });
    root.querySelector('.chat-x')?.addEventListener('click', () => root.querySelector('.dk-chat')?.focus());
  });
})();
