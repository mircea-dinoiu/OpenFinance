import {useTheme, Popover} from '@material-ui/core';
import Cached from '@material-ui/icons/Cached';
import IconUpload from '@material-ui/icons/CloudUpload';
import IconDrafts from '@material-ui/icons/Drafts';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Warning from '@material-ui/icons/Warning';
import {TransactionModel, TransactionStatus} from 'transactions/defs';
import startCase from 'lodash/startCase';
import * as React from 'react';
import {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {styled} from '@material-ui/core/styles';
import IconNotes from '@material-ui/icons/Notes';

const IconContainer = styled('div')({
    height: '20px',
    width: '20px',
});

export const PendingReviewFlag = ({entity = 'Item'}) => {
    const theme = useTheme();

    return (
        <IconContainer title={`${startCase(entity)} is pending`}>
            <Warning htmlColor={theme.palette.warning.main} />
        </IconContainer>
    );
};

export const RecurrentFlag = ({entity = 'Item'}) => {
    const theme = useTheme();

    return (
        <IconContainer title={`Recurrent ${entity}`}>
            <Cached htmlColor={theme.palette.info.main} />
        </IconContainer>
    );
};

export const GeneratedFlag = ({entity = 'Item'}) => {
    const theme = useTheme();

    return (
        <IconContainer title={`Generated ${entity}`}>
            <TrendingUp htmlColor={theme.palette.error.main} />
        </IconContainer>
    );
};

export const DraftFlag = () => {
    const theme = useTheme();

    return (
        <IconContainer title="Draft">
            <IconDrafts htmlColor={theme.palette.primary.main} />
        </IconContainer>
    );
};

export const ImportFlag = () => (
    <IconContainer title="This transaction was imported">
        <IconUpload />
    </IconContainer>
);

export const NotesFlag = ({notes}: {notes: string}) => {
    const [anchorEl, setAnchorEl] = useState<any>(null);

    return (
        <>
            <IconContainer title="Notes">
                <IconNotes
                    style={{cursor: 'pointer'}}
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(e.currentTarget);
                    }}
                />
            </IconContainer>
            <Popover
                onClose={() => setAnchorEl(null)}
                open={!!anchorEl}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <NotesContent>
                    <ReactMarkdown linkTarget="_blank">{notes}</ReactMarkdown>
                </NotesContent>
            </Popover>
        </>
    );
};

const NotesContent = styled('div')(({theme}) => ({
    width: '300px',
    padding: theme.spacing(2),
    '& p': {
        margin: 0,
    },
    '& ul': {
        paddingLeft: theme.spacing(3),
        margin: 0,
    },
    '& a:link, a:visited': {
        color: theme.palette.warning.main,
    },
    whiteSpace: 'break-spaces',
}));

export const Flags = ({item, entity}: {item: TransactionModel; entity: string}) => (
    <>
        {item.fitid !== null && <ImportFlag />}
        {item.status === TransactionStatus.draft && <DraftFlag />}
        {item.status === TransactionStatus.pending && <PendingReviewFlag entity={entity} />}
        {item.repeat != null && <RecurrentFlag entity={entity} />}
        {item.repeat_link_id !== null && <GeneratedFlag entity={entity} />}
        {item.notes && <NotesFlag notes={item.notes} />}
    </>
);
