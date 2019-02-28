// @flow
import { blue } from '@material-ui/core/colors';
import IconStar from '@material-ui/icons/Star';
import IconStarBorder from '@material-ui/icons/StarBorder';
import React from 'react';
import { range } from 'lodash';
import Tooltip from 'common/components/Tooltip';

class RatingDisplay extends React.PureComponent<{
    item: {
        favorite: number,
    },
}> {
    handleClick = (rating) => (event) => {
        event.preventDefault();
        event.stopPropagation();

        const item = this.props.item;

        if (event.metaKey || event.ctrlKey) {
            this.props.updateRecords([item.id], { favorite: 0 });
        } else {
            this.props.updateRecords([item.id], { favorite: rating });
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
                        className="cursorPointer"
                    >
                        {React.createElement(
                            rating <= value ? IconStar : IconStarBorder,
                            {
                                style: {
                                    height: 20,
                                    width: 20,
                                },
                                nativeColor: blue[500],
                            },
                        )}
                    </span>
                ))}
            </Tooltip>
        );
    }
}

export default RatingDisplay;
