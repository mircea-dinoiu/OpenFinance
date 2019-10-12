import {blue} from '@material-ui/core/colors';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import * as React from 'react';
import {range} from 'lodash';
import Tooltip from 'components/Tooltip';
import styled from 'styled-components';
import {TypeTransactionModel} from 'types';

const Star = styled.span`
    cursor: pointer;
`;

class RatingDisplay extends React.PureComponent<{
    item: TypeTransactionModel;
    updateRecords: (
        ids: number[],
        model: Partial<TypeTransactionModel>,
    ) => void;
}> {
    handleClick = (rating) => (event) => {
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
            <Tooltip tooltip="Hold CTRL/CMD to remove rating">
                {range(1, 6).map((rating) => (
                    <Star key={rating} onClick={this.handleClick(rating)}>
                        {React.createElement(
                            rating <= value ? IconStar : IconStarBorder,
                            {
                                style: {
                                    height: 20,
                                    width: 20,
                                },
                                htmlColor: blue[500],
                            },
                        )}
                    </Star>
                ))}
            </Tooltip>
        );
    }
}

export default RatingDisplay;
