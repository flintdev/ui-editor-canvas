import { WidgetName } from "@flintdev/material-widgets";
export const customNodes = [
    {
        name: "CRD",
        color: "rgb(92,191,142)",
        icon: "<path fill='white' d='M13.28 7.6h-.7V5.76c0-.51-.41-.93-.92-.93H9.81v-.7a1.16 1.16 0 00-2.3 0v.7H5.65c-.51 0-.92.42-.92.93V7.5h.69a1.25 1.25 0 010 2.5h-.7v1.75c0 .5.42.92.93.92H7.4V12a1.25 1.25 0 012.5 0v.7h1.75c.5 0 .92-.42.92-.93V9.91h.7a1.16 1.16 0 000-2.3z'/>"
    },
    {
        name: "POD",
        icon: "<g fill='white' fill-rule='evenodd'><path d='M5.4 5.9l3.6-1 3.6 1-3.6 1zM5.4 6.3V10L8.8 12V7.3zM12.6 6.3V10L9.3 12V7.3z'/></g>"
    },
    {
        name: "NS",
        icon: "<path fill='none' stroke='white' stroke-dasharray='.8 .4' stroke-dashoffset='3.44' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='.4' d='M5.18 5.2h7.67v6.69H5.18z'/>"
    },
    {
        name: "SVC",
        icon: "<g><path fill='white' fill-rule='evenodd' d='M3.6 10.09h2.9v2.04H3.6zM7.56 10.09h2.91v2.04h-2.9zM11.53 10.09h2.91v2.04h-2.9zM6.71 4.03h4.61v2.05h-4.6z'/><path fill='none' stroke='white' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='.53' d='M9.02 6.08v2H5.05v2M9.02 6.08v2h3.96v2'/><path fill='none' stroke='white' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='.53' d='M9 6.08v2h.03v2'/></g>"
    },
    {
        name: "DEPLOY",
        icon: "<g fill='white' fill-rule='evenodd'><path d='M8.58 12.56a4.45 4.45 0 114.23-4.73l-1.76.11A2.69 2.69 0 108.5 10.8z'/><path d='M9.49 7.83l1.4 3.43 3.22-3.43z'/></g>"
    },
    {
        name: "ING",
        icon: `<path fill='white' d='M11.77 12.54H9.49L4.57 6.4H3.15V4.37h2.31l4.93 6.16h1.38v-1.6l3.12 2.6-3.12 2.6zM9.29 7.8l1.1-1.38h1.38v1.6l3.12-2.6-3.12-2.6V4.4H9.49L8.04 6.22zm-3.6 1.36l-1.12 1.4H3.15v2.02h2.31l1.48-1.85z' pointer-events='none'/>`,
    },

];
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