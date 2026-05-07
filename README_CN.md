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
  const modalRef = useRef(null);

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
      <TestModal ref={modalRef} />
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
  const userModalRef = useRef(null);

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
      <UserModal ref={userModalRef} />
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
  const settingsRef = useRef(null);

  const openSettings = async () => {
    const newSettings = await settingsRef.current.modal({
      title: '编辑设置',
      initialSettings: { setting1: '값1', setting2: '값2' }
    });
    
    if (newSettings) {
      console.log('更新的设置:', newSettings);
    }
  };

  return (
    <div>
      <Button onClick={openSettings}>打开设置</Button>
      <SettingsDrawer ref={settingsRef} />
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
  const colorRef = useRef(null);

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
      <ColorPickerPopover ref={colorRef}>
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
function useModalRef<T = any, U = any, C extends Record<string, any> = {}>(
  ref: React.Ref<any>,
  defaultData?: Partial<T> | (() => Partial<T>),
  options?: ModalRefOption<'modal', T, U, C>,
  deps?: React.DependencyList
): {
  modal: ModalRef<'modal', T, U, C>;
  data: T;
  setData: (newData: T | ((data: T) => T)) => void;
}
```

**参数说明：**

- `ref: React.Ref<any>` - React ref 对象，用于控制模态框的显示和隐藏。必须通过 `React.forwardRef` 传递给模态框组件
- `defaultData?: Partial<T> | (() => Partial<T>)` - 默认数据，可以是对象或返回对象的函数。当使用函数形式时，支持懒初始化，仅在需要时执行
- `options?: ModalRefOption<'modal', T, U, C>` - 配置选项对象，包含以下属性：
  - `alwaysResolve?: boolean` - 是否总是 resolve Promise，即使调用 `cancelModal` 也会 resolve
  - `custom?: C` - 自定义属性对象，这些属性会被添加到返回的 `modal` 对象上。可以通过 ref 访问这些自定义方法或属性。**重要**：`custom` 中注册的方法或属性的类型信息会绑定到 `ModalRef` 上，提供完整的 TypeScript 类型支持，确保类型安全
  
  **custom 参数使用示例：**
  
  ```tsx
  import React, { useState, useRef } from 'react';
  import { Modal } from 'antd';
  import useModalRef, { ModalRef } from 'use-modal-ref';
  
  const TestModal = React.forwardRef((props, ref) => {
    const [formData, setFormData] = useState({});
    
    // 在组件中定义自定义方法
    const resetForm = () => {
      setFormData({});
      console.log('表单已重置');
    };
    
    const validate = () => {
      // 验证逻辑
      return Object.keys(formData).length > 0;
    };
    
    const getFormData = () => {
      return formData;
    };
    
    const { modal, data } = useModalRef<{ title: string }, any>(
      ref,
      {
        title: '默认标题'
      },
      {
        // 在 custom 中注册这些方法
        // TypeScript 会自动从 custom 对象推断类型，无需显式定义接口
        custom: {
          resetForm,
          validate,
          getFormData
        }
      }
    );
    
    // 在组件内部可以通过 modal.resetForm()、modal.validate() 等访问自定义方法
    const handleReset = () => {
      modal.resetForm(); // 调用自定义方法，TypeScript 会提供类型提示
    };
    
    const handleValidate = () => {
      const isValid = modal.validate(); // 调用自定义方法，返回类型为 boolean
      console.log('验证结果:', isValid);
    };
    
     
    return (
      <Modal {...modal.props} title={data.title}>
        <button onClick={handleReset}>重置表单</button>
        <button onClick={handleValidate}>验证表单</button>
      </Modal>
    );
  });
  
  // 使用组件时，可以通过 ref 访问自定义方法
  // TypeScript 会自动从 useModalRef 的 custom 参数推断类型，
  // modalRef.current 上会自动拥有 resetForm、validate、getFormData 等方法的类型定义
  // 提供完整的类型提示和类型检查，确保类型安全
  function App() {
    const modalRef = useRef<ModalRef<'modal'>>(null);

    
    return (
      <div>
        <button onClick={() => modalRef.current?.modal({ title: '测试' })}>
          打开模态框
        </button>
        <TestModal ref={modalRef} />
      </div>
    );
  }
  ```

  - `beforeModal?: (newData: Partial<T>, pause: (result: any, isError?: boolean) => void, options: Record<string, any>) => void | Partial<T> | Promise<void | Partial<T>>` - 模态框打开前的钩子函数，可以修改数据或暂停打开流程
  - `afterModal?: (newData: T, options?: ModalModalOptions) => void` - 模态框打开后的钩子函数
  - `init?: (newData: T, options: Record<string, any>) => void | Promise<void>` - 初始化钩子函数，在模态框打开后执行
  - `beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<'modal', T, U, C>) => void | Promise<void>` - 模态框关闭前的钩子函数，可以通过 `next(false)` 阻止关闭
  - `afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<'modal', T, U, C>) => void | Promise<void>` - 模态框关闭后的钩子函数
- `deps?: React.DependencyList` - 依赖数组，当依赖变化时重新初始化选项

**返回值：**

- `modal: ModalRef<'modal', T, U, C>` - 模态框控制对象，包含以下属性和方法：
  - `visible: boolean` - 只读属性，表示模态框是否可见
  - `data: T` - 只读属性，当前模态框数据
  - `props: { visible: boolean, onCancel: () => void }` - 只读属性，用于传递给 Modal 组件的 props
  - `options: ModalRefOption<'modal', T, U, C>` - 只读属性，当前配置选项
  - `modalOptions: ModalModalOptions` - 只读属性，当前模态框选项
  - `modalPromise: Promise<U> | null` - 只读属性，当前模态框的 Promise
  - `modal(newData: T, options?: ModalModalOptions): Promise<U>` - 打开模态框并返回 Promise
  - `endModal(result?: U, onDone?: () => void): Promise<void>` - 结束模态框并返回结果
  - `cancelModal(ex?: any, onDone?: () => void): Promise<void>` - 取消模态框
- `data: T` - 当前模态框数据（与 `modal.data` 相同）
- `setData: (newData: T | ((data: T) => T)) => void` - 更新模态框数据的函数

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
function showRefModal<
  M extends ModalRef<any, any>,
  D extends M extends ModalRef<any, infer D> ? D : Record<string, any>,
  U extends M extends ModalRef<any, any, infer U> ? U : any
>(
  RefModal: React.ForwardRefExoticComponent<React.RefAttributes<M>>,
  modalData?: D,
  options?: {
    /** 组件 props */
    props?: Record<string, any>;
    /** 调用模态框的方法名，默认为 'modal' */
    modalMethod?: string;
    /** 取消模态框的方法名，默认为 'cancelModal' */
    cancelMethod?: string;
    /** 模态框选项 */
    modalOptions?: ModalModalOptions;
    /** 是否在 URL 变化时自动关闭模态框 */
    closeWhenUrlChange?: boolean;
    /** 容器选择器 */
    selector?: string;
    /** 容器 ID */
    id?: string;
    /** 容器元素或返回容器的函数 */
    container?: HTMLElement | null | (() => HTMLElement);
    /** 容器类名 */
    className?: string;
    /** ref 创建后的回调 */
    onRef?: (ref: any, destroy: () => void) => void;
    /** 容器追加前的回调，返回 true 可阻止自动追加 */
    onAppendContainer?: (container: HTMLElement) => void | boolean;
    /** 容器移除前的回调，返回 true 可阻止自动移除 */
    onRemoveContainer?: (container: HTMLElement) => void | boolean;
    /** 组件销毁前的回调，返回 true 可阻止自动销毁 */
    onDestroyComponent?: (container: HTMLElement) => void | boolean;
    /** 销毁延迟时间（毫秒），默认为 50 */
    destroyDelay?: number;
  }
): Promise<U>
```

