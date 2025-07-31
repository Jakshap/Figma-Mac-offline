// This plugin template uses Figma's API to interact with the design file

figma.showUI(__html__);

// Handle messages from the UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangle') {
    const rect = figma.createRectangle();
    rect.x = 150;
    rect.y = 150;
    rect.resize(800, 800);
    rect.fills = [{type: 'SOLID', color: {r: 0.5, g: 0, b: 1}}];
    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
  }

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};