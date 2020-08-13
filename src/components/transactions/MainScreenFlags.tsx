import {blue, blueGrey, grey, purple, yellow} from '@material-ui/core/colors';
import Cached from '@material-ui/icons/Cached';
import IconUpload from '@material-ui/icons/CloudUpload';
import IconDrafts from '@material-ui/icons/Drafts';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Warning from '@material-ui/icons/Warning';
import {TransactionModel} from 'components/transactions/types';
import {TransactionStatus} from 'defs';
import startCase from 'lodash/startCase';
import * as React from 'react';

const ICON_STYLE = {height: 20, width: 20};

export const PendingReviewFlag = ({entity = 'Item'}) => (
    <span title={`${startCase(entity)} is pending`}>
        <Warning style={ICON_STYLE} htmlColor={yellow.A700} />
    </span>
);

export const RecurrentFlag = ({entity = 'Item'}) => (
    <span title={`Recurrent ${entity}`}>
        <Cached style={ICON_STYLE} htmlColor={blue[500]} />
    </span>
);

export const GeneratedFlag = ({entity = 'Item'}) => (
    <span title={`Generated ${entity}`}>
        <TrendingUp style={ICON_STYLE} htmlColor={purple[500]} />
    </span>
);

export const DraftFlag = () => (
    <span title="Draft">
        <IconDrafts style={ICON_STYLE} htmlColor={blueGrey[500]} />
    </span>
);

export const ImportFlag = () => (
    <span title="This transaction was imported">
        <IconUpload style={ICON_STYLE} htmlColor={grey[900]} />
    </span>
);


export const Flags = ({
    item,
    entity,
}: {
    item: TransactionModel;
    entity: string;
}) => (
    <>
        {item.fitid !== null && <ImportFlag />}
        {item.status === TransactionStatus.draft && <DraftFlag />}
        {item.status === TransactionStatus.pending && (
            <PendingReviewFlag entity={entity} />
        )}
        {item.repeat != null && <RecurrentFlag entity={entity} />}
        {item.repeat_link_id !== null && <GeneratedFlag entity={entity} />}
    </>
);