**参数说明：**

- `RefModal: React.ForwardRefExoticComponent<React.RefAttributes<M>>` - 要显示的模态框组件，必须使用 `React.forwardRef` 包装
- `modalData?: D` - 传递给模态框的数据，会作为 `modal` 方法的第一个参数
- `options?: object` - 配置选项对象，包含以下属性：
  - `props?: Record<string, any>` - 传递给组件的 props
  - `modalMethod?: string` - 调用模态框的方法名，默认为 `'modal'`
  - `cancelMethod?: string` - 取消模态框的方法名，默认为 `'cancelModal'`
  - `modalOptions?: ModalModalOptions` - 模态框选项，会作为 `modal` 方法的第二个参数
  - `closeWhenUrlChange?: boolean` - 是否在 URL 变化时自动关闭模态框，默认为 `false`
  - `selector?: string` - 容器选择器，用于查找已存在的容器元素
  - `id?: string` - 容器 ID，用于查找或创建容器元素
  - `container?: HTMLElement | null | (() => HTMLElement)` - 容器元素或返回容器的函数
  - `className?: string` - 容器类名，仅在创建新容器时使用
  - `onRef?: (ref: any, destroy: () => void) => void` - ref 创建后的回调函数
  - `onAppendContainer?: (container: HTMLElement) => void | boolean` - 容器追加到 DOM 前的回调，返回 `true` 可阻止自动追加
  - `onRemoveContainer?: (container: HTMLElement) => void | boolean` - 容器从 DOM 移除前的回调，返回 `true` 可阻止自动移除
  - `onDestroyComponent?: (container: HTMLElement) => void | boolean` - 组件销毁前的回调，返回 `true` 可阻止自动销毁
  - `destroyDelay?: number` - 销毁延迟时间（毫秒），默认为 `50`

