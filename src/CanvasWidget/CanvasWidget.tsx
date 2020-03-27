// src/layout/Grid/Grid.tsx

import * as React from 'react';
import {Widget, WidgetProps} from "@flintdev/widget-builder";

export default class CanvasWidget extends Widget<WidgetProps> {

    renderCustomComponent() {
        return (
            <React.Fragment>
                    {this.placeContainer("0")}
            </React.Fragment>
        )
    }
}

