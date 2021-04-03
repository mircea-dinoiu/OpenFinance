import {styled} from '@material-ui/core';

export const CategoryFilterLabelText = styled('span')((props) => ({
    display: 'flex',
    alignItems: 'center',
    gridGap: props.theme.spacing(1),
}));
