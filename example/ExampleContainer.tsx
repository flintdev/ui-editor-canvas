// ~/github/flintdev/ui-editor-canvas/example/ExampleContainer.tsx

import * as React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import UIEditorCanvas from "../src/UIEditorCanvas";
import { Operations, EditorLib, ComponentData, Components } from "../src/UIEditorCanvas/interface";
import { getWidget, WidgetName, WidgetProps } from "@flintdev/material-widgets";
import { Button, TextField } from '@material-ui/core';
import { initComponentsData } from "./data/initComponentsData";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

let count = 0;

const styles = createStyles({
    root: {
        display: 'flex',
        width: `100vw,`,
        height: `100vh`,
        overflow: 'hidden'
    },
    left: {
        width: `20vw`,
        height: `100vh`,
        display: 'flex',
        flexDirection: `column`
    },
    right: {
        width: `20vw`,
        height: `100vh`,
        display: 'flex',
        flexDirection: `column`
    },
    center: {
        backgroundColor: 'lightyellow',
        width: `60vw`,
        height: `70vh`,
        display: 'flex',
        flexDirection: `column`,
        overflow: 'auto',
        padding: 20
    },
});

class ExampleContainer extends React.Component<any, object> {
    state = {
        selected: '',
        isDnd: true,
        isButtonSelected: false
    }
    editorLib: EditorLib = {
        getWidget: getWidget
    };
    handleChange() {
        this.setState({ isDnd: !this.state.isDnd })
    }
    handleSelectButton(val: boolean) {
        this.setState({ isButtonSelected: val })
    }
    operations: Operations = {};
    components: Components = [];
    render() {
        const { classes } = this.props;
        const { selected, isDnd, isButtonSelected } = this.state;
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

                    <div style={{opacity: isButtonSelected? 0 : 1, maxHeight: 40, minHeight: 40}} onDragEnd={() => this.handleSelectButton(false)} onMouseUp={() => this.handleSelectButton(false)}>
                        {
                            !isButtonSelected ? <Button onMouseDown={() => this.handleSelectButton(true)}>Drag Me To Create Button</Button> :
                                getWidget(WidgetName.Button, {
                                    params: {
                                        label: `Button-Dragged`,
                                        variant: "outlined"
                                    },
                                    dnd: true,
                                    draggableProps: {
                                        draggableId: 'created-by-drag',
                                        index: 0
                                    },
                                    onDragEnd: (result: any) => {
                                        if (this.operations.onDragEnd) {
                                            count += 1;
                                            result.dragToCreate = true;
                                            result.dragComponentData = {
                                                id: `button-dragged-${count}`,
                                                name: WidgetName.Button,
                                                params: {
                                                    "label": `Button-Dragged-${count}`,
                                                    "variant": "outlined"
                                                },
                                                children: [],
                                                path: [],
                                                tag: ""
                                            }
                                            this.operations.onDragEnd(result)
                                        }
                                        this.handleSelectButton(false)
                                    }
                                } as any)
                        }
                    </div>

                    <Button onClick={() => {
                        if (this.operations.selectComponentById) {
                            this.operations.selectComponentById("button-2")
                        }
                    }}>Select "button-2"</Button>
                    <Button onClick={() => {
                        if (this.operations.deleteComponentById) {
                            this.operations.deleteComponentById("button-2")
                        }
                    }}>Delete "button-2"</Button>
                    <Button variant="contained" onClick={() => {
                        if (this.operations.addComponent) {
                            count += 1;
                            this.operations.addComponent(
                                {
                                    id: `Label-${count}`,
                                    name: WidgetName.Label,
                                    params: {
                                        text: `state::$.button.title::displayValue::${JSON.stringify(`Label-${count}`)}`,
                                    },
                                    children: [],
                                    path: [],
                                    tag: ''
                                }
                            );
                        }
                    }}>Add Label</Button>
                    <Button variant="contained" onClick={() => {
                        if (this.operations.addComponent) {
                            count += 1;
                            this.operations.addComponent(
                                {
                                    id: `button-${count}`,
                                    name: WidgetName.Button,
                                    params: {
                                        label: `state::$.button.title::displayValue::${JSON.stringify(`button-${count}`)}`,
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
                                    id: `TextField-${count}`,
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