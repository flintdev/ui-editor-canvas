// ~/github/flintdev/ui-editor-canvas/src/UIEditorCanvas/UIEditorCanvas.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { CanvasWrapper } from "@flintdev/widget-builder";
import { ComponentData } from "./interface";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import OpenWithIcon from '@material-ui/icons/OpenWith';

const styles = createStyles({
    root: {
        '&:hover': {
            '& $actions': {
                opacity: 1
            },
        },
        // height: '100%',
        // width: '100%'
        position: 'relative',
        padding: 5,
        background: `#eeeeee80`,
        border: `1px dashed grey`,
    },
    actions: {
        display: `flex`,
        flexDirection: `row`,
        backgroundColor: `lightgrey`,
        position: 'absolute',
        top: 0,
        right: 0,
        opacity: 0
    },
});

const ComponentWrapper = (props: any) => {
    return <div {...props}>{props.children}</div>
}

class UIEditorCanvas extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            components: []
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
            for (let node of nodes) {
                if (node.id === component.id) {
                    node.children = node.children.filter((child: any) => child.id !== component.id);
                }
                node.children = update(node.children)
            }
            return nodes;
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
            componentOnSelect(component);
        }
        return components.map((component: ComponentData, index: number) => {
            const newPath = prevPath.concat(component!.id.toString());
            const RenderedComponent: React.ReactElement = editorLib.getWidget(component.name, {
                ...component,
                draggableProps: {
                    draggableId: component.id as string,
                    index: index
                },
                dnd: isDnd,
                draggableRootStyle: (isDragging: boolean) => {
                    return {
                        // borderRight: `5px solid ${isDragging ? 'red' : 'darkred'}`,
                    }
                },
                droppableContainerStyle: (isDraggingOver: boolean) => {
                    return {
                        backgroundColor: isDraggingOver ? 'grey' : '#eeeeee80',
                        height: `100%`,
                        width: `100%`
                    }
                },
                renderHandle: (dragHandleProps: any) => {
                    return (
                        <div className={classes.actions} {...dragHandleProps} key={`dragHandleProps-${index}`}>
                            <div {...dragHandleProps}><OpenWithIcon onClick={() => console.log('>>> path:', JSON.stringify(newPath))}></OpenWithIcon></div>
                            <HighlightOffIcon onClick={() => this.handleComponentOnDelete(component)}></HighlightOffIcon>
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