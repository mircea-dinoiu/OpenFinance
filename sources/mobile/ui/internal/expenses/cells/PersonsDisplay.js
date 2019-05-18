// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { smallAvatar } from 'common/defs/styles';

const PersonsDisplay = ({ item, user }) => {
    const userList = user.get('list');

    return userList.map((each) =>
        item.users.includes(each.get('id')) ? (
            <Avatar
                key={each.get('id')}
                src={each.get('avatar')}
                style={smallAvatar}
            />
        ) : null,
    );
};
const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(PersonsDisplay);
