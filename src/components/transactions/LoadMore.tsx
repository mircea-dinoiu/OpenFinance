import styled from 'styled-components';
import {spacingMedium} from 'defs/styles';
import {ButtonProgress} from 'components/loaders';
import {Button} from '@material-ui/core';
import React, {ButtonHTMLAttributes} from 'react';

const LoadMoreContainer = styled.div`
    padding: 0 ${spacingMedium};
`;

export const LoadMore = ({
    loading,
    onClick,
}: {
    loading: boolean;
    onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}) => {
    return (
        <LoadMoreContainer>
            <Button
                variant="contained"
                fullWidth={true}
                style={{margin: '20px 0 60px'}}
                disabled={!!loading}
                onClick={onClick}
            >
                {loading ? <ButtonProgress /> : 'Load More'}
            </Button>
        </LoadMoreContainer>
    );
};
