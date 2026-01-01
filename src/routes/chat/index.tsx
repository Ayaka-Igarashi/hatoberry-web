import { component$, useStylesScoped$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./index.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  const messages = useSignal([]);
  const newMessage = useSignal("");

  const addMessage = $(() => {
    if (newMessage.value==="")
      return
    
    messages.value = [...messages.value, newMessage.value];
    newMessage.value = "";
  });

  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addMessage();
    }
  });

  return (
    <div class="root">
      <div class="messages">
        {messages.value.map((msg, i) => (
          <div key={i} class="message">
            {msg}
          </div>
        ))}
      </div>
      <div class="input-area">
        <input type="text" bind:value={newMessage} onKeyDown$={handleKeyDown} />
        <button onClick$={addMessage}>Send</button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
