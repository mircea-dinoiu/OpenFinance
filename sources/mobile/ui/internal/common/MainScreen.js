// @flow
import React, {PureComponent} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import AddIcon from 'material-ui-icons/Add';
import ViewListIcon from 'material-ui-icons/ViewList';
import {connect} from 'react-redux';

class MainScreen extends PureComponent {
    state = {
        newRecord: null
    };
    props: {
        creatorComponent: any,
        listComponent: any
    };

    renderList() {
        const List = this.props.listComponent;

        return <List newRecord={this.state.newRecord}/>;
    }

    render() {
        if (this.props.screen.isLarge) {
            return this.renderList();
        }

        const Creator = this.props.creatorComponent;

        return (
            <Tabs>
                <Tab icon={<AddIcon/>}>
                    <Creator onReceiveNewRecord={newRecord => this.setState({newRecord})}/>
                </Tab>
                <Tab icon={<ViewListIcon/>}>
                    {this.renderList()}
                </Tab>
            </Tabs>
        );
    }
}

export default connect(({screen}) => ({screen}))(MainScreen);