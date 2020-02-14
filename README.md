# ui-editor-canvas

```jsx
this.operations: Operations = {};
const components: Components = [];  // tree structure

<UIEditorCanvas
  operations={this.operations}
  components={components} // tree structure
  editorLib={editorLib} 
  componentsUpdated={(components: Components) => {}}
  componentOnSelect={(componentData: ComponentData) => {}}
  componentOnDelete={(componentData: ComponentData) => {}}
/>
```

```typescript
interface Operations {
  addComponent?: (componentData: ComponentData) => void,
}

interface EditorLib {
  getWidget: (name: string, props: object) => void
}

interface ComponentData {
  id: string|number,
  name: string,
  params: object,
  children?: Array<ComponentData>,
  path?: Array<string|number>,
  tag?: string
}

type Components = Array<ComponentData>;
```
