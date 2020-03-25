export {Props as UIEditorCanvasProps} from  "./UIEditorCanvas";

export interface Operations {
    addComponent?: (componentData: ComponentData) => void,
    updateComponents?: (components: ComponentData[]) => void
    selectComponentById?: (componentId: string) => void,
    deleteComponentById?: (componentId: string) => void,
    onDragEnd?: Function
}

export interface EditorLib {
    getWidget: (name: string, props: object) => React.ReactElement
}

export interface ComponentData {
    id: string | number,
    name: string,
    params: object,
    children?: Array<ComponentData>,
    path?: Array<string | number>,
    tag?: string,
    isDraggable?: boolean,
    droppableContainerStyle?: Function,
    draggableRootStyle?: Function,
    dragableOnMouseDown?: Function
}

export type Components = Array<ComponentData>;