const metaPrefix = 'financial_';

enum MetaKey {
    csrf = 'csrf-token',
}

let globalMetas: null | Partial<Record<MetaKey, string>> = null;
const getMetas = () => {
    const metas: Partial<Record<MetaKey, string>> = {};

    Array.from(document.querySelectorAll('meta')).forEach((meta) => {
        const name = meta.getAttribute('name');

        if ('string' === typeof name && name.startsWith(metaPrefix)) {
            metas[name.substr(metaPrefix.length)] = meta.getAttribute(
                'content',
            );
        }
    });

    return metas;
};
const getMeta = (name: MetaKey) => {
    if (globalMetas == null) {
        globalMetas = getMetas();
    }

    return globalMetas[name];
};

export const config = {
    get csrfToken() {
        return getMeta(MetaKey.csrf);
    },
};
