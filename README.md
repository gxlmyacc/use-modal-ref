# use-modal-ref

react hooks for modal/drawer usage

## install

```bash
npm install --save use-modal-ref
```
or
```bash
yarn add use-modal-ref
```

## usage

### used with `Modal`:
```js
// test modal
import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import useModalRef from 'use-modal-ref';

const TestModal = React.forwardRef((props = {}, ref) => {
  const [inputValue, setInputValue] = useState('');

  const {
    modal,
    data: {
      title,
      label = 'default label'
    },
  } = useModalRef(ref, {}, {
    beforeModal: async (data = {}) => {
      if (!data.title) data.title = 'default title';
    },
  });

  const doOK = async () => {
    modal.endModal(inputValue);
  };

  const doCancel = async () => {
    modal.cancelModal();
  };

  return (
    <Modal
      {...modal.props}
      title={title}
      footer={(
        <>
          <Button onClick={doOK}>OK</Button>
          <Button onClick={doCancel}>Cancel</Button>
        </>
      )}
    >
      <div>{label}</div>
      <Input 
        value={inputValue} 
        onChange={e => setInputValue(e.target.value)} 
      />
    </Modal>
  );
});

export default TestModal;
```
```js
// test
import React, { useState } from 'react';
import { Button } from 'antd';
import TestModal from './TestModal';

function Test(props) {
  const [$refs] = useState({
    testModal: null
  });

  const showTestModal = async () => {
    const inputValue = await $refs.testModal.modal({
      label: 'please input value:'
    });
    alert('input value is: ' + inputValue);
  }

  return (
    <div>
      <Button onClick={showTestModal}>show modal</Button>
      <TestModal ref={r => r && ($refs.testModal = r)} />
    </div>
  );
}

export default Test;
```


### used with `Drawer`:
```jsx
// test drawer
import React, { useState } from 'react';
import { Drawer, Button, Input } from 'antd';
import { useDrawerRef } from 'use-modal-ref';

const TestDrawer = React.forwardRef((props = {}, ref) => {
  const [inputValue, setInputValue] = useState('');

  const {
    modal,
    data: {
      title,
      label,
      desc
    },
  } = useDrawerRef(ref, {
    title: 'default title',
    label: 'default label'
  }, {
    beforeModal: async (data = {}) => {
      return {
        ...data,
        desc: 'desc'
      }
    },
  });

  const doOK = async () => {
    modal.endModal(inputValue);
  };

  const doCancel = async () => {
    modal.cancelModal();
  };

  return (
    <Drawer
      {...modal.props}
      title={title}
      footer={(
        <>
          <Button onClick={doOK}>OK</Button>
          <Button onClick={doCancel}>Cancel</Button>
        </>
      )}
    >
      <div>{label}</div>
      <div>{desc}</div>
      <Input 
        value={inputValue} 
        onChange={e => setInputValue(e.target.value)} 
      />
    </Drawer>
  );
});

export default TestDrawer;
```
```jsx
// test
import React, { useState } from 'react';
import { Button } from 'antd';
import TestDrawer from './TestDrawer';

function Test(props) {
  const [$refs] = useState({
    testDrawer: null
  });

  const showTestDrawer = async () => {
    const inputValue = await $refs.testDrawer.modal({
      label: 'please input value:'
    });
    alert('input value is: ' + inputValue);
  }

  return (
    <div>
      <Button onClick={showTestDrawer}>show drawer</Button>
      <TestDrawer ref={r => $refs.testDrawer = r} />
    </div>
  );
}

export default Test;
```

### used with `showRefModal`:
```jsx
// test
import React from 'react';
import { Button } from 'antd';
import TestModal from './TestModal';
import { showRefModal } from 'use-modal-ref';

function Test(props) {
  const showTestModal = async () => {
    const inputValue = await showRefModal(TestModal, {
      label: 'please input value:'
    });
    alert('input value is: ' + inputValue);
  }

  return (
    <div>
      <Button onClick={showTestModal}>show modal</Button>
    </div>
  );
}

export default Test;
```

### used with `createRefComponent`:
```jsx
// test
import React from 'react';
import { Button } from 'antd';
import TestModal from './TestModal';
import { createRefComponent } from 'use-modal-ref';

function Test(props) {
  const showTestModal = async () => {
    const [ref, destory] = await createRefComponent(TestModal);
    try {
      const inputValue = await ref.modal(TestModal, {
          label: 'please input value:'
        });
      alert('input value is: ' + inputValue);
    } finally {
      destory();
    }
  }

  return (
    <div>
      <Button onClick={showTestModal}>show modal</Button>
    </div>
  );
}

export default Test;
```

## License

[MIT](./LICENSE)

