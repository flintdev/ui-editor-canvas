export interface Operations {
    addComponent?: (componentData: ComponentData) => void,
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
    draggableRootStyle?: Function
}

export type Components = Array<ComponentData>;