# ui-editor-canvas

```jsx
this.operations = {};
const components = [];  // tree structure

<UIEditorCanvas
  operations={this.operations}
  components={components} // tree sturcture
  editorLib={editorLib} 
  componentsUpdated={(components) => {}}
  componentOnSelect={(componentData) => {}}
  componentOnDelete={(componentData) => {}}
/>
```

```typescript
interface Operations {
  addComponent: (componentData) => void,
}

interface EditorLib {
  generateEditableReactComponent: (name: string, params: object) => void
}

interface ComponentData {
  id: string|number,
  name: string,
  params: object,
  children: Array<ComponentData>
}

type Components = Array<ComponentData>;
```
