// @flow
import React, {PureComponent} from 'react';
import {Col} from 'react-grid-system';
import {stringify} from 'query-string';
import moment from 'moment';
import Immutable from 'immutable';

import {BigLoader, ButtonProgress} from '../../components/loaders';

import fetch, {fetchJSON} from 'common/utils/fetch';
import {CalendarWithoutTime} from 'common/defs/formats';

import {List} from 'material-ui/List';
import {RaisedButton, Subheader, Divider} from 'material-ui';

export default class MainScreenList extends PureComponent {
  props: {
    api: {
      destroy: string,
      list: string
    },
    listItemComponent: any
  };

  state = {
      firstLoad: true,
      page: 1,
      results: Immutable.List(),
      loadingMore: false
  };

  componentDidMount() {
      this.loadMore();
  }

  componentWillReceiveProps({newRecord}) {
      if (newRecord && this.state.results.filter(each => each.get('id') == newRecord.id).size === 0) {
          this.setState({
              results: this.state.results.concat(Immutable.fromJS([newRecord]))
          });
      }
  }

  loadMore = async() => {
      this.setState({
          loadingMore: true
      });

      const response = await fetch(`${this.props.api.list}?${stringify({
          end_date: moment().format('YYYY-MM-DD'),
          page: this.state.page,
          per_page: 50
      })}`);

      const json = await response.json();

      this.setState({
          page: this.state.page + 1,
          results: this.state.results.concat(Immutable.fromJS(json)),
          firstLoad: false,
          loadingMore: false
      });
  };

  getGroupedResults() {
      const results = this.state.results.sortBy(each => each.get('created_at')).reverse();

      return results.groupBy(each => moment(each.get('created_at')).format('YYYY-MM-DD')).entrySeq();
  }

  handleUpdate = (data) => {
      this.setState({
          results: this.state.results.map(each => {
              if (each.get('id') === data.id) {
                  return Immutable.fromJS(data);
              }

              return each;
          })
      })
  };

  handleDelete = async (id) => {
      await fetchJSON(this.props.api.destroy, {
          method: 'POST',
          body: {
              data: [{id: id}]
          }
      });

      // Keep the nice deleted message a bit more
      setTimeout(() => {
          this.setState({
              results: this.state.results.filter(each => each.get('id') !== id)
          });
      }, 500);
  };

  render() {
      const ListItem = this.props.listItemComponent;

      return (
          <div>
              {this.state.firstLoad ? <BigLoader/> : (
                  <div>
                      {this.getGroupedResults().map(([date, items]) => {
                          return (
                              <div key={date}>
                                  <List>
                                      <Subheader style={{textAlign: 'center'}}>{moment(date).calendar(null, CalendarWithoutTime)}</Subheader>
                                      {items.map(item => (
                                          <ListItem
                                              key={item.get('id')}
                                              item={item.toJS()}
                                              data={this.props}
                                              onDelete={this.handleDelete}
                                              onUpdate={this.handleUpdate}
                                              api={this.props.api}
                                          />
                                      )).toArray()}
                                  </List>
                                  <Divider/>
                              </div>
                          )
                      })}
                      <Col>
                          <RaisedButton
                              label={this.state.loadingMore ? <ButtonProgress/> : 'Load More'}
                              fullWidth={true}
                              onTouchTap={this.loadMore}
                              style={{margin: '20px 0 40px'}}
                              disabled={this.state.loadingMore}
                          />
                      </Col>
                  </div>
              )}
          </div>
      );
  }
}
