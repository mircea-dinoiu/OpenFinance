// @flow
import React, {PureComponent} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import AddIcon from 'material-ui-icons/Add';
import ViewListIcon from 'material-ui-icons/ViewList';

export default class Expenses extends PureComponent {
    state = {
        newRecord: null
    };
    props: {
        creatorComponent: any,
        listComponent: any
    };

    render() {
        const Creator = this.props.creatorComponent;
        const List = this.props.listComponent;

        return (
            <Tabs>
                <Tab icon={<AddIcon/>}>
                    <Creator {...this.props} onReceiveNewRecord={newRecord => this.setState({newRecord})}/>
                </Tab>
                <Tab icon={<ViewListIcon/>}>
                    <List {...this.props} newRecord={this.state.newRecord}/>
                </Tab>
            </Tabs>
        );
    }
}
