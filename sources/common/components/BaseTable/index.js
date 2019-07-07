// @flow
import * as React from 'react';
import ReactTable from 'react-table';
import { modifiersToClassName } from 'common/utils/style';
import css from './index.pcss';

export default function BaseTable({ modifiers = {}, ...props }) {
    return (
        <ReactTable
            className={`${css.main} ${modifiersToClassName(css, modifiers)}`}
            showPagination={false}
            pageSize={props.data.length}
            {...props}
        />
    );
}
