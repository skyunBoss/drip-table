/**
 * This file is part of the drip-table project.
 * @link     : https://drip-table.jd.com/
 * @author   : helloqian12138 (johnhello12138@163.com)
 * @modifier : helloqian12138 (johnhello12138@163.com)
 * @copyright: Copyright (c) 2020 JD Network Technology Co., Ltd.
 */

import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { DripTableExtraOptions } from 'drip-table';
import React from 'react';

import { drawerWidth } from '@/utils/enum';
import { GeneratorContext } from '@/context';
import components from '@/table-components';
import { DataSourceTypeAbbr, DripTableGeneratorProps } from '@/typing';

import { getColumnItemByPath } from '../table-workstation/utils';
import ComponentConfigForm from './component-configs';
import ComponentItemConfigForm from './component-item-config';
import DataSourceEditor, { DataSourceHandler } from './datasource';
import GlobalConfigForm from './global-configs';

import styles from './index.module.less';

const AttributesLayout = <
  RecordType extends DataSourceTypeAbbr<NonNullable<ExtraOptions['SubtableDataSourceKey']>>,
  ExtraOptions extends Partial<DripTableExtraOptions> = never,
>(props: DripTableGeneratorProps<RecordType, ExtraOptions>) => {
  const body = React.useRef<HTMLDivElement>(null);
  const editor = React.useRef<DataSourceHandler>(null);
  const drawerTitleMapper = {
    datasource: '数据源配置',
    global: '全局配置',
    column: '组件配置',
    'column-item': '子组件配置',
  };

  const getAllComponentsConfigs = () => {
    let componentsToUse = components;
    if (props.customComponentPanel) {
      const customComponents = props.customComponentPanel.configs;
      componentsToUse = props.customComponentPanel.mode === 'add' ? [...components, ...customComponents] : [...customComponents];
    }
    return [...componentsToUse];
  };

  const getComponentName = (componentType: string) => {
    const columnConfig = getAllComponentsConfigs().find(schema => schema['ui:type'] === componentType);
    return columnConfig?.title || '未知组件';
  };

  return (
    <GeneratorContext.Consumer>
      { ({ drawerType, currentColumn, currentColumnPath, setState }) => {
        const isGroupColumn = currentColumn && currentColumn.component === 'group';
        return (
          <div
            className={classNames(styles['attributes-drawer'], {
              [styles['attributes-drawer-fixed']]: props.rightLayoutMode !== 'drawer' && drawerType && drawerType !== 'datasource',
            })}
            style={{
              width: drawerType ? drawerWidth[drawerType] : void 0,
              zIndex: drawerType ? void 0 : -1,
              opacity: drawerType ? 1 : 0,
            }}
          >
            <div className={styles['attributes-drawer-header']}>
              <Button icon={<CloseOutlined />} type="text" onClick={() => setState({ drawerType: void 0, currentColumn: drawerType === 'column' ? void 0 : currentColumn })} />
              <span className={styles.title}>{ drawerType ? drawerTitleMapper[drawerType] : '' }</span>
              { drawerType === 'column' ? (<span className={styles['component-title']}>{ getComponentName(currentColumn?.component || '') }</span>) : null }
              { drawerType === 'column-item'
                ? (
                  <span className={styles['component-title']}>
                    { currentColumnPath ? getComponentName(getColumnItemByPath(currentColumn, currentColumnPath)?.component) : '' }
                  </span>
                )
                : null }
              { drawerType === 'datasource' && (
                <Button onClick={() => { editor.current?.formatDataSource(); }}>格式化</Button>
              ) }
            </div>
            <div className={styles['attributes-drawer-body']} ref={body}>
              {
              drawerType === 'datasource' && (
              <DataSourceEditor
                ref={editor}
                width={(drawerWidth[drawerType] || 0)}
                height={(body.current?.offsetHeight || 0)}
              />
              )
            }
              {
              drawerType === 'global' && (
                <GlobalConfigForm
                  customAttributeComponents={props.customAttributeComponents}
                  customGlobalConfigPanel={props.customGlobalConfigPanel}
                  driver={props.driver}
                  slots={props.slots}
                  slotsSchema={props.slotsSchema}
                />
              )
            }
              {
              drawerType === 'column' && (
                <ComponentConfigForm
                  customAttributeComponents={props.customAttributeComponents}
                  customComponentPanel={props.customComponentPanel}
                  driver={props.driver}
                  dataFields={props.dataFields}
                  mockDataSource={props.mockDataSource}
                />
              )
            }
              {
              drawerType === 'column-item' && isGroupColumn && (
                <ComponentItemConfigForm
                  customAttributeComponents={props.customAttributeComponents}
                  customComponentPanel={props.customComponentPanel}
                  driver={props.driver}
                  dataFields={props.dataFields}
                  mockDataSource={props.mockDataSource}
                />
              )
            }
            </div>
          </div>
        );
      } }
    </GeneratorContext.Consumer>
  );
};

export default AttributesLayout;
