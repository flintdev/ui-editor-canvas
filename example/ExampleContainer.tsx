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
import SimpleMenu from './components/Menu';

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
        padding: 30,
        margin: 30
    },
});

class ExampleContainer extends React.Component<any, object> {
    state = {
        selected: '',
        isDnd: true,
        isButtonSelected: false,
        components: []
    };
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
    render() {
        const { classes } = this.props;
        const { selected, isDnd, isButtonSelected, components } = this.state;
        return (
            <div className={classes.root}>
                {/* LEFT */}
                <div className={classes.left}>
                    {/* isDnd Switch */}
                    <FormControlLabel
                        control={ <Switch checked={isDnd} onChange={() => this.handleChange()} value="checkedA" /> }
                        label="isDnd"
                    />

                    {/* Add Widgets Menu */}
                    <SimpleMenu operations={this.operations}/>

                    {/* Drag to create */}
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
                                            };
                                            this.operations.onDragEnd(result)
                                        }
                                        this.handleSelectButton(false)
                                    }
                                } as any)
                        }
                    </div>

                    <Button onClick={() => {if (this.operations.selectComponentById) this.operations.selectComponentById("Button-1")}}>Select "Button-1"</Button>
                    <Button onClick={() => {if (this.operations.selectComponentById) this.operations.selectComponentById("Grid-2")}}>Select "Grid-2"</Button>
                    <Button onClick={() => {if (this.operations.selectComponentById) this.operations.selectComponentById("Label-3")}}>Select "Label-3"</Button>
                    <Button onClick={() => {if (this.operations.deleteComponentById) this.operations.deleteComponentById("Button-2")}}>Delete "Button-2"</Button>
                </div>

                {/* CENTER */}
                <div className={classes.center}>
                    <UIEditorCanvas
                        isDnd={isDnd}
                        operations={this.operations}
                        components={components}
                        editorLib={this.editorLib}
                        componentsUpdated={(components: Components) => {
                            this.setState({components: components})
                            console.log('>>> componentsUpdated.components', components)
                        }}
                        componentOnSelect={(componentData: ComponentData) => {
                            this.setState({ selected: JSON.stringify(componentData, null, 4) })
                            console.log('>>> componentOnSelect.componentData', componentData)
                        }}
                        componentOnDelete={(componentData: ComponentData) => {
                            console.log('>>> componentOnDelete.componentData', componentData)
                        }}
                        customConfig={{
                            selectedColor: "#0054c2",
                            gridColor: "#efd885",
                            containerColor: "#efb722",
                            dropContainerMargin: 5,
                            dragWeigtPadding: 10,
                            containerMinHeight: 60
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