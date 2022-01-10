import { ColumnConfig, DripTableSchema } from 'drip-table';

export const initSchema: DripTableSchema = {
  $schema: 'http://json-schema.org/draft/2019-09/schema#',
  configs: {
    size: 'middle',
    bordered: true,
    innerBordered: false,
    ellipsis: false,
    sticky: true,
    rowSelection: true,
    virtual: false,
    scrollY: 400,
    header: {
      style: { margin: '0', padding: '12px 0' },
      title: {
        type: 'title',
        title: '商品列表',
        span: 8,
        html: false,
        position: 'topLeft',
        align: 'flex-start',
      },
      search: {
        type: 'search',
        placeholder: '请输入关键字',
        allowClear: true,
        searchBtnText: '搜索',
        searchStyle: { width: 360 },
        searchKeys: [{ label: '商品', value: 'goods' }, { label: '广告', value: 'advert' }],
        searchKeyDefaultValue: 'goods',
        span: 13,
        position: 'topCenter',
        align: 'flex-end',
      },
      addButton: {
        type: 'addButton',
        position: 'topRight',
        span: 3,
        addBtnText: '添加商品',
        align: 'flex-end',
        showIcon: true,
      },
    },
    pagination: {
      pageSize: 10,
      size: 'small',
      position: 'bottomRight',
      showQuickJumper: true,
      showSizeChanger: true,
    },
  },
  columns: [
    {
      key: 'mock_1',
      title: '商品名称',
      width: 80,
      align: 'center',
      'ui:type': 'text',
      'ui:props': {
        mode: 'single',
        maxRow: 1,
      },
      type: 'string',
      dataIndex: 'name',
    },
    {
      key: 'mock_2',
      title: '商品详情',
      align: 'center',
      'ui:type': 'text',
      'ui:props': {
        mode: 'single',
        tooltip: true,
        ellipsis: true,
        maxRow: 3,
      },
      type: 'string',
      dataIndex: 'description',
    },
    {
      key: 'mock_3',
      title: '库存状态',
      width: 150,
      align: 'center',
      'ui:type': 'text',
      'ui:props': {
        mode: 'single',
      },
      type: 'string',
      enumValue: ['onSale', 'soldOut'],
      enumLabel: ['售卖中', '已售罄'],
      description: '这是一条提示信息',
      dataIndex: 'status',
    },
    {
      key: 'mock_4',
      title: '商品价格',
      width: 150,
      align: 'center',
      'ui:type': 'text',
      'ui:props': {
        mode: 'single',
        prefix: '￥',
      },
      type: 'number',
      dataIndex: 'price',
    },
    {
      key: 'mock_5',
      title: '渲染组件',
      width: 150,
      align: 'center',
      'ui:type': 'render-html',
      render: "if (rec.id == 1) {\n  return '<button onclick=\"alert(\\'123\\');\" style=\\\"padding: 2px 4px;color:#52c41a; border: 1px solid #b7eb8f; border-radius: 3px; background: #f6ffed\\\">进行中</button>';\n}\nif (rec.id == 2) {\n  return '<span style=\\\"padding: 2px 4px;color:#999; border: 1px solid #999; border-radius: 3px; background: #f2f2f2\\\">已完成</span>';\n}\nreturn '';",
      type: 'number',
      dataIndex: 'render',
    },
    {
      key: 'mock_6',
      title: '自定义组件',
      'ui:type': 'custom::CustomComponentSample',
      'ui:props': {},
      type: 'string',
      dataIndex: 'custom',
    },
    {
      key: 'mock_7',
      title: '操作',
      align: 'center',
      'ui:type': 'links',
      'ui:props': {
        mode: 'multiple',
        operates: [
          { name: 'order', label: '订购', href: './#order', target: '_blank' },
          { name: 'view', label: '查看', href: './#view' },
          { name: 'edit', label: '编辑', event: 'edit' },
          { name: 'remove', label: '删除', event: 'remove' },
        ],
      },
      type: 'string',
      dataIndex: 'operate',
    },
  ] as unknown as ColumnConfig[],
};

export interface SampleRecordType extends Record<string, unknown> {
  name: string;
  id: number;
  description: string;
  status: string;
  price: number;
}

export const mockData: SampleRecordType[] = [
  { id: 1, name: '商品一', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 7999 },
  { id: 2, name: '商品二', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 6488 },
  { id: 3, name: '商品三', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 2099 },
  { id: 4, name: '商品四', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 5999 },
  { id: 5, name: '商品五', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 109.9 },
  { id: 6, name: '商品六', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 178 },
  { id: 7, name: '商品七', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 9999 },
  { id: 8, name: '商品八', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 7999 },
  { id: 9, name: '商品九', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 6488 },
  { id: 10, name: '商品十', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 2099 },
  { id: 11, name: '商品一', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 5999 },
  { id: 12, name: '商品二', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 109.9 },
  { id: 13, name: '商品三', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 178 },
  { id: 14, name: '商品四', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 9999 },
  { id: 15, name: '商品五', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 7999 },
  { id: 16, name: '商品六', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 6488 },
  { id: 17, name: '商品七', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 2099 },
  { id: 18, name: '商品八', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 5999 },
  { id: 19, name: '商品九', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 109.9 },
  { id: 20, name: '商品十', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 178 },
  { id: 21, name: '商品一', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 9999 },
  { id: 22, name: '商品二', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 7999 },
  { id: 23, name: '商品三', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 6488 },
  { id: 24, name: '商品四', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 2099 },
  { id: 25, name: '商品五', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 5999 },
  { id: 26, name: '商品六', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 109.9 },
  { id: 27, name: '商品七', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 178 },
  { id: 28, name: '商品八', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 9999 },
  { id: 29, name: '商品九', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 7999 },
  { id: 30, name: '商品十', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 6488 },
  { id: 31, name: '商品一', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 2099 },
  { id: 32, name: '商品二', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 5999 },
  { id: 33, name: '商品三', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 109.9 },
  { id: 34, name: '商品四', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 178 },
  { id: 35, name: '商品五', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 9999 },
  { id: 36, name: '商品六', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 7999 },
  { id: 37, name: '商品七', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 6488 },
  { id: 38, name: '商品八', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 2099 },
  { id: 39, name: '商品一', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 5999 },
  { id: 40, name: '商品二', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 109.9 },
  { id: 41, name: '商品三', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'onSale', price: 178 },
  { id: 42, name: '商品四', description: '商品是为了出售而生产的劳动成果，是人类社会生产力发展到一定历史阶段的产物，是用于交换的劳动产品。', status: 'soldOut', price: 9999 },

];
