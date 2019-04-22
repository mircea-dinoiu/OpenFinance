// @flow

export const IncludeOptions = [
    {
        id: 'all',
        name: 'Everything',
    },
    {
        id: 'until-tmrw',
        name: 'Until tomorrow',
    },
    {
        id: 'ut',
        name: 'Until today',
    },
    {
        id: 'until-now',
        name: 'Until now',
    },
    {
        id: 'until-yd',
        name: 'Until yesterday',
    },
    {
        id: 'ld',
        name: '1 day before',
    },
    {
        id: 'lw',
        name: '1 week before',
    },
    {
        id: 'lm',
        name: '1 month before',
    },
    {
        id: 'ly',
        name: '1 year before',
    },
    {
        id: 'current-year',
        name: `Through ${new Date().getFullYear()}`,
    },
    {
        id: 'previous-year',
        name: `Through ${new Date().getFullYear() - 1}`,
    }
];
