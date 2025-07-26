# use-modal-ref

<div align="center">

![npm version](https://img.shields.io/npm/v/use-modal-ref.svg)
![npm downloads](https://img.shields.io/npm/dm/use-modal-ref.svg)
![license](https://img.shields.io/npm/l/use-modal-ref.svg)
![typescript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![react](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

**🚀 Powerful React hooks for elegant modal/drawer management**

[English](https://github.com/gxlmyacc/use-modal-ref/blob/master/README.md) | [中文](https://github.com/gxlmyacc/use-modal-ref/blob/master/README_CN.md)

</div>

## ✨ Features

- 🎯 **Simple & Intuitive** - Easy-to-use hooks for modal/drawer management
- 🔄 **Async/Await Support** - Return values from modals with Promise-based API
- 🎨 **Framework Agnostic** - Works with any UI library (Antd, Material-UI, etc.)
- 🔧 **Extensible** - Support custom modal types (Popover, Tooltip, etc.)
- 📦 **Lightweight** - Zero dependencies, TypeScript support
- 🎭 **Multiple Usage Patterns** - Ref-based, function-based, and component-based approaches

## 📦 Installation

```bash
npm install use-modal-ref
```

```bash
yarn add use-modal-ref
```

```bash
pnpm add use-modal-ref
```

## 🚀 Quick Start

### Basic Modal Usage

```jsx
import React, { useState, useRef } from 'react';
import { Modal, Button, Input } from 'antd';
import useModalRef from 'use-modal-ref';

// Modal Component
const TestModal = React.forwardRef((props, ref) => {
  const [inputValue, setInputValue] = useState('');

  const { modal, data } = useModalRef(ref, {
    title: 'Default Title',
    label: 'Default Label'
  });

  const handleOK = () => modal.endModal(inputValue);
  const handleCancel = () => modal.cancelModal();

  return (
    <Modal
      {...modal.props}
      title={data.title}
      footer={[
        <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
        <Button key="ok" type="primary" onClick={handleOK}>OK</Button>
      ]}
    >
      <div>{data.label}</div>
      <Input 
        value={inputValue} 
        onChange={e => setInputValue(e.target.value)} 
        placeholder="Enter value..."
      />
    </Modal>
  );
});

// Usage Component
function App() {
  const [modalRef, setModalRef] = useState(null);

  const showModal = async () => {
    const result = await modalRef.modal({
      title: 'Custom Title',
      label: 'Please enter a value:'
    });
    
    if (result !== undefined) {
      alert(`You entered: ${result}`);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Show Modal
      </Button>
      <TestModal ref={setModalRef} />
    </div>
  );
}
```

## 📚 Usage Examples

### 1. Modal with Antd
<details>
<summary>Click to expand</summary>

```jsx
import React, { useState, useRef } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import useModalRef from 'use-modal-ref';

const UserModal = React.forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { modal, data } = useModalRef(ref, {
    title: 'Add User',
    user: null
  }, {
    // You can perform initialization operations in this event, and the function's return value will be used as the new data returned from the useModalRef hook's data property
    beforeModal(data) {
      form.setFieldsValue(user || {
        name: '',
        email: '',
      });
    },
    // You can perform cleanup operations in this event, and the function's return value will be used as the new data returned from the useModalRef hook's data property.
    afterModalClose() {
     setLoading(false);
      form.setFieldsValue({
        name: '',
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
      console.error('Validation failed:', error);
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
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter valid email' }
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

// Usage
function UserManagement() {
  const [userModalRef, setUserModalRef] = useRef(null);

  const addUser = async () => {
    const userData = await userModalRef.current.modal({
      title: 'Add New User'
    });
    
    if (userData) {
      console.log('New user:', userData);
      // Handle user creation
    }
  };

  return (
    <div>
      <Button type="primary" onClick={addUser}>
        Add User
      </Button>
      <UserModal ref={setUserModalRef} />
    </div>
  );
}
```

</details>


### 2. Drawer with Antd

<details>
<summary>Click to expand</summary>

```jsx
import React, { useState, useRef } from 'react';
import { Drawer, Button, Input, Space } from 'antd';
import { useDrawerRef } from 'use-modal-ref';

const SettingsDrawer = React.forwardRef((props, ref) => {
  const [settings, setSettings] = useState({});

  const { modal, data } = useDrawerRef(ref, {
    title: 'Settings',
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
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Setting 1"
          value={settings.setting1 || ''}
          onChange={e => setSettings(prev => ({ ...prev, setting1: e.target.value }))}
        />
        <Input
          placeholder="Setting 2"
          value={settings.setting2 || ''}
          onChange={e => setSettings(prev => ({ ...prev, setting2: e.target.value }))}
        />
      </Space>
    </Drawer>
  );
});

// Usage
function SettingsPage() {
  const [settingsRef, setSettingsRef] = useRef(null);

  const openSettings = async () => {
    const newSettings = await settingsRef.current.modal({
      title: 'Edit Settings',
      initialSettings: { setting1: 'value1', setting2: 'value2' }
    });
    
    if (newSettings) {
      console.log('Updated settings:', newSettings);
    }
  };

  return (
    <div>
      <Button onClick={openSettings}>Open Settings</Button>
      <SettingsDrawer ref={setSettingsRef} />
    </div>
  );
}
```

</details>

### 3. Custom Popover Component

<details>
<summary>Click to expand</summary>

```jsx
// usePopoverRef.js
import { useCommonRef, mergeModalType } from 'use-modal-ref';

// Register popover modal type
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
import React, { useState } from 'react';
import { Popover, Button, Space } from 'antd';
import usePopoverRef from './usePopoverRef';

const ColorPickerPopover = React.forwardRef((props, ref) => {
  const [selectedColor, setSelectedColor] = useState('#1890ff');

  const { modal, data } = usePopoverRef(ref, {
    title: 'Choose Color',
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

// Usage
function ColorPicker() {
  const [colorRef, setColorRef] = useRef(null);

  const pickColor = async () => {
    const color = await colorRef.current.modal({
      title: 'Select Color',
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']
    });
    
    if (color) {
      console.log('Selected color:', color);
    }
  };

  return (
    <div>
      <ColorPickerPopover ref={setColorRef}>
        <Button onClick={pickColor}>Pick Color</Button>
      </ColorPickerPopover>
    </div>
  );
}
```

</details>

### 4. Function-based Modal

<details>
<summary>Click to expand</summary>

```jsx
import React from 'react';
import { Button } from 'antd';
import TestModal from './TestModal';
import { showRefModal } from 'use-modal-ref';

function App() {
  const showModal = async () => {
    const result = await showRefModal(TestModal, {
      title: 'Dynamic Modal',
      label: 'This modal was created dynamically'
    });
    
    if (result) {
      alert(`Modal result: ${result}`);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Show Dynamic Modal
      </Button>
    </div>
  );
}
```

</details>

### 5. Component-based Modal

<details>
<summary>Click to expand</summary>

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
        title: 'Temporary Modal',
        label: 'This modal will be destroyed after use'
      });
      
      if (result) {
        alert(`Result: ${result}`);
      }
    } finally {
      destroy(); // Clean up the component
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Show Temporary Modal
      </Button>
    </div>
  );
}
```

</details>

## 🔧 API Reference

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

**Parameters:**

- `ref: React.Ref<any>` - React ref object for controlling modal show/hide
- `defaultData?: Partial<T> | (() => Partial<T>)` - Default data, can be an object or a function returning an object
- `options?: ModalRefOption<'modal', T, U>` - Configuration options including lifecycle hooks
- `deps?: React.DependencyList` - Dependency array, reinitializes when dependencies change

**Returns:**

- `modal: ModalRefMethods<U>` - Modal control methods object
- `data: T` - Current modal data

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

**Parameters:**

- `ref: React.Ref<any>` - React ref object for controlling drawer show/hide
- `defaultData?: Partial<T> | (() => Partial<T>)` - Default data, can be an object or a function returning an object
- `options?: ModalRefOption<'drawer', T, U>` - Configuration options including lifecycle hooks
- `deps?: React.DependencyList` - Dependency array, reinitializes when dependencies change

**Returns:**

- `modal: ModalRefMethods<U>` - Drawer control methods object
- `data: T` - Current drawer data

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

**Parameters:**

- `modalType: P` - Modal type identifier (e.g., 'modal', 'drawer', 'popover', etc.)
- `ref: React.Ref<any>` - React ref object for controlling component show/hide
- `defaultData?: Partial<T> | (() => Partial<T>)` - Default data, can be an object or a function returning an object
- `options?: ModalRefOption<P, T, U>` - Configuration options including lifecycle hooks
- `deps?: React.DependencyList` - Dependency array, reinitializes when dependencies change

**Returns:**

- `modal: ModalRefMethods<U>` - Component control methods object
- `data: T` - Current component data

### showRefModal

```typescript
function showRefModal<T = any, U = any>(
  Component: React.ComponentType<any>,
  data?: T
): Promise<U | undefined>
```

**Parameters:**

- `Component: React.ComponentType<any>` - Modal component to display
- `data?: T` - Data to pass to the modal

**Returns:**

- `Promise<U | undefined>` - Returns modal result, undefined if user cancels

### createRefComponent

```typescript
function createRefComponent<T = any>(
  Component: React.ComponentType<any>
): Promise<[React.RefObject<T>, () => void]>
```

**Parameters:**

- `Component: React.ComponentType<any>` - Component to create

**Returns:**

- `Promise<[React.RefObject<T>, () => void]>` - Returns a tuple containing the component's ref object and destroy function

## 🎯 Advanced Features

### Custom Modal Types

You can create custom modal types for any component:

```jsx
import { useCommonRef, mergeModalType } from 'use-modal-ref';

// Register a custom modal type
mergeModalType({
  tooltip: {
    visible: 'open',
    onClose: 'onOpenChange',
  }
});

// Create custom hook
const useTooltipRef = (ref, defaultData, options, deps = []) => 
  useCommonRef('tooltip', ref, defaultData, options, deps);
```

### Before/After Hooks

```jsx
const { modal, data } = useModalRef(ref, defaultData, {
  beforeModal: async (data) => {
    // Called before modal opens
    console.log('Opening modal with data:', data);
    return data; // Can modify data
  },
  afterModal: (result) => {
    // Called after modal closes
    console.log('Modal closed with result:', result);
  }
});
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ by the use-modal-ref community

</div>

