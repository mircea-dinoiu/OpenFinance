import * as React from 'react';
import {blue, green, purple, yellow} from '@material-ui/core/colors';
import Cached from '@material-ui/icons/Cached';
import TrendingUp from '@material-ui/icons/TrendingUp';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import Warning from '@material-ui/icons/Warning';
import startCase from 'lodash/startCase';

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

export const DepositFlag = () => (
    <span title="Deposit">
        <ArrowDown style={ICON_STYLE} htmlColor={green[500]} />
    </span>
);

export const Flags = ({item, entity}) => (
    <>
        {item.status === 'pending' && <PendingReviewFlag entity={entity} />}
        {item.repeat != null && <RecurrentFlag entity={entity} />}
        {item.persist === false && <GeneratedFlag entity={entity} />}
    </>
);
