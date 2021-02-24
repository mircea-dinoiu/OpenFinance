import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import {TransactionModel} from 'components/transactions/types';
import {theme} from 'defs/styles';
import {range} from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

const Star = styled.span`
    cursor: pointer;
`;

export class RatingDisplay extends React.PureComponent<{
    item: TransactionModel;
    updateRecords: (ids: number[], model: Partial<TransactionModel>) => void;
}> {
    handleClick = (rating: number) => (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const item = this.props.item;

        if (event.metaKey || event.ctrlKey) {
            this.props.updateRecords([item.id], {favorite: 0});
        } else {
            this.props.updateRecords([item.id], {favorite: rating});
        }
    };

    render() {
        const value = this.props.item.favorite;

        return (
            <span title="Hold CTRL/CMD to remove rating">
                {range(1, 6).map((rating) => (
                    <Star key={rating} onClick={this.handleClick(rating)}>
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
}
