// ~/github/flintdev/ui-editor-canvas/example/ExampleContainer.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import UIEditorCanvas from "../dist/UIEditorCanvas";
import { getWidget, WidgetName, WidgetProps } from "@flintdev/material-widgets";
import { Button, TextField } from '@material-ui/core';
import { initComponentsData } from "./data/initComponentsData";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

let count = 0;
interface Operations {
    updateComponents?: (components: ComponentData[]) => void,
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
    tag?: string,
    columnParams?: object
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
        display: 'flex',
        flexDirection: `column`
    },
    right: {
        width: `20vw`,
        height: `100vw`,
    },
    center: {
        backgroundColor: '#fafafa',
        width: `60vw`,
        height: `100vw`,
    },
});


class ExampleContainer extends React.Component<any, object> {
    state = {
        selected: '',
        isDnd: true
    }
    editorLib: EditorLib = {
        getWidget: getWidget
    };
    handleChange() {
        this.setState({ isDnd: !this.state.isDnd })
    }
    operations: Operations = {};
    components: Components = [];
    render() {
        const { classes } = this.props;
        const { selected, isDnd } = this.state;
        return (
            <div className={classes.root}>
                {/* LEFT */}
                <div className={classes.left}>
                    <FormControlLabel
                        control={
                            <Switch checked={isDnd} onChange={() => this.handleChange()} value="checkedA" />
                        }
                        label="isDnd"
                    />
                    <Button variant="contained" onClick={() => {
                        if (this.operations.addComponent) {
                            count += 1;
                            this.operations.addComponent(
                                {
                                    id: `button-${count}`,
                                    name: WidgetName.Button,
                                    params: {
                                        label: `button-${count}`,
                                        variant: "outlined"
                                    },
                                    children: [],
                                    path: [],
                                    tag: ''
                                }
                            );
                        }
                    }}>Add Button</Button>
                    <Button variant="contained" onClick={() => {
                        if (this.operations.addComponent) {
                            count += 1;
                            this.operations.addComponent(
                                {
                                    id: `button-${count}`,
                                    name: WidgetName.TextField,
                                    params: {
                                        variant: "outlined"
                                    },
                                    children: [],
                                    path: [],
                                    tag: ''
                                }
                            );
                        }
                    }}>Add TextField</Button>
                    <Button variant="contained" onClick={() => {
                        if (this.operations.addComponent) {
                            count += 1;
                            this.operations.addComponent(
                                {
                                    id: `grid-${count}`,
                                    name: WidgetName.Grid,
                                    params: {
                                        label: `grid-${count}`,
                                        variant: "outlined",
                                        container: true,
                                        columnCount: 2,
                                    },
                                    children: [],
                                    path: [],
                                    tag: ''
                                }
                            );
                        }
                    }}>Add Grid</Button>
                </div>

                {/* CENTER */}
                <div className={classes.center}>
                    <UIEditorCanvas
                        isDnd={isDnd}
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
                    <Button variant="contained" onClick={() => {
                        if (this.operations.updateComponents) {
                            this.operations.updateComponents([]);
                        }
                    }}>updateComponents</Button>
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