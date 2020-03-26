// ~/github/flintdev/ui-editor-canvas/src/UIEditorCanvas/UIEditorCanvas.tsx

import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { WidgetName, WidgetProps, getWidget } from "@flintdev/material-widgets";
import { ComponentData, Operations, Components, EditorLib } from "./interface";
import { HotKeys } from "react-hotkeys";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

const mainGrid = {
    id: `main`,
    name: WidgetName.Grid,
    params: {
        container: true,
        columnCount: 1,
        style: {
            height: 'inherit'
        }
    },
    isDraggable: false,
    children: [],
    path: [],
    tag: '',
    droppableContainerStyle: (isDraggingOver: boolean) => {
        return {
            // backgroundColor: isDraggingOver ? '#9867f7' : (true ? '#bca2ef' : 'white'),
            backgroundColor: '#bca2ef',
            height: '100%'
        }
    },
    draggableRootStyle: () => {
        return {
            height: 'inherit'
        }
    },
    dragableOnMouseDown: () => {}
};

const keyMap = {
    DELETE_NODE: ["del", "backspace"]
};

const styles = createStyles({
    actionIcon: {
        fontSize: 20,
        color: 'white',
        margin: 7,
        cursor: `pointer`
    },
    actionContainerOther: {
        display: `flex`,
        flexDirection: `row`,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: "#13c2c2",
        borderRadius: `0 0 0 8px`,
    }
});

export interface Props extends WithStyles<typeof styles>{
    isDnd?: boolean,
    operations: Operations,
    components: ComponentData[],
    editorLib: EditorLib,
    componentsUpdated: (components: Components) => void,
    componentOnSelect: (componentData: ComponentData) => void,
    componentOnDelete: (componentData: ComponentData) => void
}

const ActionWrapper = (props: any) => {
    return <div {...props}>{props.children}</div>
}
const HotkeyWarpper = (props: any) => (
    <HotKeys keyMap={keyMap} style={{height: 'inherit'}}>
        <HotKeys handlers={props.handlers} style={{outline: 0, height: 'inherit'}}>
           {props.children}
        </HotKeys>
    </HotKeys>
)

