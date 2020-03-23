// ~/github/flintdev/ui-editor-canvas/src/UIEditorCanvas/UIEditorCanvas.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { WidgetName, WidgetProps } from "@flintdev/material-widgets";
import { ComponentData } from "./interface";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import OpenWithIcon from '@material-ui/icons/OpenWith';

const styles = createStyles({
    root: {
        position: 'relative',
        '&:hover': {
            '& $actions': {
                opacity: 1
            },
        },
    },
    actions: {
        position: 'absolute',
        background: `lightgrey`,
        border: `1px solid #ddd`,
        top: 0,
        left: 0,
        height: `100%`,
        width: `100%`
    },
    actionsSelectedGrid: {
        position: 'absolute',
        background: `transparent`,
        border: `1px solid #ddd`,
        top: 0,
        left: 0,
        height: `100%`,
        width: `100%`,
        '&:before': {
            content: "\"\"",
            backgroundColor: '#9867f7',
            height: 5,
            position: 'absolute',
            width: '100%',
        }
    },
    actionsSelectedOther: {
        position: 'absolute',
        background: `transparent`,
        border: `1px solid #ddd`,
        top: 0,
        left: 0,
        height: `100%`,
        width: `100%`,
        '&:before': {
            content: "\"\"",
            backgroundColor: "#13c2c2",
            height: 5,
            position: 'absolute',
            width: '100%',
        }
    },
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
        backgroundColor: "#13c2c2",
        borderRadius: `0 0 0 8px`,
    },
    actionContainerGrid: {
        display: `flex`,
        flexDirection: `row`,
        position: 'absolute',
        right: 0,
        backgroundColor: "#9867f7",
        borderRadius: `0 0 0 8px`,
    }
});

const ComponentWrapper = (props: any) => {
    return <div {...props}>{props.children}</div>
}

class UIEditorCanvas extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            components: [],
            selectedId: ""
        }

        this.addComponent = this.addComponent.bind(this);
        this.selectComponentById = this.selectComponentById.bind(this);
        this.updateComponents = this.updateComponents.bind(this);
    }

    onDragEnd = (result: any) => {
        console.log('>>> onDragEnd.result', result);
        const { source, destination, draggableId } = result;
        if (!destination) return;

        const [sourceDroppableId, sourceContainer] = source.droppableId.split("::");
        const [destinationDroppableId, destinationContainer] = destination.droppableId.split("::");
        let [sourceComponent, destinationComponent, curComponent] = Array(3);

        if (destinationDroppableId === draggableId) return;

        const search = (nodes: any[]) => {
            for (let node of nodes) {
                if (node.id === draggableId) curComponent = node;
                search(node.children)
            }
        };
        search(this.state.components);

        const update = (nodes: any[]) => {
            for (let node of nodes) {
                if (node.id === draggableId) continue
                if (node.id === sourceDroppableId) {
                    node.children = node.children.filter((child: any) => child.id !== draggableId);
                }
                if (node.id === destinationDroppableId) {
                    node.children.splice(destination.index, 0, { ...curComponent, tag: destinationContainer });
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

    handleComponentsUpdated(newComponents: any[]) {
        this.setState({ components: newComponents })
        this.props.componentsUpdated(newComponents);
    }

    handleComponentOnDelete(component: ComponentData) {
        this.props.componentOnDelete({ ...component })
        const update = (nodes: any[]) => {
            return nodes.reduce((ret, node) => {
                if (node.id === component.id) {
                    node.children = node.children.filter((child: any) => child.id !== component.id);
                } else {
                    node.children = update(node.children)
                    ret.push(node);
                }
                return ret;
            }, []);
        };
        this.handleComponentsUpdated(update(this.state.components).filter((child: any) => child.id !== component.id))
    }

    componentDidMount() {
        this.handleComponentsUpdated(this.props.components)
        this.props.operations.addComponent = this.addComponent;
        this.props.operations.selectComponentById = this.selectComponentById;
        this.props.operations.updateComponents = this.updateComponents;
    }

    selectComponentById(componentId: string) {
        this.setState({selectedId: componentId})
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
            const { droppableContainerStyle, isDraggable, draggableRootStyle } = component;
            const handleClickWithComponent = (e: any) => {
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
                        boxShadow: this.state.selectedId === component.id  ? `inset 0px 0px 0px 5px #13c2c2` : "inset 0px 0px 0px 5px #0000ff00",
                        transition: `all .5s`,
                        border: `1px solid grey`,
                        margin: 1
                    }
                },
                droppableContainerStyle: !!droppableContainerStyle ?
                    (isDraggingOver: boolean) => droppableContainerStyle(isDraggingOver) :
                    (isDraggingOver: boolean) => {
                        return {
                            backgroundColor: isDraggingOver ? '#9867f7' : (component.name === "Grid" ? '#bca2ef' : 'white'),
                            minHeight: 60,
                            margin: 5,
                            border: `15px solid #bca2ef`
                        }
                },
                onMouseDown: (e: any) => handleClickWithComponent(e),
                children: this.renderComponents(!!component.children ? component.children : [], newPath)
            })

            return true ? RenderedComponent : (
                <ComponentWrapper
                    key={`ComponentWrapper-${index}`}
                    tag={component.tag}
                    style={{ margin: 10 }}
                    className={classes.root}
                    id={component.id}
                >
                    {RenderedComponent}
                </ComponentWrapper>
            )

        })
    }

    render() {
        return (
            <>
                {
                    this.renderComponents(
                        [
                            {
                                id: `main`,
                                name: WidgetName.Grid,
                                params: {
                                    container: true,
                                    columnCount: 1
                                },
                                isDraggable: false,
                                children: this.state.components,
                                path: [],
                                tag: '',
                                droppableContainerStyle: (isDraggingOver: boolean) => {
                                    return {
                                        backgroundColor: isDraggingOver ? '#9867f7' : (true ? '#bca2ef' : 'white'),
                                        height: `100vh`
                                    }
                                },
                                draggableRootStyle: () => {
                                    return {

                                    }
                                }
                            }
                        ])
                }
            </>
        )
    }
}

export default withStyles(styles)(UIEditorCanvas);