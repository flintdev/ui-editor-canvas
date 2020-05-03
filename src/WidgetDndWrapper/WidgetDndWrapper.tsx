import React from "react";
export interface WidgetDndWrapperProps {
    operations: any, getWidget: any, widgetData: any, component: any, width?:number, height?:number
}
export class WidgetDndWrapper extends React.Component<WidgetDndWrapperProps, any> {
    ref: any;
    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            isButtonSelected: false
        }
    }

    handleSelectButton(val) {
        this.setState({ isButtonSelected: val })
    }

    render() {
        const { operations, getWidget, widgetData, component, width, height } = this.props;
        const { isButtonSelected } = this.state;
        const RenderedComponent = component;
        return (
            <div style={{ opacity: isButtonSelected ? 0 : 1, width, height }}
                ref={this.ref}
                onDragEnd={() => this.handleSelectButton(false)}
                onMouseUp={() => this.handleSelectButton(false)}
            >
                {
                    !isButtonSelected ? React.cloneElement(RenderedComponent, {onMouseDown: () => {
                        this.handleSelectButton(true);
                    }}) :
                        getWidget(widgetData.name, {
                            params: widgetData.params,
                            dnd: true,
                            draggableProps: { draggableId: 'created-by-drag', index: 0 },
                            onDragEnd: (result: any) => {
                                if (operations.onDragEnd) {
                                    result.dragToCreate = true;
                                    result.dragComponentData = widgetData;
                                    operations.onDragEnd(result)
                                }
                                this.handleSelectButton(false)
                            }
                        } as any)
                }
            </div>
        )
    }
}