// modelContext型拡張: Chatなどでnavigator.modelContextを使うため
declare global {
  interface ModelContext {
    registerTool: (tool: unknown) => void;
  }

  interface Navigator {
    modelContext?: ModelContext;
  }
}

export * from './message';
