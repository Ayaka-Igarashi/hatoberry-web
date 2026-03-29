// modelContext型拡張: Chatなどでnavigator.modelContextを使うため
declare global {
  interface Navigator {
    modelContext?: any; // 必要に応じて型を修正
  }
}

export * from './message';
