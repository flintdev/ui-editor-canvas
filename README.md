# ui-editor-canvas

```jsx
this.operations = {};
const components = [];  // tree structure

<UIEditorCanvas
  operations={this.operations}
  components={components} // tree sturcture
  componentsUpdated={(components) => {}}
  componentOnSelect={(componentData) => {}}
  componentOnDelete={(componentData) => {}}
/>
```

```typescript
interface Operations {
  addComponent: (componentData) => void,
}

interface ComponentData {
  id: string|number,
  name: string,
  editableParams: object[],
  displayData: object,
}
```
