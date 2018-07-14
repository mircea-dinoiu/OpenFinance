// @flow
import React from 'react';
import { Avatar } from '@material-ui/core';
import { connect } from 'react-redux';
import {smallAvatar} from 'common/styles';

const FromDisplay = ({ item, user }) => {
    const userList = user.get('list');

    return userList.map(
        (each) =>
            item.user_id === each.get('id') ? (
                <Avatar
                    key={each.get('id')}
                    src={each.get('avatar')}
                    style={smallAvatar}
                />
            ) : null,
    );
};
const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(FromDisplay);
