// ~/github/flintdev/ui-editor-canvas/example/ExampleContainer.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import UIEditorCanvas from "../src/UIEditorCanvas";
import { getWidget, WidgetName, WidgetProps } from "@flintdev/material-widgets";
import { Button, TextField } from '@material-ui/core';
import { initComponentsData } from "./data/initComponentsData";

interface Operations {
    addComponent?: (componentData: ComponentData) => void,
}

interface EditorLib {
    getWidget: (name: WidgetName, props: WidgetProps) => React.ReactElement
}

interface ComponentData {
    id: string | number,
    name: string,
    params: object,
    children?: Array<ComponentData>,
    path?: Array<string | number>,
    tag?: string
}

type Components = Array<ComponentData>;

const styles = createStyles({
    root: {
        display: 'flex',
        width: `100vw,`,
        height: `100vh`,
        overflow: 'hidden'
    },
    left: {
        width: `20vw`,
        height: `100vw`,
    },
    right: {
        width: `20vw`,
        height: `100vw`,
    },
    center: {
        backgroundColor: 'lightblue',
        width: `60vw`,
        height: `100vw`,
    },
});


class ExampleContainer extends React.Component<any, object> {
    state = {
        selected: ''
    }
    editorLib: EditorLib = {
        getWidget: getWidget
    };
    operations: Operations = {};
    components: Components = initComponentsData;
    render() {
        const { classes } = this.props;
        const { selected } = this.state;
        return (
            <div className={classes.root}>
                {/* LEFT */}
                <div className={classes.left}>
                    <Button variant="contained" onClick={() => {
                        if (this.operations.addComponent) {
                            this.operations.addComponent(
                                {
                                    id: 'button-added-1',
                                    name: WidgetName.Button,
                                    params: {
                                        label: 'button-added'
                                    },
                                    children: [],
                                    path: [''],
                                    tag: ''
                                }
                            );
                        }
                    }}>Add Component</Button>
                </div>

                {/* CENTER */}
                <div className={classes.center}>
                    <UIEditorCanvas
                        operations={this.operations}
                        components={this.components}
                        editorLib={this.editorLib}
                        componentsUpdated={(components: Components) => {
                            console.log('>>> componentsUpdated.components', components)
                        }}
                        componentOnSelect={(componentData: ComponentData) => {
                            this.setState({ selected: JSON.stringify(componentData, null, 4) })
                            console.log('>>> componentOnSelect.componentData', componentData)
                        }}
                        componentOnDelete={(componentData: ComponentData) => {
                            console.log('>>> componentOnDelete.componentData', componentData)
                        }}
                    />
                </div>

                {/* RIGHT */}
                <div className={classes.right}>
                    <TextField
                        value={selected}
                        onChange={e => this.setState({ selected: e.target.value })}
                        multiline={true}
                        fullWidth={true}
                    />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ExampleContainer);