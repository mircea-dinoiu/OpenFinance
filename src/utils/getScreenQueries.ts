
import {TypeScreenQueries} from 'types';
import {screenQueryLarge, screenQueryMedium, screenQuerySmall} from '../defs/styles';

export default function getScreenQueries(): TypeScreenQueries {
    const isSmall = window.matchMedia(screenQuerySmall)
        .matches;
    const isMedium = window.matchMedia(
        screenQueryMedium,
    ).matches;
    const isLarge = window.matchMedia(screenQueryLarge).matches;

    return {
        isSmall,
        isMedium,
        isLarge,
    };
}
