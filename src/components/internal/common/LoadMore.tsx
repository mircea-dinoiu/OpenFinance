import styled from 'styled-components';
import {spacingMedium} from 'defs/styles';
import {ButtonProgress} from '../../loaders';
import {Button} from '@material-ui/core';
import React from 'react';

const LoadMoreContainer = styled.div`
    padding: 0 ${spacingMedium};
`;

export const LoadMore = ({loading, onClick}) => {
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
