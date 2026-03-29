import summaryMessages from "./summaryMessages";

const mcpTools = [summaryMessages];

if (typeof navigator !== "undefined" && navigator.modelContext) {
  const modelContext = navigator.modelContext;
  mcpTools.forEach(tool => {
    modelContext.registerTool(tool);
  });
}
