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
  generateWidgetReactComponent: (name: string, params: object) => void
}

interface ComponentData {
  id: string|number,
  name: string,
  params: object,
  children?: Array<ComponentData>,
  path: Array<string|number>,
  tag: string
}

type Components = Array<ComponentData>;
```
