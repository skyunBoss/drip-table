/*
 * This file is part of the drip-table project.
 * @link     : https://drip-table.jd.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2021 JD Network Technology Co., Ltd.
 */

import React from 'react';

import {
  type DripTableExtraOptions,
  type DripTableProps,
  type DripTableRecordTypeBase,
  type DripTableRecordTypeWithSubtable,
  type SchemaObject,
} from '@/types';
import { getDripTableValidatePropsKeys, validateDripTableColumnSchema, validateDripTableProp, validateDripTableRequiredProps } from '@/utils/ajv';
import DripTableBuiltInComponents from '@/components/built-in';
import { type IDripTableContext, DripTableContext } from '@/context';
import { useState, useTable } from '@/hooks';
import { type DripTableBuiltInColumnSchema } from '@/index';
import DripTableLayout from '@/layouts';

import styles from './index.module.less';

/**
 * 暴露给外部直接操作实例的接口
 */
export interface DripTableWrapperContext extends IDripTableContext {
  /**
   * 通过接口选择行
   *
   * @param selectedRowKeys 选中的行标识符数组
   */
  select: (selectedRowKeys: IDripTableContext['selectedRowKeys']) => void;
}

// 组件提供给外部的公共接口
const createTableContext = <
  RecordType extends DripTableRecordTypeWithSubtable<DripTableRecordTypeBase, NonNullable<ExtraOptions['SubtableDataSourceKey']>>,
  ExtraOptions extends Partial<DripTableExtraOptions> = never,
>(props: DripTableProps<RecordType, ExtraOptions>): DripTableWrapperContext => {
  const initialState = useTable();
  const [state, setState] = useState(initialState);

  const select = (selectedRowKeys: IDripTableContext['selectedRowKeys']) => {
    setState({ selectedRowKeys });
  };

  const handler: DripTableWrapperContext = {
    ...state,
    setTableState: setState,
    select,
    _CTX_SOURCE: 'PROVIDER', // context 来源于 drip-table-provider
  };
  return handler;
};

const DripTableWrapper: <
  RecordType extends DripTableRecordTypeWithSubtable<DripTableRecordTypeBase, NonNullable<ExtraOptions['SubtableDataSourceKey']>>,
  ExtraOptions extends Partial<DripTableExtraOptions> = never,
> (props: React.PropsWithoutRef<DripTableProps<RecordType, ExtraOptions>> & React.RefAttributes<DripTableWrapperContext>) =>
(React.ReactElement | null) = React.forwardRef((props, ref) => {
  const tableProps = React.useMemo(
    () => {
      let rtp = props;
      // 兼容旧版本数据
      if (rtp.schema?.columns?.some(c => c['ui:type'] || c['ui:props'])) {
        rtp = {
          ...rtp,
          schema: Object.assign(
            {},
            rtp.schema,
            {
              columns: rtp.schema?.columns?.map((c) => {
                const column = c as DripTableBuiltInColumnSchema;
                if ('ui:type' in column || 'ui:props' in column) {
                  const key = column.key;
                  if ('ui:type' in column) {
                    console.warn(`[DripTable] Column ${key} "ui:type" is deprecated, please use "component" instead.`);
                  }
                  if ('ui:props' in column) {
                    console.warn(`[DripTable] Column ${key} "ui:props" is deprecated, please use "options" instead.`);
                  }
                  return {
                    ...Object.fromEntries(Object.entries(column).filter(([k]) => k !== 'ui:type' && k !== 'ui:props')),
                    options: column['ui:props'] || column.options || void 0,
                    component: column['ui:type'] || column.component,
                  };
                }
                return column;
              }),
            },
          ),
        };
      }
      // 列 ajv 校验
      const ajv = rtp.ajv;
      if (ajv !== false) {
        const validateColumnSchema = (column: (typeof rtp.schema.columns)[number], path: string = 'column'): string | null => {
          let errorMessage: string | null = null;
          let schema: SchemaObject | undefined;
          const BuiltInComponent = DripTableBuiltInComponents[column.component];
          if (BuiltInComponent) {
            schema = BuiltInComponent.schema;
            if (!schema) {
              errorMessage = `Built-in component must contains a valid options ajv schema! (component: ${column.component})`;
            }
          } else {
            const [libName, componentName] = column.component.split('::');
            if (libName && componentName) {
              schema = rtp.components?.[libName]?.[componentName]?.schema;
            }
          }
          if (schema && !errorMessage) {
            const columnErrorMessage = validateDripTableColumnSchema(column, schema, ajv);
            if (columnErrorMessage) {
              errorMessage = columnErrorMessage.replace(/^column/u, path);
            } else if (column.component === 'group') {
              const items = column.options.items as (typeof column)[];
              for (const [index, item] of items.entries()) {
                const message = validateColumnSchema(item, `${path ?? ''}/options/items/${index}`);
                if (message) {
                  errorMessage = message;
                  break;
                }
              }
            }
          }
          return errorMessage;
        };
        rtp = {
          ...rtp,
          schema: Object.assign(
            {},
            rtp.schema,
            {
              columns: rtp.schema?.columns?.map((column): typeof column => {
                const errorMessage = validateColumnSchema(column);
                if (errorMessage) {
                  return {
                    key: column.key,
                    title: column.title,
                    dataIndex: column.dataIndex,
                    component: 'text',
                    options: {
                      mode: 'static',
                      static: errorMessage,
                      className: styles['jfe-drip-table-column-ajv-error'],
                    },
                  };
                }
                return column;
              }),
            },
          ),
        };
      }
      return rtp;
    },
    [props],
  );
  const context = createTableContext(tableProps);
  React.useImperativeHandle(ref, () => context);

  // 校验参数
  const errorMessage = [
    (props.ajv !== false && validateDripTableRequiredProps(props, props.ajv)) || '',
    ...getDripTableValidatePropsKeys(props, props.ajv === false ? void 0 : props.ajv)
      .map(k => React.useMemo(
        () => (props.ajv !== false && validateDripTableProp(k, props[k], props.ajv)) || '',
        [k, props[k], props.ajv],
      )),
  ]
    .filter(Boolean)
    .join('\n');
  if (errorMessage) {
    return (
      <pre className={styles['jfe-drip-table-column-ajv-error']}>
        { `Props validate failed: ${errorMessage.includes('\n') ? '\n' : ''}${errorMessage}` }
      </pre>
    );
  }

  const ConfigProvider = tableProps.driver.components.ConfigProvider;
  return (
    <ConfigProvider locale={tableProps?.driver.locale}>
      <DripTableContext.Provider {...tableProps} value={context}>
        <DripTableLayout {...tableProps} />
      </DripTableContext.Provider>
    </ConfigProvider>
  );
});

export default DripTableWrapper;
