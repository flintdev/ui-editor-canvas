import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { WidgetName } from '@flintdev/material-widgets';
import * as _ from "lodash";

export default function SimpleMenu(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    // return display style and widget specific params
    const getDetails = (name: string, id: string) => {
        switch (name) {
            case WidgetName.Label:
                return {
                    params: {
                        text: `state::$.button.title::displayValue::${JSON.stringify(id)}`,
                    },
                    canvas: {
                        display: "inline-block"
                    }
                }
            case WidgetName.Button:
                return {
                    params: {
                        label: `state::$.button.title::displayValue::${JSON.stringify(id)}`,
                        variant: "outlined"
                    },
                    canvas: {
                        display: "inline-block"
                    }
                }
            case WidgetName.TextField:
                return {
                    params: {
                        variant: "outlined"
                    },
                    canvas: {
                        display: "inline-block"
                    }
                }
            case WidgetName.Grid:
                return {
                    params : {
                        container: true,
                        columnCount: 2,
                    },
                    canvas: {
                        defaultTag: "grid-0"
                    },
                    overlay: true
                }
            default:
                return {
                    params: {}
                }

        }
    }
    const handleAddComponent = (name: string) => {
        const {operations} = props;
        if (operations.addComponent) {
            const id = `${name}-${_.uniqueId()}`;
            const widgetProps = {
                id: id,
                name: name,
                children: [],
                path: [],
                tag: '',
                ...getDetails(name, id)
            };
            operations.addComponent(widgetProps);
        }
        handleClose();
    }

    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Add Widget
      </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    Object.values(WidgetName).map((name, index) => {
                        return <MenuItem key={index} onClick={() => handleAddComponent(name)}>{name}</MenuItem>
                    })
                }

            </Menu>
        </div>
    );
}