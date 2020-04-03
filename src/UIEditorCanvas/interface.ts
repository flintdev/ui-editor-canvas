export {Props as UIEditorCanvasProps} from  "./UIEditorCanvas";

export interface Operations {
    addComponent?: (componentData: ComponentData) => void,
    updateComponents?: (components: ComponentData[]) => void
    selectComponentById?: (componentId: string) => void,
    deleteComponentById?: (componentId: string) => void,
    onDragEnd?: Function
}

export interface CustomConfig {
    selectedColor?: string, 
    gridColor?: string, 
    dragWeigtPadding?: number,
    dropContainerMargin?: number,
    containerColor?: string,
    containerMinHeight?: number,
}

export interface EditorLib {
    getWidget: (name: string, props: object) => React.ReactElement
}

export interface ComponentData {
    id: string | number,
    name: string,
    params: object,
    canvas?: {
        display?: string
    },
    children?: Array<ComponentData>,
    path?: Array<string | number>,
    tag?: string,
    isDraggable?: boolean,
    droppableContainerStyle?: Function,
    draggableRootStyle?: Function,
    dragableOnMouseDown?: Function
}

export type Components = Array<ComponentData>;