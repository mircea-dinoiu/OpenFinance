// @flow

export default function getScreenQueries(): TypeScreenQueries {
    const isSmall = window.matchMedia('(min-device-width : 320px) and (max-device-width : 480px)').matches;
    const isMedium = window.matchMedia('(min-device-width : 768px) and (max-device-width : 1024px)').matches;
    const isLarge = window.matchMedia('(min-width: 1025px)').matches;

    return {
        isSmall,
        isMedium,
        isLarge,
    };
}