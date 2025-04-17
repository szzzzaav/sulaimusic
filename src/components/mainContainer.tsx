"use client";

import { Children } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable";
import { LayoutSizeProvider, useLayoutSize } from "../hooks/layoutSizeContext";

function MainContainerInner({ children }: { children: React.ReactNode }) {
  const childrenArray = Children.toArray(children);
  const panelCount = childrenArray.length;

  if (panelCount !== 3) {
    console.warn("MainContainer expects exactly 3 children components");
    return null;
  }

  const {
    firstPanelSize,
    middlePanelSize,
    lastPanelSize,
    panelConfig,
    handleFirstPanelResize,
    handleLastPanelResize,
  } = useLayoutSize();

  return (
    <ResizablePanelGroup className="w-full h-full">
      <ResizablePanel
        defaultSize={panelConfig.first.defaultSize}
        minSize={panelConfig.first.minSize}
        maxSize={panelConfig.first.maxSize}
        size={firstPanelSize}
      >
        {childrenArray[0]}
      </ResizablePanel>

      <ResizableHandle onResize={handleFirstPanelResize} className="bg-gray-600/5" />

      <ResizablePanel
        defaultSize={panelConfig.middle.defaultSize}
        minSize={panelConfig.middle.minSize}
        size={middlePanelSize}
      >
        {childrenArray[1]}
      </ResizablePanel>

      <ResizableHandle onResize={handleLastPanelResize} className="bg-gray-600/5" />

      <ResizablePanel
        defaultSize={panelConfig.last.defaultSize}
        minSize={panelConfig.last.minSize}
        maxSize={panelConfig.last.maxSize}
        size={lastPanelSize}
      >
        {childrenArray[2]}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default function MainContainer({ children }: { children: React.ReactNode }) {
  return (
    <LayoutSizeProvider>
      <MainContainerInner children={children} />
    </LayoutSizeProvider>
  );
}
