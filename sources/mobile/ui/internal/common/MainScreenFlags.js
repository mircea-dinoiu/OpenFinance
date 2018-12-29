import React from 'react';
import {
    blue,
    red,
    yellow,
    grey,
    green,
    purple,
} from '@material-ui/core/colors';
import Cached from '@material-ui/icons/Cached';
import TrendingUp from '@material-ui/icons/TrendingUp';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import Warning from '@material-ui/icons/Warning';
import IconFavorite from '@material-ui/icons/Star';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import Tooltip from 'common/components/Tooltip';
import startCase from 'lodash/startCase';

const ICON_STYLE = { height: 20, width: 20 };

export const PendingReviewFlag = ({ entity = 'Item' }) => (
    <Tooltip tooltip={`${startCase(entity)} is pending`}>
        <Warning style={ICON_STYLE} nativeColor={yellow.A700} />
    </Tooltip>
);

export const RecurrentFlag = ({ entity = 'Item' }) => (
    <Tooltip tooltip={`Recurrent ${entity}`}>
        <Cached style={ICON_STYLE} nativeColor={blue[500]} />
    </Tooltip>
);

export const GeneratedFlag = ({ entity = 'Item' }) => (
    <Tooltip tooltip={`Generated ${entity}`}>
        <TrendingUp style={ICON_STYLE} nativeColor={purple[500]} />
    </Tooltip>
);

export const DepositFlag = () => (
    <Tooltip tooltip="Deposit">
        <ArrowDown style={ICON_STYLE} nativeColor={green[500]} />
    </Tooltip>
);

export const WithdrawalFlag = () => (
    <Tooltip tooltip="Withdrawal">
        <ArrowUp style={ICON_STYLE} nativeColor={red[500]} />
    </Tooltip>
);

export const FavoriteFlag = () => (
    <Tooltip tooltip="Favorite">
        <IconFavorite style={ICON_STYLE} nativeColor={blue[500]} />
    </Tooltip>
);

export const NotesFlag = ({ children }) => (
    <Tooltip tooltip={<pre>{children}</pre>}>
        <SpeakerNotes style={ICON_STYLE} nativeColor={grey[500]} />
    </Tooltip>
);

export const Flags = ({ item, entity }) => (
    <>
        {item.favorite && <FavoriteFlag />}
        {item.type === 'deposit' ? <DepositFlag /> : <WithdrawalFlag />}
        {item.status === 'pending' && <PendingReviewFlag entity={entity} />}
        {item.repeat != null && <RecurrentFlag entity={entity} />}
        {item.notes && <NotesFlag>{item.notes}</NotesFlag>}
        {item.persist === false && <GeneratedFlag entity={entity} />}
    </>
);
