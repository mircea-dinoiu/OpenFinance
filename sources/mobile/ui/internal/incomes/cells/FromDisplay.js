// @flow
import React from 'react';
import { Avatar } from 'material-ui';
import { connect } from 'react-redux';

const FromDisplay = ({ item, user }) => {
    const userList = user.get('list');

    return userList.map(
        (each) =>
            item.user_id === each.get('id') ? (
                <Avatar
                    key={each.get('id')}
                    src={each.get('avatar')}
                    size={20}
                    style={{ marginLeft: 5 }}
                />
            ) : null,
    );
};
const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(FromDisplay);
