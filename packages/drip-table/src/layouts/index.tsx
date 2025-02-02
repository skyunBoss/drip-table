/*
 * This file is part of the drip-table project.
 * @link     : https://drip-table.jd.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2021 JD Network Technology Co., Ltd.
 */

import classnames from 'classnames';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  type DripTableExtraOptions,
  type DripTableProps,
  type DripTableRecordTypeBase,
  type DripTableRecordTypeWithSubtable,
  type DripTableTableInformation,
} from '@/types';
import ErrorBoundary from '@/components/error-boundary';
import SlotRender, { type DripTableSlotSchema } from '@/components/slot-render';
import Spin from '@/components/spin';
import { useState, useTable } from '@/hooks';

import CalendarLayout from './calendar';
import CardLayout from './card';
import TableLayout from './table';

const DripTableLayout = <
  RecordType extends DripTableRecordTypeWithSubtable<DripTableRecordTypeBase, NonNullable<ExtraOptions['SubtableDataSourceKey']>>,
  ExtraOptions extends Partial<DripTableExtraOptions> = never,
>(props: DripTableProps<RecordType, ExtraOptions>): JSX.Element => {
  const initialState = useTable();
  const [tableState, setTableState] = initialState._CTX_SOURCE === 'CONTEXT' ? useState(initialState) : [initialState, initialState.setTableState];
  const [tableUUID] = React.useState(uuidv4());
  const rootRef = React.useRef<HTMLDivElement>(null); // ProTable组件的ref

  const tableInfo = React.useMemo((): DripTableTableInformation<RecordType, ExtraOptions> => ({
    uuid: tableUUID,
    schema: props.schema,
    dataSource: props.dataSource,
    parent: props.__PARENT_INFO__,
  }), [props.schema, props.dataSource, props.__PARENT_INFO__]);

  React.useEffect(() => {
    if (props.selectedRowKeys) {
      setTableState({ selectedRowKeys: props.selectedRowKeys });
    }
  }, [props.selectedRowKeys]);

  React.useEffect(() => {
    setTableState(state => ({
      filters: Object.fromEntries(props.schema.columns.map(c => [c.dataIndex, c.defaultFilteredValue]).filter(([k, v]) => typeof k === 'string' && v)),
      displayColumnKeys: props.displayColumnKeys || props.schema.columns.filter(c => c.hidable).map(c => c.key),
    }));
  }, [props.displayColumnKeys]);

  React.useEffect(() => {
    props.componentDidMount?.(tableInfo);
    return () => {
      props.componentWillUnmount?.(tableInfo);
    };
  });

  React.useEffect(() => {
    props.componentDidUpdate?.(tableInfo);
  }, [props]);

  const header = React.useMemo<DripTableSlotSchema | null>(
    () => {
      if (props.schema.header === true) {
        return {
          elements: [
            { type: 'display-column-selector', selectorButtonType: 'primary' },
            { type: 'spacer', span: 'flex-auto' },
            { type: 'search' },
            { type: 'insert-button', showIcon: true },
          ],
        };
      }
      if (!props.schema.header || !props.schema.header.elements?.length) {
        return null;
      }
      return {
        style: props.schema.header.style,
        elements: props.schema.header.elements,
      };
    },
    [props.schema.header],
  );

  const footer = React.useMemo<DripTableSlotSchema | null>(
    () => {
      if (!props.schema.footer || !props.schema.footer.elements?.length) {
        return null;
      }
      return {
        style: props.schema.footer.style,
        elements: props.schema.footer.elements,
      };
    },
    [props.schema.footer],
  );

  const headerNode = header
    ? (
      <SlotRender
        schema={header}
        tableUUID={tableUUID}
        tableProps={props}
        tableState={tableState}
        setTableState={setTableState}
      />
    )
    : null;

  const footerNode = footer
    ? (
      <SlotRender
        schema={footer}
        tableUUID={tableUUID}
        tableProps={props}
        tableState={tableState}
        setTableState={setTableState}
      />
    )
    : null;

  useEffect(() => {
    if (tableInfo.schema.defaultTableLayout) {
      setTableState({ layout: tableInfo.schema.defaultTableLayout });
    }
  }, []);

  const layoutNode = React.useMemo(() => {
    if (tableState.layout === 'table') {
      return (
        <TableLayout
          tableUUID={tableUUID}
          tableProps={props}
          tableInfo={tableInfo}
          tableState={tableState}
          setTableState={setTableState}
          header={headerNode}
          footer={footerNode}
        />
      );
    }
    if (tableState.layout === 'card') {
      return (
        <CardLayout
          tableUUID={tableUUID}
          tableProps={props}
          tableInfo={tableInfo}
          tableState={tableState}
          setTableState={setTableState}
          header={headerNode}
        />
      );
    }
    if (tableState.layout === 'calendar') {
      return (
        <CalendarLayout
          tableUUID={tableUUID}
          tableProps={props}
          tableInfo={tableInfo}
          tableState={tableState}
          setTableState={setTableState}
          header={headerNode}
        />
      );
    }
    return null;
  }, [props, tableInfo, tableState, setTableState, headerNode, footerNode]);

  return (
    <ErrorBoundary driver={props.driver}>
      <Spin spinning={props.loading}>
        <div
          className={classnames(props.className, props.schema.className)}
          style={Object.assign({}, props.style, props.schema.style)}
          ref={rootRef}
        >
          { layoutNode }
        </div>
      </Spin>
    </ErrorBoundary>
  );
};

export default DripTableLayout;
