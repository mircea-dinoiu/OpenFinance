// @flow
import React, { PureComponent } from 'react';

type TypeProps = {
    creatorComponent: any,
    listComponent: any,
};

class MainScreen extends PureComponent<TypeProps> {
    renderList() {
        const List = this.props.listComponent;

        return <List />;
    }

    render() {
        return this.renderList();
    }
}

export default MainScreen;
