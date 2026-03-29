import summaryMessages from "./summaryMessages"

const mcpTools = [ summaryMessages ]
if (typeof navigator !== "undefined" && navigator.modelContext) {
  navigator.modelContext.registerTool(mcpTools)
}
