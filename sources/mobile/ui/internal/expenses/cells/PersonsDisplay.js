// @flow
import * as React from 'react';
import {Avatar} from '@material-ui/core';
import {smallAvatar} from 'common/defs/styles';
import {useUser} from 'common/state';

const PersonsDisplay = ({item}) => {
    const userList = useUser().list;

    return userList.map((each) =>
        item.users[each.id] ? (
            <Avatar key={each.id} src={each.avatar} style={smallAvatar} />
        ) : null,
    );
};

export default PersonsDisplay;