**返回值：**

- `Promise<U>` - 返回模态框的结果 Promise，如果用户取消则会被 reject

### createRefComponent

```typescript
function createRefComponent<
  T extends React.ForwardRefExoticComponent<React.RefAttributes<any>>,
  P extends T extends React.ForwardRefExoticComponent<React.RefAttributes<infer P>> ? P : never,
  R extends T extends React.ForwardRefExoticComponent<React.RefAttributes<P & infer R>> ? R : never
>(
  RefComponent: T,
  props?: P | null,
  options?: {
    /** 容器选择器 */
    selector?: string;
    /** 容器 ID */
    id?: string;
    /** 容器元素或返回容器的函数 */
    container?: HTMLElement | null | (() => HTMLElement);
    /** 容器类名 */
    className?: string;
    /** ref 创建后的回调 */
    onRef?: (ref: any, destroy: () => void) => void;
    /** 容器追加前的回调，返回 true 可阻止自动追加 */
    onAppendContainer?: (container: HTMLElement) => void | boolean;
    /** 容器移除前的回调，返回 true 可阻止自动移除 */
    onRemoveContainer?: (container: HTMLElement) => void | boolean;
    /** 组件销毁前的回调，返回 true 可阻止自动销毁 */
    onDestroyComponent?: (container: HTMLElement) => void | boolean;
    /** 销毁延迟时间（毫秒），默认为 50 */
    destroyDelay?: number;
  }
): Promise<[ref: R, destroy: () => void]>
```

**参数说明：**

