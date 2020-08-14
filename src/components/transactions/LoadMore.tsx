import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {ButtonProgress} from 'components/loaders';
import {ScreenQuery, spacingLarge, spacingNormal} from 'defs/styles';
import React, {ButtonHTMLAttributes} from 'react';

export const LoadMore = ({
    loading,
    onClick,
}: {
    loading: boolean;
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}) => {
    const cls = useStyles();

    return (
        <div className={cls.root}>
            <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                disabled={!!loading}
                onClick={onClick}
            >
                {loading ? <ButtonProgress /> : 'Load More'}
            </Button>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        padding: spacingNormal,
        paddingBottom: spacingLarge,
        [ScreenQuery.LARGE]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },
});
