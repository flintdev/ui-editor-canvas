// ~/github/flintdev/ui-editor-canvas/src/UIEditorCanvas/UIEditorCanvas.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { CanvasWrapper } from "@flintdev/widget-builder";
import { ComponentData } from "./interface";

const styles = createStyles({
    root: {
        // height: '100%',
        // width: '100%'
        padding: 10,
        background: `#eeeeee80`,
        border: `1px dashed grey`,
    },
});

const ComponentWrapper = (props: any) => {
    return <div {...props}>{props.children}</div>
}

class UIEditorCanvas extends React.Component<any, object> {
    onDragEnd = (result: any) => {
        const { source, destination } = result;
        console.log('>>> source', source);
        console.log('>>> destination', destination);
    };

    componentDidMount() {
        this.props.operations.addComponent = this.addComponent;
    }

    addComponent(componentData: ComponentData) {
        console.log('>>> addComponent.componentData', componentData)
    }

    renderComponents(components: Array<ComponentData>, prevPath: any[] = []): Array<React.ReactElement> {
        const { editorLib, componentOnSelect, classes, isDnd } = this.props;
        const handleClick = (e: any, component: any) => {
            e.stopPropagation();
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
                        borderRight: `5px solid ${isDragging ? 'red' : 'darkred'}`,
                    }
                },
                droppableContainerStyle: (isDraggingOver: boolean) => {
                    return {
                        backgroundColor: isDraggingOver ? 'grey' : '#eeeeee80',
                        height: `100%`,
                        width: `100%`
                    }
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
                    path: {JSON.stringify(newPath)}
                    {RenderedComponent}
                </ComponentWrapper>
            )

        })
    }

    render() {
        const { operations, components, editorLib, componentsUpdated, componentOnSelect, componentOnDelete } = this.props;
        const { classes } = this.props;

        return (
            <>
                <CanvasWrapper onDragEnd={this.onDragEnd} canvasDroppableId={'main'}>
                    {this.renderComponents(components)}
                </CanvasWrapper>
            </>
        )
    }
}

export default withStyles(styles)(UIEditorCanvas);