// @flow

const WeightDisplay = ({ item }) => {
    if (item.weight == null) {
        return '';
    }

    if (item.weight > 1000) {
        return `${item.weight / 1000} kg`;
    }

    return `${item.weight} g`;
};

export default WeightDisplay;
