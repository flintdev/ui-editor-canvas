// ~/github/flintdev/ui-editor-canvas/src/UIEditorCanvas/UIEditorCanvas.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { CanvasWrapper } from "@flintdev/widget-builder";
import { ComponentData } from "./interface";

const styles = createStyles({
    root: {
        '&:hover': {
            opacity: 0.95
        },
        display: 'inline-block'
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

    renderComponents(components: Array<ComponentData>): Array<React.ReactElement> {
        const { editorLib, componentOnSelect, classes } = this.props;
        const handleClick = (e: any, component: any) => {
            e.stopPropagation();
            componentOnSelect(component);
        }
        return components.map((component: ComponentData, index: number) => {
            const RenderedComponent: React.ReactElement = editorLib.getWidget(component.name, {
                ...component,
                draggableProps: {
                    draggableId: component.id as string,
                    index: index    
                },
                children: this.renderComponents(!!component.children ? component.children : [])
            })

            return (
                <ComponentWrapper
                    key={`ComponentWrapper-${index}`}
                    tag={component.tag}
                    onClick={(e: any) => handleClick(e, component)}
                    className={classes.root}
                >
                    {RenderedComponent}
                </ComponentWrapper>
            );
        })
    }

    render() {
        const { operations, components, editorLib, componentsUpdated, componentOnSelect, componentOnDelete } = this.props;
        const { classes } = this.props;

        return (
            <>
                <CanvasWrapper onDragEnd={this.onDragEnd} canvasDroppableId={'main'}>
                    <div style={{display: 'flex'}}>
                        {this.renderComponents(components)}
                    </div>
                </CanvasWrapper>
            </>
        )
    }
}

export default withStyles(styles)(UIEditorCanvas);