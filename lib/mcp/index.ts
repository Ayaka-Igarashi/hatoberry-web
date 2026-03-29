import summaryMessages from "./summaryMessages"

const mcpTools = [ summaryMessages ]
if (navigator.modelContext) {
  navigator.modelContext.registerTool(mcpTools)
}
