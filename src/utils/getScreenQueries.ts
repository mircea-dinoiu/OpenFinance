import {ScreenQueries} from 'types';
import {screenQueryLarge, screenQueryMedium, screenQuerySmall} from '../defs/styles';

export function getScreenQueries(): ScreenQueries {
    const isSmall = window.matchMedia(screenQuerySmall).matches;
    const isMedium = window.matchMedia(screenQueryMedium).matches;
    const isLarge = window.matchMedia(screenQueryLarge).matches;

    return {
        isSmall,
        isMedium,
        isLarge,
    };
}
