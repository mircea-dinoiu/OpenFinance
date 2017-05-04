const metaPrefix = 'financial_';
let metas = null;

const getMetas = () => {
    const metas = {};

    [...document.querySelectorAll('meta')].forEach(meta => {
        const name = meta.getAttribute('name');

        if ('string' === typeof name && name.startsWith(metaPrefix)) {
            metas[name.substr(metaPrefix.length)] = meta.getAttribute('content');
        }
    });

    return metas;
};

const getMeta = (name) => {
    if (metas == null) {
        metas = getMetas();
    }
    
    return metas[name];
};

export default {
    get csrfToken() {
        return getMeta('csrf-token');
    }
}