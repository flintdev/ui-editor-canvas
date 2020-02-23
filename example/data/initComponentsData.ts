import { WidgetName } from "@flintdev/material-widgets";

export const initComponentsData = [
    {
        id: 'item-1',
        name: WidgetName.Grid,
        params: {
            style: {
                width: '60vw',
                height: '30vw',
                display: 'flex'
            }
        },
        children: [
            {
                id: 'item-2',
                name: WidgetName.TextField,
                params: {
                    label: 'TextField02',
                    variant: "outlined",
                    style: {
                        backgroundColor: 'white'
                    }
                },
                children: [],
                path: [],
                tag: 'container2',
                dnd: true,
                draggableRootStyle: (isDragging: boolean) => {
                    return {
                        cursor: 'move',
                        borderRight: `5px solid ${isDragging ? 'red' : 'darkred'}`,
                        display: 'inline-table'
                    }
                },
            },
        ],
        path: [],
        tag: '',
        dnd: true,
        draggableRootStyle: (isDragging: boolean) => {
            return {
                cursor: 'move',
                borderRight: `5px solid ${isDragging ? 'red' : 'darkred'}`,
                display: 'flex'
            }
        },
        droppableContainerStyle: (isDraggingOver: boolean) => {
            return {
                backgroundColor: isDraggingOver ? 'grey' : 'lightgrey',
                flex: 1,
                height: '100%'
            }
        }
    },
]