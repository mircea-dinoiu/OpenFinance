import React from 'react';
import { cyan, red, yellow } from '@material-ui/core/colors';
import Cached from '@material-ui/icons/Cached';
import TrendingUp from '@material-ui/icons/TrendingUp';
import Warning from '@material-ui/icons/Warning';
import Tooltip from 'common/components/Tooltip';
import startCase from 'lodash/startCase';

export const PendingReviewFlag = ({ entity = 'Item' }) => (
    <Tooltip tooltip={`${startCase(entity)} is pending review`}>
        <Warning style={{ height: 20, width: 20 }} nativeColor={yellow.A700} />
    </Tooltip>
);

export const RecurrentFlag = ({ entity = 'Item' }) => (
    <Tooltip tooltip={`Recurrent ${entity}`}>
        <Cached style={{ height: 20, width: 20 }} nativeColor={cyan[500]} />
    </Tooltip>
);

export const GeneratedFlag = ({ entity = 'Item' }) => (
    <Tooltip tooltip={`Generated ${entity}`}>
        <TrendingUp style={{ height: 20, width: 20 }} nativeColor={red[500]} />
    </Tooltip>
);

export const Flags = ({ item }) => (
    <React.Fragment>
        {item.status === 'pending' && <PendingReviewFlag entity="expense" />}
        {item.repeat != null && <RecurrentFlag entity="expense" />}
        {item.persist === false && <GeneratedFlag entity="expense" />}
    </React.Fragment>
);
