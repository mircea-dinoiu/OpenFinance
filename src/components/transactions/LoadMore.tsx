import {Button} from '@material-ui/core';
import {ButtonProgress} from 'components/loaders';
import React, {ButtonHTMLAttributes} from 'react';

export const LoadMore = ({
    loading,
    onClick,
}: {
    loading: boolean;
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}) => {
    return (
        <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            style={{margin: '20px 0 60px'}}
            disabled={!!loading}
            onClick={onClick}
        >
            {loading ? <ButtonProgress /> : 'Load More'}
        </Button>
    );
};
