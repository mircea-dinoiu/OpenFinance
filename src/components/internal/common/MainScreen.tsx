import * as React from 'react';

type TypeProps = {
    listComponent: React.ComponentType<{}>;
};

export class MainScreen extends React.PureComponent<TypeProps> {
    renderList() {
        const List = this.props.listComponent;

        return <List />;
    }

    render() {
        return this.renderList();
    }
}
