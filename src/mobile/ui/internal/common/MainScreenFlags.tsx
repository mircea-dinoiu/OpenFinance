import * as React from 'react';
import {blue, yellow, grey, green, purple} from '@material-ui/core/colors';
import Cached from '@material-ui/icons/Cached';
import TrendingUp from '@material-ui/icons/TrendingUp';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import Warning from '@material-ui/icons/Warning';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import Tooltip from 'common/components/Tooltip';
import startCase from 'lodash/startCase';

const ICON_STYLE = {height: 20, width: 20};

export const PendingReviewFlag = ({entity = 'Item'}) => (
    <Tooltip tooltip={`${startCase(entity)} is pending`}>
        <Warning style={ICON_STYLE} htmlColor={yellow.A700} />
    </Tooltip>
);

export const RecurrentFlag = ({entity = 'Item'}) => (
    <Tooltip tooltip={`Recurrent ${entity}`}>
        <Cached style={ICON_STYLE} htmlColor={blue[500]} />
    </Tooltip>
);

export const GeneratedFlag = ({entity = 'Item'}) => (
    <Tooltip tooltip={`Generated ${entity}`}>
        <TrendingUp style={ICON_STYLE} htmlColor={purple[500]} />
    </Tooltip>
);

export const DepositFlag = () => (
    <Tooltip tooltip="Deposit">
        <ArrowDown style={ICON_STYLE} htmlColor={green[500]} />
    </Tooltip>
);

export const NotesFlag = ({children}) => (
    <Tooltip tooltip={<pre>{children}</pre>}>
        <SpeakerNotes style={ICON_STYLE} htmlColor={grey[500]} />
    </Tooltip>
);

export const Flags = ({item, entity}) => (
    <>
        {item.status === 'pending' && <PendingReviewFlag entity={entity} />}
        {item.repeat != null && <RecurrentFlag entity={entity} />}
        {item.notes && <NotesFlag>{item.notes}</NotesFlag>}
        {item.persist === false && <GeneratedFlag entity={entity} />}
    </>
);