class UIEditorCanvas extends React.Component<Props, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            components: [],
            selectedId: ""
        }

        this.addComponent = this.addComponent.bind(this);
        // this.onDragEnd = this.onDragEnd.bind(this);
        this.selectComponentById = this.selectComponentById.bind(this);
        this.deleteComponentById = this.deleteComponentById.bind(this);
        this.updateComponents = this.updateComponents.bind(this);
    }

    onDragEnd = (result: any) => {
        // console.log('>>> onDragEnd.result', result);
        let { source } = result; 
        const {destination, draggableId, isValid, dragToCreate, dragComponentData } = result;
        if (!isValid) return;
        if (!destination) return;
        const [sourceDroppableId, sourceContainer] = (source.droppableId || "").split("::");
        const [destinationDroppableId, destinationContainer] = (destination.droppableId || "").split("::");
        let [sourceComponent, destinationComponent, curComponent] = Array(3);

        if (destinationDroppableId === draggableId) return;

        if (dragToCreate) {
            curComponent = dragComponentData
        } else {
            const search = (nodes: any[]) => {
                for (let node of nodes) {
                    if (node.id === draggableId) {
                        curComponent = node;
                        return;
                    }
                    search(node.children)
                }
            };
            search(this.state.components);
        }

        const update = (nodes: any[]) => {
            for (let node of nodes) {
                if (node.id === draggableId) continue  
                if (node.id === sourceDroppableId) {
                    node.children = node.children.filter((child: any) => child.id !== draggableId);
                }
                if (node.id === destinationDroppableId) {

                    // find the insertIndex with destination.index and child.tag
                    let countBefore = destination.index;
                    let insertIndex = 0;
                    if (countBefore > 0) {
                        for (let i = 0; i < node.children.length; i++) {
                            const child = node.children[i];
                            
                            if (child.tag === destinationContainer) {
                                countBefore -= 1;
                                if (countBefore === 0) {
                                    insertIndex = i + 1;
                                    break;
                                }
                            }
                        }
                    }

                    node.children.splice(insertIndex, 0, { ...curComponent, tag: destinationContainer });
                }
                node.children = update(node.children)
            }
            return nodes;
        };

        let newComponents = JSON.parse(JSON.stringify(update(this.state.components)));

        if (sourceDroppableId === 'main') {
            newComponents = newComponents.filter((child: any) => child.id !== draggableId);
        }
        if (destinationDroppableId === 'main') {
            newComponents.splice(destination.index, 0, { ...curComponent, tag: destinationContainer });
        }
        this.handleComponentsUpdated(newComponents)
    };


    handleDupWidget(e: any, component: ComponentData, droppableId: string, index: number, tag: string) {
        e.stopPropagation();
        const copyComponent = (component: any) => {
            return {
                ...component,
                id: `${component.id}-${(new Date().getTime()).toString(36)}`,
                children: (component?.children || []).map((child: any) => copyComponent(child))
            }
        }
        this.onDragEnd(
            {
                draggableId: "",
                isValid: true,
                dragToCreate: true,
                source: {},
                dragComponentData: copyComponent(component),
                destination: {
                    droppableId: droppableId + (!!tag ? `::${tag}` : ""),
                    index
                }
            }
        )
    }

    handleComponentsUpdated(newComponents: any[]) {
        this.setState({ components: newComponents })
        this.props.componentsUpdated(newComponents);
    }

    handlers = {
        DELETE_NODE: () => {
            if (this.state.selectedId) {
                this.handleComponentOnDeleteById(this.state.selectedId)
            }
        }
    };

    handleComponentOnDeleteById(componentId: string) {
        let nodeToDelete = {};
        const update = (nodes: any[]) => {
            return nodes.reduce((ret, node) => {
                if (node.id === componentId) {
                    nodeToDelete = {...node}
                } else {
                    node.children = update(node.children)
                    ret.push(node);
                }
                return ret;
            }, []);
        };
        this.handleComponentsUpdated(
            update(this.state.components)
        )
        this.props.componentOnDelete({ ...nodeToDelete } as ComponentData)
    }

    componentDidMount() {
        this.handleComponentsUpdated(this.props.components)
        this.props.operations.addComponent = this.addComponent;
        this.props.operations.selectComponentById = this.selectComponentById;
        this.props.operations.deleteComponentById = this.deleteComponentById;
        this.props.operations.updateComponents = this.updateComponents;
        this.props.operations.onDragEnd = this.onDragEnd;
    }

    selectComponentById(componentId: string) {
        this.setState({ selectedId: componentId })
    }

    deleteComponentById(componentId: string) {
        this.handleComponentOnDeleteById(componentId)
    }

    updateComponents(components: any[]) {
        this.handleComponentsUpdated(components)
    }

    addComponent(componentData: ComponentData) {
        this.handleComponentsUpdated([componentData, ...this.state.components])
    }

    renderComponents(components: Array<ComponentData>, prevPath: any[] = []): Array<React.ReactElement> {
        const { editorLib, componentOnSelect, classes, isDnd } = this.props;
        const handleClick = (e: any, component: any) => {
            e.stopPropagation();
            componentOnSelect(component);
            this.setState({ selectedId: component.id })
        }
        const cleanParmas = (parmas: object) => {
            return Object.keys(parmas).reduce<Record<string, any>>((ret, key) => {
                if (typeof Object(parmas)[key] === "string") {
                    if (Object(parmas)[key].split("::")[2] === 'displayValue') {
                        ret[key] = JSON.parse(Object(parmas)[key].split("::")[3]);
                        return ret;
                    }
                }

                ret[key] = Object(parmas)[key];
                return ret;
            }, {});
        }

        return components.map((component: ComponentData, index: number) => {
            const newPath = prevPath.concat(component!.id.toString());
            const { droppableContainerStyle, isDraggable, draggableRootStyle, dragableOnMouseDown } = component;
            const handleClickWithComponent = (e: any) => {
                e.stopPropagation();
                handleClick(e, component)
            }
            const RenderedComponent: React.ReactElement = editorLib.getWidget(component.name, {
                ...component,
                params: cleanParmas(component.params),
                draggableProps: {
                    draggableId: component.id as string,
                    index: index,
                    isDraggable: isDraggable
                },
                dnd: isDnd,
                onDragEnd: (data: any) => this.onDragEnd(data),
                draggableRootStyle: !!draggableRootStyle ?
                    () => draggableRootStyle() :
                    () => {
                        return {
                            backgroundColor: component.name === "Grid" ? '#e0d8ef' : 'white',
                            padding: 5,
                            boxShadow: this.state.selectedId === component.id ? `inset 0px 0px 0px 5px #13c2c2` : "inset 0px 0px 0px 5px #0000ff00",
                            transition: `all .5s`,
                            border: `1px solid grey`,
                            margin: 1
                        }
                    },
                droppableContainerStyle: !!droppableContainerStyle ?
                    (isDraggingOver: boolean) => droppableContainerStyle(isDraggingOver) :
                    (isDraggingOver: boolean) => {
                        return {
                            // backgroundColor: isDraggingOver ? '#9867f7' : (component.name === "Grid" ? '#bca2ef' : 'white'),
                            backgroundColor: component.name === "Grid" ? '#bca2ef' : 'white',
                            minHeight: 60,
                            margin: 5,
                            border: `15px solid #bca2ef`
                        }
                    },
                onMouseDown: !!dragableOnMouseDown ? (e: any) => dragableOnMouseDown(e): (e: any) => handleClickWithComponent(e),
                children: this.renderComponents(!!component.children ? component.children : [], newPath)
            })
            return this.state.selectedId !== component.id ? 
                React.cloneElement(RenderedComponent, { key:  component.id }) :

                    <ActionWrapper
                        style={{position: "relative"}}
                        key={`ComponentWrapper-${index}`}
                        tag={component.tag}
                        id={newPath[newPath.length - 2]}
                    >
                        {React.cloneElement(RenderedComponent, { key:  component.id })}
                        <div className={classes.actionContainerOther}>
                            <FileCopyOutlinedIcon className={classes.actionIcon} onMouseDown={(e: any) => this.handleDupWidget(e, component, newPath[newPath.length - 2], index+1, component.tag || "")}/>
                            <HighlightOffIcon className={classes.actionIcon} onMouseDown={() => this.deleteComponentById(component.id as string)}/>
                        </div>
                    </ActionWrapper>
        })
    }

    render() {
        return (
            <HotkeyWarpper handlers={this.handlers}>
                {this.renderComponents([{...mainGrid, children: this.state.components}])}
            </HotkeyWarpper>
        )
    }
}

export default withStyles(styles)(UIEditorCanvas);