import {styled, useTheme} from '@material-ui/core/styles';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import {TransactionModel} from 'transactions/defs';
import {range} from 'lodash';
import * as React from 'react';

const Star = styled('span')({
    cursor: 'pointer',
});

export function RatingDisplay(props: {
    item: TransactionModel;
    updateRecords: (ids: number[], model: Partial<TransactionModel>) => void;
}) {
    const value = props.item.favorite;
    const theme = useTheme();

    const handleClick = (rating: number) => (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const item = props.item;

        if (event.metaKey || event.ctrlKey) {
            props.updateRecords([item.id], {favorite: 0});
        } else {
            props.updateRecords([item.id], {favorite: rating});
        }
    };

    return (
        <span title="Hold CTRL/CMD to remove rating">
            {range(1, 6).map((rating) => (
                <Star key={rating} onClick={handleClick(rating)}>
                    {React.createElement(rating <= value ? IconStar : IconStarBorder, {
                        style: {
                            height: 20,
                            width: 20,
                        },
                        htmlColor: theme.palette.primary.main,
                    })}
                </Star>
            ))}
        </span>
    );
}
