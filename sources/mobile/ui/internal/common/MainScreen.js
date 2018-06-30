// @flow
import React, {PureComponent} from 'react';

import AddIcon from 'material-ui-icons/Add';
import {connect} from 'react-redux';
import {FloatingActionButton} from 'material-ui';

type TypeProps = {
    creatorComponent: any,
    listComponent: any,
    screen: TypeScreenQueries,
};

type TypeState = {};

class MainScreen extends PureComponent<TypeProps, TypeState> {
    state = {
        newRecord: null,
        addModalOpened: false,
    };

    renderList() {
        const List = this.props.listComponent;

        return <List newRecord={this.state.newRecord} />;
    }

    getAddButtonStyle() {
        return {
            position: this.props.screen.isLarge ? 'absolute' : 'fixed',
            bottom: this.props.screen.isLarge ? '20px' : '70px',
            right: this.props.screen.isLarge ? '30px' : '10px',
            zIndex: 1
        };
    }

    toggleAddModal = () => {
        this.setState((state) => ({
            addModalOpened: !state.addModalOpened,
        }));
    };

    render() {
        const Creator = this.props.creatorComponent;

        return (
            <React.Fragment>
                <Creator
                    onReceiveNewRecord={(newRecord) => {
                        this.setState({newRecord});
                        this.toggleAddModal();
                    }}
                    onCancel={this.toggleAddModal}
                    open={this.state.addModalOpened}
                />
                <FloatingActionButton
                    onClick={this.toggleAddModal}
                    mini={!this.props.screen.isLarge} style={this.getAddButtonStyle()}>
                    <AddIcon />
                </FloatingActionButton>
                {this.renderList()}
            </React.Fragment>
        );
    }
}

export default connect(({screen}) => ({screen}))(MainScreen);
