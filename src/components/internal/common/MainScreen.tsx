import * as React from 'react';

type TypeProps = {
    listComponent: React.ComponentType<{}>;
};

class MainScreen extends React.PureComponent<TypeProps> {
    renderList() {
        const List = this.props.listComponent;

        return <List />;
    }

    render() {
        return this.renderList();
    }
}

export default MainScreen;
