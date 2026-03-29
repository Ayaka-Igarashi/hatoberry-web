const summaryMessages = {
    // ツール名: エージェントがこの名前で呼び出す
    name: "summary_messages",

    // 説明: エージェントが適切なツールを選ぶための判断材料
    description: "指定された期間のメッセージの内容を要約する",

    // 入力スキーマ: JSON Schema形式でパラメータを定義
    inputSchema: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "開始日（YYYY-MM-DD形式）"
        },
        endDate: {
          type: "string",
          description: "終了日（YYYY-MM-DD形式）"
        }
      },
      required: ["startDate", "endDate"]
    },

    // 実行関数: エージェントがツールを呼び出すとこの関数が実行される
    async execute({ startDate, endDate }) {
      const response = await fetch("/api/messages", {
        method: "GET",
      });
      const data = await response.json();
      return { success: true, messages:data };
    }
}

export default summaryMessages