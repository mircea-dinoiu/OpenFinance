import React from 'react';
import {cyan500, red500, yellowA700} from 'material-ui/styles/colors';
import {Cached, TrendingUp, Warning} from 'material-ui-icons';
import Tooltip from 'common/components/Tooltip';
import {startCase} from 'lodash';

export const PendingReviewFlag = ({entity = ''}) => (
    <Tooltip tooltip={`${startCase(entity)} is pending review`}>
        <Warning style={{height: 20, width: 20}} color={yellowA700} />
    </Tooltip>
);

export const RecurrentFlag = ({entity = ''}) => (
    <Tooltip tooltip={`Recurrent ${entity}`}>
        <Cached style={{height: 20, width: 20}} color={cyan500} />
    </Tooltip>
);

export const GeneratedFlag = ({entity = ''}) => (
    <Tooltip tooltip={`Generated ${entity}`}>
        <TrendingUp style={{height: 20, width: 20}} color={red500} />
    </Tooltip>
);

export const Flags = ({entity, item}) => (
    <React.Fragment>
        {item.status === 'pending' && <PendingReviewFlag entity="expense" />}
        {item.repeat != null && <RecurrentFlag entity="expense" />}
        {item.persist === false && <GeneratedFlag entity="expense" />}
    </React.Fragment>
);
