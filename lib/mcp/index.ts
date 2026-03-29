import summaryMessages from "./summaryMessages";

const mcpTools = [summaryMessages];

if (typeof navigator !== "undefined" && navigator.modelContext) {
  mcpTools.forEach(tool => {
    navigator.modelContext.registerTool(tool);
  });
}