- `RefComponent: T` - 要创建的组件，必须使用 `React.forwardRef` 包装
- `props?: P | null` - 传递给组件的 props
- `options?: object` - 配置选项对象，包含以下属性：
  - `selector?: string` - 容器选择器，用于查找已存在的容器元素。如果找到，将使用该容器；否则创建新容器
  - `id?: string` - 容器 ID，用于查找或创建容器元素。如果找到，将使用该容器；否则创建新容器并设置该 ID
  - `container?: HTMLElement | null | (() => HTMLElement)` - 容器元素或返回容器的函数。如果提供，将直接使用该容器
  - `className?: string` - 容器类名，仅在创建新容器时使用
  - `onRef?: (ref: any, destroy: () => void) => void` - ref 创建后的回调函数，接收 ref 对象和销毁函数
  - `onAppendContainer?: (container: HTMLElement) => void | boolean` - 容器追加到 DOM 前的回调函数，返回 `true` 可阻止自动追加到 `document.body`
  - `onRemoveContainer?: (container: HTMLElement) => void | boolean` - 容器从 DOM 移除前的回调函数，返回 `true` 可阻止自动移除
  - `onDestroyComponent?: (container: HTMLElement) => void | boolean` - 组件销毁前的回调函数，返回 `true` 可阻止自动调用 `ReactDOM.unmountComponentAtNode`
  - `destroyDelay?: number` - 销毁延迟时间（毫秒），默认为 `50`。用于延迟执行销毁操作，避免动画未完成

**返回值：**

- `Promise<[ref: R, destroy: () => void]>` - 返回一个 Promise，resolve 后得到一个元组：
  - `ref: R` - 组件的 ref 对象，包含组件暴露的所有方法和属性
  - `destroy: () => void` - 销毁函数，调用后会卸载组件并移除容器（如果容器是自动创建的）

### ModalRef

`ModalRef` 是模态框控制对象的类型定义，包含以下属性和方法：

```typescript
type ModalRef<
  P extends ModalType = 'modal',
  T extends Record<string, any> = Record<string, any>,
  U = any,
  C extends Record<string, any> = {}
> = {
  /** 只读属性：模态框是否可见 */
  readonly visible: boolean;
  /** 只读属性：当前模态框数据 */
  readonly data: Partial<Omit<T, 'onCancel'|'onOK'>> & { [key: string]: any };
  /** 只读属性：用于传递给 Modal/Drawer 组件的 props */
  readonly props: ModalPropsTypeMap[P];
  /** 只读属性：当前配置选项 */
  readonly options: ModalRefOption<P, T, U, C>;
  /** 只读属性：当前模态框选项 */
  readonly modalOptions: ModalModalOptions;
  /** 只读属性：当前模态框的 Promise */
  readonly modalPromise: null | Promise<any> | PromiseLike<any>;

  /** 打开模态框并返回 Promise */
  modal(newData: T, options?: ModalModalOptions): Promise<U>;

  /** 结束模态框并返回结果 */
  endModal: (result?: U, onDone?: () => void) => Promise<void>;
  
  /** 取消模态框 */
  cancelModal: (ex?: any, onDone?: () => void) => Promise<void>;

  [key: string]: any;
} & {
  [key in keyof C]: C[key];
}
```

**属性说明：**

- `visible: boolean` - 只读属性，表示模态框当前是否可见
- `data: T` - 只读属性，当前模态框的数据对象
- `props: ModalPropsTypeMap[P]` - 只读属性，根据模态框类型返回相应的 props：
  - 对于 `'modal'` 类型：`{ visible: boolean, onCancel: () => void }`
  - 对于 `'drawer'` 类型：`{ open?: boolean, onClose?: () => void }`
  - 对于 `'popover'` 类型：`{ visible: boolean, onClose: () => void }`
- `options: ModalRefOption<P, T, U, C>` - 只读属性，当前配置选项
- `modalOptions: ModalModalOptions` - 只读属性，当前模态框选项
- `modalPromise: Promise<U> | null` - 只读属性，当前模态框的 Promise，如果模态框未打开则为 `null`

**方法说明：**

