# ui-editor

```jsx
this.operations = {};
const components = [];  // tree structure

<UIEditor
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
  reactComponent: React.ElementComponent,
  editableParams: object[],
  displayData: object,
}
```
