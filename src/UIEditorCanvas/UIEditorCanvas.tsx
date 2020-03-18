// ~/github/flintdev/ui-editor-canvas/src/UIEditorCanvas/UIEditorCanvas.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { CanvasWrapper } from "@flintdev/widget-builder";
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
        background: `transparent`,
        border: `1px dashed grey`,
        top: 0,
        left: 0,
        height: `100%`,
        width: `100%`
    },
    actionsSelectedGrid: {
        position: 'absolute',
        background: `transparent`,
        border: `1px dashed grey`,
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
        border: `1px dashed grey`,
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
            selected: {}
        }

        this.addComponent = this.addComponent.bind(this);
        this.updateComponents = this.updateComponents.bind(this);
    }

    onDragEnd = (result: any) => {
        console.log('>>> onDragEnd.result', result);
        const { source, destination, draggableId } = result;
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
        this.props.operations.updateComponents = this.updateComponents;
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
            this.setState({ selected: component })
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
            const RenderedComponent: React.ReactElement = editorLib.getWidget(component.name, {
                ...component,
                params: cleanParmas(component.params),
                draggableProps: {
                    draggableId: component.id as string,
                    index: index
                },
                dnd: isDnd,
                draggableRootStyle: (isDragging: boolean) => {
                    return {
                        // borderRight: `5px solid ${isDragging ? 'red' : 'darkred'}`,
                        padding: 5,
                        backgroundColor: component.name === "Grid" ? '#ccb9f1' : 'white'
                    }
                },
                droppableContainerStyle: (isDraggingOver: boolean) => {
                    return {
                        backgroundColor: isDraggingOver ? '#9867f7' : 'white',
                        height: `100%`,
                        width: `100%`,
                        minHeight: 60,
                        border: `1px dashed grey`
                    }
                },
                renderHandle: (dragHandleProps: any) => {
                    return (
                        <div className={this.state.selected.id === component.id ? (
                            component.name === "Grid" ? classes.actionsSelectedGrid : classes.actionsSelectedOther
                        ) : classes.actions} 
                            key={`dragHandleProps-${index}`}
                            style={{zIndex: newPath.length}}
                            {...dragHandleProps}
                        >
                            <div className={component.name === "Grid" ? classes.actionContainerGrid : classes.actionContainerOther}
                                style={{visibility: this.state.selected.id === component.id ? 'visible' : 'hidden'}}
                            >
                                <div>
                                    <HighlightOffIcon className={classes.actionIcon} onClick={() => this.handleComponentOnDelete(component)}/>
                                </div>
                            </div>
                        </div>
                   )
                },
                children: this.renderComponents(!!component.children ? component.children : [], newPath)
            })

            return !isDnd ? RenderedComponent : (
                <ComponentWrapper
                    key={`ComponentWrapper-${index}`}
                    tag={component.tag}
                    onClick={(e: any) => handleClick(e, component)}
                    className={classes.root}
                >
                    {RenderedComponent}
                </ComponentWrapper>
            )

        })
    }

    render() {

        return (
            <>
                <CanvasWrapper onDragEnd={this.onDragEnd} canvasDroppableId={'main'}>
                    {this.renderComponents(this.state.components)}
                </CanvasWrapper>
            </>
        )
    }
}

export default withStyles(styles)(UIEditorCanvas);