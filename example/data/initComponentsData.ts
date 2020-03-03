import { WidgetName } from "@flintdev/material-widgets";

export const initComponentsData = [
    {
        id: 'button-5',
        name: WidgetName.Button,
        params: {
            label: 'button5',
            variant: "outlined"
        },
        children: [],
        path: [],
        tag: '',
        dnd: true
    },
    {
        id: 'grid-0',
        name: WidgetName.Grid,
        params: {
            style: {
                height: 100,
                width: '100%'
            },
            container: true,
        },
        columnParams: [
            {
                style: {
                    backgroundColor: 'orange',
                    height: `100%`,
                },
                xs: 12
            }
        ],
        path: [],
        tag: '',
        dnd: true,
        children: [
            {
                id: 'button-4',
                name: WidgetName.Button,
                params: {
                    label: 'button4',
                    variant: "outlined"
                },
                children: [],
                path: [],
                tag: 'container0',
                dnd: true
            },
        ]
    },
    {
        id: 'grid-1',
        name: WidgetName.Grid,
        params: {
            style: {
                width: '100%',
                height: 'calc(100vh - 100px)'
            },
            container: true
        },
        columnParams: [
            {
                style: {
                    backgroundColor: 'red'
                },
                container: true,
                item: true,
                xs: 4
            },
            {
                style: {
                    backgroundColor: 'yellow'
                },
                container: true,
                item: true,
                xs: 8
            }
        ],
        children: [
            {
                id: 'button-0',
                name: WidgetName.Button,
                params: {
                    label: 'button0',
                    variant: "outlined"
                },
                children: [],
                path: [],
                tag: 'container0',
                dnd: true
            },
            {
                id: 'button-1',
                name: WidgetName.Button,
                params: {
                    label: 'button1',
                    variant: "outlined"
                },
                children: [],
                path: [],
                tag: 'container0',
                dnd: true
            },
            {
                id: 'grid-2',
                name: WidgetName.Grid,
                params: {
                    style: {
                        height: 200,
                        width: '100%'
                    },
                    container: true,
                    xs: 12
                },
                columnParams: [
                    {
                        style: {
                            backgroundColor: 'blue',
                            height: `100%`,
                        },
                        xs: 6
                    },
                    {
                        style: {
                            backgroundColor: 'purple',
                            height: `100%`,
                        },
                        xs: 6
                    }
                ],
                path: [],
                tag: 'container1',
                dnd: true,
                children: [
                    {
                        id: 'button-3',
                        name: WidgetName.Button,
                        params: {
                            label: 'button3',
                            variant: "outlined"
                        },
                        children: [],
                        path: [],
                        tag: 'container0',
                        dnd: true
                    },
                    {
                        id: 'button-6',
                        name: WidgetName.Button,
                        params: {
                            label: 'button6',
                            variant: "outlined"
                        },
                        children: [],
                        path: [],
                        tag: 'container1',
                        dnd: true
                    }
                ]
            },
            {
                id: 'grid-3',
                name: WidgetName.Grid,
                params: {
                    style: {
                        height: 'calc(100vh - 200px)',
                        width: '100%'
                    },
                    container: true,
                },
                columnParams: [
                    {
                        style: {
                            backgroundColor: 'green',
                            height: `100%`,
                        },
                        xs: 12
                    }
                ],
                children: [
                    {
                        id: 'button-7',
                        name: WidgetName.Button,
                        params: {
                            label: 'button7',
                            variant: "outlined"
                        },
                        children: [],
                        path: [],
                        tag: 'container0',
                        dnd: true
                    }
                ],
                path: [],
                tag: 'container1',
                dnd: true
            },
        ],
        path: [],
        tag: '',
        dnd: true
    },
]