- `modal(newData: T, options?: ModalModalOptions): Promise<U>` - 打开模态框的方法
  - `newData: T` - 要传递给模态框的新数据，会与 `defaultData` 合并
  - `options?: ModalModalOptions` - 模态框选项，包含以下属性：
    - `modalDataEvent?: boolean` - 是否启用数据事件（`onOK`、`onCancel`）
    - `afterModal?: (newData: any, options?: ModalModalOptions) => void` - 模态框打开后的钩子
    - `beforeCloseModal?: (next: (ok: any) => void, action: ModalAction) => void | Promise<void>` - 关闭前的钩子
    - `beforeEndModal?: (value?: any) => Promise<any>` - 结束前的钩子，可以修改返回值
    - `beforeCancelModal?: (reason?: any) => Promise<any>` - 取消前的钩子，可以修改取消原因
    - `afterCloseModal?: (newData: any, action: ModalAction, modal: ModalRef<any, any, any>) => void | Promise<void>` - 关闭后的钩子
    - `forceVisible?: boolean` - 强制显示，即使已有模态框打开
    - `alwaysResolve?: boolean` - 是否总是 resolve Promise
  - 返回 `Promise<U>`，resolve 时返回结果，reject 时表示取消
- `endModal(result?: U, onDone?: () => void): Promise<void>` - 结束模态框
  - `result?: U` - 要返回的结果值
  - `onDone?: () => void` - 完成后的回调函数
- `cancelModal(ex?: any, onDone?: () => void): Promise<void>` - 取消模态框
  - `ex?: any` - 取消原因，默认为 `'cancel'`
  - `onDone?: () => void` - 完成后的回调函数

### getUrlListener

获取 URL 监听器实例，用于监听浏览器 URL 变化。

```typescript
function getUrlListener(): UrlListener

interface UrlListener {
  addListener: (
    listener: (url: string) => void,
    options?: { once?: boolean }
  ) => () => void;
}
```

**返回值：**

- `UrlListener` - URL 监听器对象，包含以下方法：
  - `addListener(listener: (url: string) => void, options?: { once?: boolean }): () => void` - 添加 URL 变化监听器
    - `listener: (url: string) => void` - 监听器函数，当 URL 变化时调用，参数为新 URL
    - `options?: { once?: boolean }` - 选项对象，`once` 为 `true` 时监听器只执行一次
    - 返回一个取消监听的函数

**使用示例：**

```typescript
import { getUrlListener } from 'use-modal-ref';

const urlListener = getUrlListener();

// 添加监听器
const removeListener = urlListener.addListener((url) => {
  console.log('URL changed to:', url);
}, { once: true });

// 移除监听器
removeListener();
```

## 📘 TypeScript 支持

本库使用 TypeScript 编写，并提供完整的类型定义。

### 类型安全

```tsx
interface ModalData {
  title: string;
  label: string;
}

interface ModalResult {
  value: string;
}

const TestModal = React.forwardRef((props, ref) => {
  const { modal, data } = useModalRef<ModalData, ModalResult>(ref, {
    title: '默认标题',
    label: '默认标签'
  });
  
  // TypeScript 将确保 data 符合 ModalData 类型
  // 并且 modal 回调函数返回 ModalResult 类型
});
```

### 严格模式支持

本库完全支持 React 的严格模式和并发特性。

## ⚠️ 错误处理

在模态框交互中处理潜在的错误：

```jsx
const showModal = async () => {
  try {
    const result = await modalRef.current.modal(data);
    if (result !== undefined) {
      // 处理成功情况
      console.log('模态框结果:', result);
    } else {
      // 处理取消/关闭情况
      console.log('模态框被取消了');
    }
  } catch (error) {
    // 处理模态框操作期间的错误
    console.error('模态框错误:', error);
  }
};
```

## ⚡ 性能优化

### 依赖数组的使用

使用依赖数组来优化重渲染：

```jsx
const { modal, data } = useModalRef(ref, defaultData, options, [dep1, dep2]);
```

### 懒初始化

对于复杂的初始化操作，可以使用函数形式的 defaultData：

```jsx
const { modal, data } = useModalRef(ref, () => {
  // 昂贵的计算只在需要时运行
  return {
    title: getLocalizedTitle(),
    items: generateInitialItems()
  };
});
```

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
