// @ flow
import {formatNumericValue} from 'mobile/ui/formatters';

const WeightDisplay = ({item}) => {
    if (item.weight == null) {
        return '';
    }

    if (item.weight > 1000) {
        return `${formatNumericValue(item.weight / 1000)} kg`;
    }

    return `${formatNumericValue(item.weight)} g`;
};

export default WeightDisplay;
