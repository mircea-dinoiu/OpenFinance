// @ flow
import {blue} from '@material-ui/core/colors';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import * as React from 'react';
import {range} from 'lodash';
import Tooltip from 'common/components/Tooltip';
import {css} from 'styled-components';
import type {TypeTransactionModel} from 'common/types';

class RatingDisplay extends React.PureComponent<{
    item: TypeTransactionModel,
    updateRecords: (number[], $Shape<TypeTransactionModel>) => void,
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
                    <span
                        key={rating}
                        onClick={this.handleClick(rating)}
                        css={css`
                            cursor: pointer;
                        `}
                    >
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
                    </span>
                ))}
            </Tooltip>
        );
    }
}

export default RatingDisplay;
