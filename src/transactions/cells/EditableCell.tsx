import React, {ReactNode} from 'react';
import IconPencil from '@material-ui/icons/Create';
import {styled} from '@material-ui/core/styles';
import {TransactionForm} from 'transactions/form';
import {useTransactionsContext} from 'transactions/TransactionsContext';
import {Paper} from '@material-ui/core';

export const EditableCell = ({
    children,
    id,
    field,
}: {
    children: ReactNode;
    id: number;
    field: keyof TransactionForm;
}) => {
    const tc = useTransactionsContext();

    return (
        <EditableCellStyled>
            <div>{children}</div>

            <EditPaper
                className="edit"
                onClick={(e) => {
                    e.stopPropagation();

                    tc.setState({
                        selectedIds: [id],
                        editorAnchorEl: e.currentTarget,
                        fieldToEdit: field,
                    });
                }}
            >
                <IconPencil />
            </EditPaper>
        </EditableCellStyled>
    );
};

const EditableCellStyled = styled('div')((props) => ({
    width: '100%',
    height: '100%',
    '&:hover .edit': {
        display: 'flex',
    },
}));

const EditPaper = styled(Paper)((props) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'none',
    padding: props.theme.spacing(1),
    cursor: 'pointer',
    opacity: 0.5,

    '&:hover': {
        opacity: 1,
    },
}));
