// @flow weak

export default function getScreenQueries(): TypeScreenQueries {
    const isSmall = window.matchMedia('(min-width: 0px) and (max-width: 480px)')
        .matches;
    const isMedium = window.matchMedia(
        '(min-width : 768px) and (max-width: 1024px)',
    ).matches;
    const isLarge = window.matchMedia('(min-width: 1025px)').matches;

    return {
        isSmall,
        isMedium,
        isLarge,
    };
}
