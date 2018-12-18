import React from 'react';
import { blue, red, yellow, grey } from '@material-ui/core/colors';
import Cached from '@material-ui/icons/Cached';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Warning from '@material-ui/icons/Warning';
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
        <TrendingUp style={ICON_STYLE} nativeColor={red[500]} />
    </Tooltip>
);

export const NotesFlag = ({children}) => (
    <Tooltip tooltip={<div style={{whiteSpace: 'pre-line'}}>{children}</div>}>
        <SpeakerNotes style={ICON_STYLE} nativeColor={grey[500]} />
    </Tooltip>
);

export const Flags = ({ item }) => (
    <>
        {item.status === 'pending' && <PendingReviewFlag entity="expense" />}
        {item.repeat != null && <RecurrentFlag entity="expense" />}
        {item.notes && <NotesFlag>{item.notes}</NotesFlag>}
        {item.persist === false && <GeneratedFlag entity="expense" />}
    </>
);
