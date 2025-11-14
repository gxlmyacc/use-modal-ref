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
  const modalRef = useRef(null);

  const showModal = async () => {
    const result = await modalRef.current.modal({
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
      <TestModal ref={modalRef} />
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
    beforeModal({ user }) {
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
  const userModalRef = useRef(null);

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
      <UserModal ref={userModalRef} />
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
  const settingsRef = useRef(null);

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
      <SettingsDrawer ref={settingsRef} />
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
  const colorRef = useRef(null);

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
      <ColorPickerPopover ref={colorRef}>
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

**Parameters:**

- `ref: React.Ref<any>` - React ref object for controlling modal show/hide. Must be passed to the modal component via `React.forwardRef`
- `defaultData?: Partial<T> | (() => Partial<T>)` - Default data, can be an object or a function returning an object. When using a function, it supports lazy initialization and only executes when needed
- `options?: ModalRefOption<'modal', T, U, C>` - Configuration options object with the following properties:
  - `alwaysResolve?: boolean` - Whether to always resolve the Promise, even when `cancelModal` is called
  - `custom?: C` - Custom properties object, these properties will be added to the returned `modal` object. You can access these custom methods or properties via ref. **Important**: The type information of methods or properties registered in `custom` will be bound to `ModalRef`, providing full TypeScript type support and ensuring type safety
  
  **custom parameter usage example:**
  
  ```tsx
  import React, { useState, useRef } from 'react';
  import { Modal } from 'antd';
  import useModalRef, { ModalRef } from 'use-modal-ref';
  
  const TestModal = React.forwardRef((props, ref) => {
    const [formData, setFormData] = useState({});
    
    // Define custom methods in the component
    const resetForm = () => {
      setFormData({});
      console.log('Form reset');
    };
    
    const validate = () => {
      // Validation logic
      return Object.keys(formData).length > 0;
    };
    
    const getFormData = () => {
      return formData;
    };
    
    const { modal, data } = useModalRef<{ title: string }, any>(
      ref,
      {
        title: 'Default Title'
      },
      {
        // Register these methods in custom
        // TypeScript will automatically infer types from the custom object, no need to explicitly define an interface
        custom: {
          resetForm,
          validate,
          getFormData
        }
      }
    );
    
    // Inside the component, you can access custom methods via modal.resetForm(), modal.validate(), etc.

    const handleReset = () => {
      modalRef.current?.resetForm(); // Call custom method, TypeScript provides type hints
    };
    
    const handleValidate = () => {
      const isValid = modalRef.current?.validate(); // Call custom method, return type is boolean
      console.log('Validation result:', isValid);
    };
    
    return (
      <Modal {...modal.props} title={data.title}>
        {/* Modal content */}
        <button onClick={handleReset}>Reset Form</button>
        <button onClick={handleValidate}>Validate Form</button>
      </Modal>
    );
  });
  
  // When using the component, you can access custom methods via ref
  // TypeScript will automatically infer types from the custom parameter in useModalRef,
  // modalRef.current will automatically have type definitions for resetForm, validate, getFormData methods
  // This provides full type hints and type checking, ensuring type safety
  function App() {
    const modalRef = useRef<ModalRef<'modal'>>['modal']>(null);
    
    return (
      <div>
        <button onClick={() => modalRef.current?.modal({ title: 'Test' })}>
          Open Modal
        </button>
        <TestModal ref={modalRef} />
      </div>
    );
  }
  ```
  
  - `beforeModal?: (newData: Partial<T>, pause: (result: any, isError?: boolean) => void, options: Record<string, any>) => void | Partial<T> | Promise<void | Partial<T>>` - Hook function called before modal opens, can modify data or pause the opening process
  - `afterModal?: (newData: T, options?: ModalModalOptions) => void` - Hook function called after modal opens
  - `init?: (newData: T, options: Record<string, any>) => void | Promise<void>` - Initialization hook function, executed after modal opens
  - `beforeCloseModal?: (next: (ok: any) => void, action: ModalAction, modal: ModalRef<'modal', T, U, C>) => void | Promise<void>` - Hook function called before modal closes, can prevent closing by calling `next(false)`
  - `afterCloseModal?: (newData: T, action: ModalAction, modal: ModalRef<'modal', T, U, C>) => void | Promise<void>` - Hook function called after modal closes
- `deps?: React.DependencyList` - Dependency array, reinitializes options when dependencies change

**Returns:**

- `modal: ModalRef<'modal', T, U, C>` - Modal control object with the following properties and methods:
  - `visible: boolean` - Read-only property indicating whether the modal is visible
  - `data: T` - Read-only property containing current modal data
  - `props: { visible: boolean, onCancel: () => void }` - Read-only property for props to pass to Modal component
  - `options: ModalRefOption<'modal', T, U, C>` - Read-only property containing current configuration options
  - `modalOptions: ModalModalOptions` - Read-only property containing current modal options
  - `modalPromise: Promise<U> | null` - Read-only property containing current modal Promise
  - `modal(newData: T, options?: ModalModalOptions): Promise<U>` - Opens the modal and returns a Promise
  - `endModal(result?: U, onDone?: () => void): Promise<void>` - Ends the modal and returns result
  - `cancelModal(ex?: any, onDone?: () => void): Promise<void>` - Cancels the modal
- `data: T` - Current modal data (same as `modal.data`)
- `setData: (newData: T | ((data: T) => T)) => void` - Function to update modal data

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
function showRefModal<
  M extends ModalRef<any, any>,
  D extends M extends ModalRef<any, infer D> ? D : Record<string, any>,
  U extends M extends ModalRef<any, any, infer U> ? U : any
>(
  RefModal: React.ForwardRefExoticComponent<React.RefAttributes<M>>,
  modalData?: D,
  options?: {
    /** Component props */
    props?: Record<string, any>;
    /** Method name to call modal, defaults to 'modal' */
    modalMethod?: string;
    /** Method name to cancel modal, defaults to 'cancelModal' */
    cancelMethod?: string;
    /** Modal options */
    modalOptions?: ModalModalOptions;
    /** Whether to automatically close modal when URL changes */
    closeWhenUrlChange?: boolean;
    /** Container selector */
    selector?: string;
    /** Container ID */
    id?: string;
    /** Container element or function returning container */
    container?: HTMLElement | null | (() => HTMLElement);
    /** Container class name */
    className?: string;
    /** Callback after ref is created */
    onRef?: (ref: any, destroy: () => void) => void;
    /** Callback before container is appended, return true to prevent auto append */
    onAppendContainer?: (container: HTMLElement) => void | boolean;
    /** Callback before container is removed, return true to prevent auto remove */
    onRemoveContainer?: (container: HTMLElement) => void | boolean;
    /** Callback before component is destroyed, return true to prevent auto destroy */
    onDestroyComponent?: (container: HTMLElement) => void | boolean;
    /** Destroy delay in milliseconds, defaults to 50 */
    destroyDelay?: number;
  }
): Promise<U>
```

**Parameters:**

- `RefModal: React.ForwardRefExoticComponent<React.RefAttributes<M>>` - Modal component to display, must be wrapped with `React.forwardRef`
- `modalData?: D` - Data to pass to the modal, will be passed as the first argument to the `modal` method
- `options?: object` - Configuration options object with the following properties:
  - `props?: Record<string, any>` - Props to pass to the component
  - `modalMethod?: string` - Method name to call modal, defaults to `'modal'`
  - `cancelMethod?: string` - Method name to cancel modal, defaults to `'cancelModal'`
  - `modalOptions?: ModalModalOptions` - Modal options, will be passed as the second argument to the `modal` method
  - `closeWhenUrlChange?: boolean` - Whether to automatically close modal when URL changes, defaults to `false`
  - `selector?: string` - Container selector for finding existing container element
  - `id?: string` - Container ID for finding or creating container element
  - `container?: HTMLElement | null | (() => HTMLElement)` - Container element or function returning container
  - `className?: string` - Container class name, only used when creating new container
  - `onRef?: (ref: any, destroy: () => void) => void` - Callback function after ref is created
  - `onAppendContainer?: (container: HTMLElement) => void | boolean` - Callback before container is appended to DOM, return `true` to prevent auto append
  - `onRemoveContainer?: (container: HTMLElement) => void | boolean` - Callback before container is removed from DOM, return `true` to prevent auto remove
  - `onDestroyComponent?: (container: HTMLElement) => void | boolean` - Callback before component is destroyed, return `true` to prevent auto destroy
  - `destroyDelay?: number` - Destroy delay in milliseconds, defaults to `50`

**Returns:**

- `Promise<U>` - Returns modal result Promise, will be rejected if user cancels

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
    /** Container selector */
    selector?: string;
    /** Container ID */
    id?: string;
    /** Container element or function returning container */
    container?: HTMLElement | null | (() => HTMLElement);
    /** Container class name */
    className?: string;
    /** Callback after ref is created */
    onRef?: (ref: any, destroy: () => void) => void;
    /** Callback before container is appended, return true to prevent auto append */
    onAppendContainer?: (container: HTMLElement) => void | boolean;
    /** Callback before container is removed, return true to prevent auto remove */
    onRemoveContainer?: (container: HTMLElement) => void | boolean;
    /** Callback before component is destroyed, return true to prevent auto destroy */
    onDestroyComponent?: (container: HTMLElement) => void | boolean;
    /** Destroy delay in milliseconds, defaults to 50 */
    destroyDelay?: number;
  }
): Promise<[ref: R, destroy: () => void]>
```

**Parameters:**

- `RefComponent: T` - Component to create, must be wrapped with `React.forwardRef`
- `props?: P | null` - Props to pass to the component
- `options?: object` - Configuration options object with the following properties:
  - `selector?: string` - Container selector for finding existing container element. If found, will use that container; otherwise creates a new one
  - `id?: string` - Container ID for finding or creating container element. If found, will use that container; otherwise creates a new one and sets this ID
  - `container?: HTMLElement | null | (() => HTMLElement)` - Container element or function returning container. If provided, will use this container directly
  - `className?: string` - Container class name, only used when creating new container
  - `onRef?: (ref: any, destroy: () => void) => void` - Callback function after ref is created, receives ref object and destroy function
  - `onAppendContainer?: (container: HTMLElement) => void | boolean` - Callback function before container is appended to DOM, return `true` to prevent auto append to `document.body`
  - `onRemoveContainer?: (container: HTMLElement) => void | boolean` - Callback function before container is removed from DOM, return `true` to prevent auto remove
  - `onDestroyComponent?: (container: HTMLElement) => void | boolean` - Callback function before component is destroyed, return `true` to prevent auto call to `ReactDOM.unmountComponentAtNode`
  - `destroyDelay?: number` - Destroy delay in milliseconds, defaults to `50`. Used to delay destroy operation to avoid incomplete animations

**Returns:**

- `Promise<[ref: R, destroy: () => void]>` - Returns a Promise that resolves to a tuple:
  - `ref: R` - Component's ref object containing all methods and properties exposed by the component
  - `destroy: () => void` - Destroy function that will unmount the component and remove the container (if container was auto-created)

### ModalRef

`ModalRef` is the type definition for the modal control object, containing the following properties and methods:

```typescript
type ModalRef<
  P extends ModalType = 'modal',
  T extends Record<string, any> = Record<string, any>,
  U = any,
  C extends Record<string, any> = {}
> = {
  /** Read-only property: whether modal is visible */
  readonly visible: boolean;
  /** Read-only property: current modal data */
  readonly data: Partial<Omit<T, 'onCancel'|'onOK'>> & { [key: string]: any };
  /** Read-only property: props to pass to Modal/Drawer component */
  readonly props: ModalPropsTypeMap[P];
  /** Read-only property: current configuration options */
  readonly options: ModalRefOption<P, T, U, C>;
  /** Read-only property: current modal options */
  readonly modalOptions: ModalModalOptions;
  /** Read-only property: current modal Promise */
  readonly modalPromise: null | Promise<any> | PromiseLike<any>;

  /** Opens modal and returns Promise */
  modal(newData: T, options?: ModalModalOptions): Promise<U>;

  /** Ends modal and returns result */
  endModal: (result?: U, onDone?: () => void) => Promise<void>;
  
  /** Cancels modal */
  cancelModal: (ex?: any, onDone?: () => void) => Promise<void>;

  [key: string]: any;
} & {
  [key in keyof C]: C[key];
}
```

**Property Descriptions:**

- `visible: boolean` - Read-only property indicating whether the modal is currently visible
- `data: T` - Read-only property containing the current modal data object
- `props: ModalPropsTypeMap[P]` - Read-only property returning appropriate props based on modal type:
  - For `'modal'` type: `{ visible: boolean, onCancel: () => void }`
  - For `'drawer'` type: `{ open?: boolean, onClose?: () => void }`
  - For `'popover'` type: `{ visible: boolean, onClose: () => void }`
- `options: ModalRefOption<P, T, U, C>` - Read-only property containing current configuration options
- `modalOptions: ModalModalOptions` - Read-only property containing current modal options
- `modalPromise: Promise<U> | null` - Read-only property containing current modal Promise, `null` if modal is not open

**Method Descriptions:**

- `modal(newData: T, options?: ModalModalOptions): Promise<U>` - Method to open the modal
  - `newData: T` - New data to pass to the modal, will be merged with `defaultData`
  - `options?: ModalModalOptions` - Modal options with the following properties:
    - `modalDataEvent?: boolean` - Whether to enable data events (`onOK`, `onCancel`)
    - `afterModal?: (newData: any, options?: ModalModalOptions) => void` - Hook after modal opens
    - `beforeCloseModal?: (next: (ok: any) => void, action: ModalAction) => void | Promise<void>` - Hook before close
    - `beforeEndModal?: (value?: any) => Promise<any>` - Hook before end, can modify return value
    - `beforeCancelModal?: (reason?: any) => Promise<any>` - Hook before cancel, can modify cancel reason
    - `afterCloseModal?: (newData: any, action: ModalAction, modal: ModalRef<any, any, any>) => void | Promise<void>` - Hook after close
    - `forceVisible?: boolean` - Force show, even if another modal is already open
    - `alwaysResolve?: boolean` - Whether to always resolve the Promise
  - Returns `Promise<U>`, resolves with result, rejects when cancelled
- `endModal(result?: U, onDone?: () => void): Promise<void>` - Ends the modal
  - `result?: U` - Result value to return
  - `onDone?: () => void` - Callback function after completion
- `cancelModal(ex?: any, onDone?: () => void): Promise<void>` - Cancels the modal
  - `ex?: any` - Cancel reason, defaults to `'cancel'`
  - `onDone?: () => void` - Callback function after completion

### getUrlListener

Gets the URL listener instance for listening to browser URL changes.

```typescript
function getUrlListener(): UrlListener

interface UrlListener {
  addListener: (
    listener: (url: string) => void,
    options?: { once?: boolean }
  ) => () => void;
}
```

**Returns:**

- `UrlListener` - URL listener object with the following method:
  - `addListener(listener: (url: string) => void, options?: { once?: boolean }): () => void` - Adds a URL change listener
    - `listener: (url: string) => void` - Listener function called when URL changes, receives new URL as parameter
    - `options?: { once?: boolean }` - Options object, when `once` is `true`, listener executes only once
    - Returns a function to remove the listener

**Usage Example:**

```typescript
import { getUrlListener } from 'use-modal-ref';

const urlListener = getUrlListener();

// Add listener
const removeListener = urlListener.addListener((url) => {
  console.log('URL changed to:', url);
}, { once: true });

// Remove listener
removeListener();
```

## 📘 TypeScript Support

This library is written in TypeScript and provides full type definitions out of the box.

### Type Safety

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
    title: 'Default Title',
    label: 'Default Label'
  });
  
  // TypeScript will ensure data conforms to ModalData
  // and modal callbacks return ModalResult
});
```

### Strict Mode Support

The library fully supports React's strict mode and concurrent features.

## ⚠️ Error Handling

Handle potential errors in your modal interactions:

```jsx
const showModal = async () => {
  try {
    const result = await modalRef.current.modal(data);
    if (result !== undefined) {
      // Handle success
      console.log('Modal result:', result);
    } else {
      // Handle cancel/dismiss
      console.log('Modal was cancelled');
    }
  } catch (error) {
    // Handle errors during modal operations
    console.error('Modal error:', error);
  }
};
```

## ⚡ Performance Optimization

### Dependency Array Usage

Use the dependency array to optimize re-renders:

```jsx
const { modal, data } = useModalRef(ref, defaultData, options, [dep1, dep2]);
```

### Lazy Initialization

For expensive initializations, use function form of defaultData:

```jsx
const { modal, data } = useModalRef(ref, () => {
  // Expensive computation only runs when needed
  return {
    title: getLocalizedTitle(),
    items: generateInitialItems()
  };
});
```

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

We welcome all contributions! Here's how you can help:

1. **Report bugs** - Use the issue tracker to report bugs
2. **Suggest features** - Propose new features or improvements
3. **Submit PRs** - Fix bugs or implement new features


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## ❓ FAQ

### Why use refs instead of state for modal control?

Refs provide direct access to modal methods without triggering re-renders, making the API more efficient and easier to use.

### How to handle multiple modals?

Each modal should have its own ref:

```jsx
function App() {
  const modal1Ref = useRef(null);
  const modal2Ref = useRef(null);
  
  return (
    <>
      <MyModal ref={modal1Ref} />
      <AnotherModal ref={modal2Ref} />
    </>
  );
}
```

### Can I use this with other UI libraries?

Yes! The library is UI-agnostic. Here's an example with Material-UI:

```jsx
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import useModalRef from 'use-modal-ref';

const MaterialModal = React.forwardRef((props, ref) => {
  const { modal, data } = useModalRef(ref, { title: 'Dialog' });
  
  return (
    <Dialog {...modal.props} open={modal.props.visible}>
      <DialogTitle>{data.title}</DialogTitle>
      <DialogContent>
        {/* Your content */}
      </DialogContent>
    </Dialog>
  );
};
```

