// This plugin template uses Figma's API to interact with the design file

figma.showUI(__html__);

// Handle messages from the UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangle') {
    const rect = figma.createRectangle();
    rect.x = 150;
    rect.y = 150;
    rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};