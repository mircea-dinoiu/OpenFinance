import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, {ReactNode} from 'react';

export const DashboardAccordion = ({
    headerIcon,
    headerTitle,
    children,
}: {
    headerIcon: ReactNode;
    headerTitle: ReactNode;
    children: ReactNode;
}) => {
    return (
        <AccordionStyled defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Header>
                    {headerIcon}
                    <Typography variant="h5">{headerTitle}</Typography>
                </Header>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </AccordionStyled>
    );
};

const AccordionStyled = styled(Accordion)((props) => ({
    margin: `0 0 ${props.theme.spacing(1)}px !important`,
    maxWidth: '100vw',
    '& .MuiAccordionDetails-root': {
        flexDirection: 'column',
    },
}));

const Header = styled('div')((props) => ({
    display: 'grid',
    alignItems: 'center',
    gridGap: props.theme.spacing(1),
    gridTemplateColumns: 'auto 1fr',
    width: '100%',
}));
