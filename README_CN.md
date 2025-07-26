# use-modal-ref

<div align="center">

![npm version](https://img.shields.io/npm/v/use-modal-ref.svg)
![npm downloads](https://img.shields.io/npm/dm/use-modal-ref.svg)
![license](https://img.shields.io/npm/l/use-modal-ref.svg)
![typescript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![react](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

**🚀 强大的 React hooks，用于优雅的模态框/抽屉管理**

[English](https://github.com/gxlmyacc/use-modal-ref/blob/master/README.md) | [中文](https://github.com/gxlmyacc/use-modal-ref/blob/master/README_CN.md)

</div>

## ✨ 特性

- 🎯 **简单直观** - 易于使用的模态框/抽屉管理 hooks
- 🔄 **异步/等待支持** - 通过基于 Promise 的 API 从模态框返回值
- 🎨 **框架无关** - 可与任何 UI 库配合使用（Antd、Material-UI 等）
- 🔧 **可扩展** - 支持自定义模态框类型（Popover、Tooltip 等）
- 📦 **轻量级** - 零依赖，支持 TypeScript
- 🎭 **多种使用模式** - 基于 ref、函数式和组件式的方法

## 📦 安装

```bash
npm install use-modal-ref
```

```bash
yarn add use-modal-ref
```

```bash
pnpm add use-modal-ref
```

## 🚀 快速开始

### 基础模态框使用

```jsx
import React, { useState, useRef } from 'react';
import { Modal, Button, Input } from 'antd';
import useModalRef from 'use-modal-ref';

// 模态框组件
const TestModal = React.forwardRef((props, ref) => {
  const [inputValue, setInputValue] = useState('');

  const { modal, data } = useModalRef(ref, {
    title: '默认标题',
    label: '默认标签'
  });

  const handleOK = () => modal.endModal(inputValue);
  const handleCancel = () => modal.cancelModal();

  return (
    <Modal
      {...modal.props}
      title={data.title}
      footer={[
        <Button key="cancel" onClick={handleCancel}>取消</Button>,
        <Button key="ok" type="primary" onClick={handleOK}>确定</Button>
      ]}
    >
      <div>{data.label}</div>
      <Input 
        value={inputValue} 
        onChange={e => setInputValue(e.target.value)} 
        placeholder="请输入内容..."
      />
    </Modal>
  );
});

// 使用组件
function App() {
  const [modalRef, setModalRef] = useRef(null);

  const showModal = async () => {
    const result = await modalRef.current.modal({
      title: '自定义标题',
      label: '请输入一个值：'
    });
    
    if (result !== undefined) {
      alert(`您输入的是：${result}`);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        显示模态框
      </Button>
      <TestModal ref={setModalRef} />
    </div>
  );
}
```

## 📚 使用示例

### 1. 与 Antd 模态框配合使用
<details>
<summary>点击展开</summary>

```jsx
import React, { useState, useRef } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import useModalRef from 'use-modal-ref';

const UserModal = React.forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { modal, data } = useModalRef(ref, {
    title: '添加用户',
    user: null
  }, {
    // 你可以在该事件中完成一些初始化操作，该函数的返回值将会作为新的data从useModalRef的data属性中返回
    beforeModal({ user }) {
      form.setFieldsValue(user || {
        name: '未命名',
        email: '',
      });
    },
    // 你可以在该事件中完成一些收尾工作，该函数的返回值将会作为新的data从useModalRef的data属性中返回
    afterModalClose() {
      setLoading(false);
      form.setFieldsValue({
        name: '未命名',
        email: '',
      });
    }
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      modal.endModal(values);
    } catch (error) {
      console.error('验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => modal.cancelModal();

  return (
    <Modal
      {...modal.props}
      title={data.title}
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

// 使用示例
function UserManagement() {
  const [userModalRef, setUserModalRef] = useRef(null);

  const addUser = async () => {
    const userData = await userModalRef.current.modal({
      title: '添加新用户'
    });
    
    if (userData) {
      console.log('新用户:', userData);
      // 处理用户创建
    }
  };

  return (
    <div>
      <Button type="primary" onClick={addUser}>
        添加用户
      </Button>
      <UserModal ref={setUserModalRef} />
    </div>
  );
}
```

</details>


### 2. 与 Antd 抽屉配合使用

<details>
<summary>点击展开</summary>

```jsx
import React, { useState } from 'react';
import { Drawer, Button, Input, Space } from 'antd';
import { useDrawerRef } from 'use-modal-ref';

const SettingsDrawer = React.forwardRef((props, ref) => {
  const [settings, setSettings] = useState({});

  const { modal, data } = useDrawerRef(ref, {
    title: '设置',
    initialSettings: {}
  }, {
    beforeModal: async (data) => {
      setSettings(data.initialSettings);
      return data;
    }
  });

  const handleSave = () => {
    modal.endModal(settings);
  };

  const handleCancel = () => {
    modal.cancelModal();
  };

  return (
    <Drawer
      {...modal.props}
      title={data.title}
      width={400}
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleSave}>保存</Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="设置项 1"
          value={settings.setting1 || ''}
          onChange={e => setSettings(prev => ({ ...prev, setting1: e.target.value }))}
        />
        <Input
          placeholder="设置项 2"
          value={settings.setting2 || ''}
          onChange={e => setSettings(prev => ({ ...prev, setting2: e.target.value }))}
        />
      </Space>
    </Drawer>
  );
});

// 使用示例
function SettingsPage() {
  const [settingsRef, setSettingsRef] = useState(null);

  const openSettings = async () => {
    const newSettings = await settingsRef.modal({
      title: '编辑设置',
      initialSettings: { setting1: '值1', setting2: '值2' }
    });
    
    if (newSettings) {
      console.log('更新的设置:', newSettings);
    }
  };

  return (
    <div>
      <Button onClick={openSettings}>打开设置</Button>
      <SettingsDrawer ref={setSettingsRef} />
    </div>
  );
}
```

</details>

### 3. 自定义 Popover 组件

<details>
<summary>点击展开</summary>

```jsx
// usePopoverRef.js
import { useCommonRef, mergeModalType } from 'use-modal-ref';

// 注册 popover 模态框类型
mergeModalType({
  popover: {
    visible: 'visible',
    onClose: 'onClose',
  }
});

const usePopoverRef = (ref, defaultData, options, deps = []) => 
  useCommonRef('popover', ref, defaultData, options, deps);

export default usePopoverRef;
```

```jsx
// ColorPickerPopover.jsx
import React, { useState, useRef } from 'react';
import { Popover, Button, Space } from 'antd';
import usePopoverRef from './usePopoverRef';

const ColorPickerPopover = React.forwardRef((props, ref) => {
  const [selectedColor, setSelectedColor] = useState('#1890ff');

  const { modal, data } = usePopoverRef(ref, {
    title: '选择颜色',
    colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d']
  });

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    modal.endModal(color);
  };

  return (
    <Popover
      {...modal.props}
      title={data.title}
      content={
        <Space direction="vertical">
          {data.colors.map(color => (
            <Button
              key={color}
              style={{ 
                backgroundColor: color, 
                borderColor: color,
                width: 40,
                height: 40
              }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </Space>
      }
    >
      {props.children}
    </Popover>
  );
});

// 使用示例
function ColorPicker() {
  const [colorRef, setColorRef] = useRef(null);

  const pickColor = async () => {
    const color = await colorRef.current.modal({
      title: '选择颜色',
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']
    });
    
    if (color) {
      console.log('选择的颜色:', color);
    }
  };

  return (
    <div>
      <ColorPickerPopover ref={setColorRef}>
        <Button onClick={pickColor}>选择颜色</Button>
      </ColorPickerPopover>
    </div>
  );
}
```

</details>

### 4. 函数式模态框

<details>
<summary>点击展开</summary>

```jsx
import React from 'react';
import { Button } from 'antd';
import TestModal from './TestModal';
import { showRefModal } from 'use-modal-ref';

function App() {
  const showModal = async () => {
    const result = await showRefModal(TestModal, {
      title: '动态模态框',
      label: '这个模态框是动态创建的'
    });
    
    if (result) {
      alert(`模态框结果: ${result}`);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        显示动态模态框
      </Button>
    </div>
  );
}
```

</details>

### 5. 组件式模态框

<details>
<summary>点击展开</summary>

```jsx
import React from 'react';
import { Button } from 'antd';
import TestModal from './TestModal';
import { createRefComponent } from 'use-modal-ref';

function App() {
  const showModal = async () => {
    const [ref, destroy] = await createRefComponent(TestModal);
    
    try {
      const result = await ref.modal({
        title: '临时模态框',
        label: '这个模态框使用后会被销毁'
      });
      
      if (result) {
        alert(`结果: ${result}`);
      }
    } finally {
      destroy(); // 清理组件
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        显示临时模态框
      </Button>
    </div>
  );
}
```

</details>

## 🔧 API 参考

### useModalRef

```typescript
function useModalRef<T = any, U = any>(
  ref: React.Ref<any>,
  defaultData?: Partial<T> | (() => Partial<T>),
  options?: ModalRefOption<'modal', T, U>,
  deps?: React.DependencyList
): {
  modal: ModalRefMethods<U>;
  data: T;
}
```

**参数说明：**

- `ref: React.Ref<any>` - React ref 对象，用于控制模态框的显示和隐藏
- `defaultData?: Partial<T> | (() => Partial<T>)` - 默认数据，可以是对象或返回对象的函数
- `options?: ModalRefOption<'modal', T, U>` - 配置选项，包含生命周期钩子等
- `deps?: React.DependencyList` - 依赖数组，当依赖变化时重新初始化

**返回值：**

- `modal: ModalRefMethods<U>` - 模态框控制方法对象
- `data: T` - 当前模态框数据

### useDrawerRef

```typescript
function useDrawerRef<T = any, U = any>(
  ref: React.Ref<any>,
  defaultData?: Partial<T> | (() => Partial<T>),
  options?: ModalRefOption<'drawer', T, U>,
  deps?: React.DependencyList
): {
  modal: ModalRefMethods<U>;
  data: T;
}
```

**参数说明：**

- `ref: React.Ref<any>` - React ref 对象，用于控制抽屉的显示和隐藏
- `defaultData?: Partial<T> | (() => Partial<T>)` - 默认数据，可以是对象或返回对象的函数
- `options?: ModalRefOption<'drawer', T, U>` - 配置选项，包含生命周期钩子等
- `deps?: React.DependencyList` - 依赖数组，当依赖变化时重新初始化

**返回值：**

- `modal: ModalRefMethods<U>` - 抽屉控制方法对象
- `data: T` - 当前抽屉数据

### useCommonRef

```typescript
function useCommonRef<P = string, T = any, U = any>(
  modalType: P,
  ref: React.Ref<any>,
  defaultData?: Partial<T> | (() => Partial<T>),
  options?: ModalRefOption<P, T, U>,
  deps?: React.DependencyList
): {
  modal: ModalRefMethods<U>;
  data: T;
}
```

**参数说明：**

- `modalType: P` - 模态框类型标识符（如 'modal', 'drawer', 'popover' 等）
- `ref: React.Ref<any>` - React ref 对象，用于控制组件的显示和隐藏
- `defaultData?: Partial<T> | (() => Partial<T>)` - 默认数据，可以是对象或返回对象的函数
- `options?: ModalRefOption<P, T, U>` - 配置选项，包含生命周期钩子等
- `deps?: React.DependencyList` - 依赖数组，当依赖变化时重新初始化

**返回值：**

- `modal: ModalRefMethods<U>` - 组件控制方法对象
- `data: T` - 当前组件数据

### showRefModal

```typescript
function showRefModal<T = any, U = any>(
  Component: React.ComponentType<any>,
  data?: T
): Promise<U | undefined>
```

**参数说明：**

- `Component: React.ComponentType<any>` - 要显示的模态框组件
- `data?: T` - 传递给模态框的数据

**返回值：**

- `Promise<U | undefined>` - 返回模态框的结果，如果用户取消则返回 undefined

### createRefComponent

```typescript
function createRefComponent<T = any>(
  Component: React.ComponentType<any>
): Promise<[React.RefObject<T>, () => void]>
```

**参数说明：**

- `Component: React.ComponentType<any>` - 要创建的组件

**返回值：**

- `Promise<[React.RefObject<T>, () => void]>` - 返回一个元组，包含组件的 ref 对象和销毁函数

## 🎯 高级特性

### 自定义模态框类型

您可以为任何组件创建自定义模态框类型：

```jsx
import { useCommonRef, mergeModalType } from 'use-modal-ref';

// 注册自定义模态框类型
mergeModalType({
  tooltip: {
    visible: 'open',
    onClose: 'onOpenChange',
  }
});

// 创建自定义 hook
const useTooltipRef = (ref, defaultData, options, deps = []) => 
  useCommonRef('tooltip', ref, defaultData, options, deps);
```

### 前置/后置钩子

```jsx
const { modal, data } = useModalRef(ref, defaultData, {
  beforeModal: async (data) => {
    // 模态框打开前调用
    console.log('正在打开模态框，数据:', data);
    return data; // 可以修改数据
  },
  afterModal: (result) => {
    // 模态框关闭后调用
    console.log('模态框已关闭，结果:', result);
  }
});
```

## 🤝 贡献

我们欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

---

<div align="center">

由 use-modal-ref 社区 ❤️ 制作

</div>
