// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'material-ui';

const PersonsDisplay = ({ item, user }) => {
    const userList = user.get('list');

    return userList.map(
        (each) =>
            item.users.includes(each.get('id')) ? (
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

export default connect(mapStateToProps)(PersonsDisplay);
