// frontend/src/hooks/useMatAi/chatLogic.ts
import { useCallback, useEffect } from 'react';
import { getMatAiApi, detectCommand, describeMissingBridge } from './utils';

export const useChatLogic = (
  turns: ChatTurn[], // Global type, tak payah import!
  setTurns: React.Dispatch<React.SetStateAction<ChatTurn[]>>,
  setBusy: React.Dispatch<React.SetStateAction<boolean>>,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  sendRef: React.MutableRefObject<any>,
  uiSelection: 'FAST_LOCAL' | 'FAST_CLOUD' | 'BRAIN',
  selectedLocalModel: string,
  busy: boolean
) => {

  const sendWithText = useCallback(async (
    text: string,
    inputMode: 'text' | 'voice' | 'image' = 'text',
    attachment?: { name: string; data: string; type: string }
  ) => {
    const api = getMatAiApi();
    const trimmed = text.trim();

    if (!trimmed && !attachment) return;
    if (busy) return;

    if (!api) {
      setTurns((prev: ChatTurn[]) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', text: trimmed || `[Fail: ${attachment?.name}]`, inputMode },
        { id: crypto.randomUUID(), role: 'assistant', text: describeMissingBridge() }
      ]);
      setInput('');
      return;
    }

    const command = detectCommand(trimmed);
    if (command) {
      setTurns((prev: ChatTurn[]) => [...prev, { id: crypto.randomUUID(), role: 'user', text: trimmed, inputMode }]);
      setInput('');
      setBusy(true);
      try {
        const result = await api.executeSystemCommand(command);
        setTurns((prev: ChatTurn[]) => [...prev, { 
          id: crypto.randomUUID(), 
          role: 'assistant', 
          text: result.ok ? `✓ ${command} — ${result.message}` : `MAT.ai: gagal — ${result.error}` 
        }]);
      } catch (err: any) {
        setTurns((prev: ChatTurn[]) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: `MAT.ai ralat: ${err.message || err}` }]);
      } finally { setBusy(false); }
      return;
    }

    const assistantTurnId = crypto.randomUUID();
    
    // UI Attachment mapping
    const uiAttachment = attachment ? {
      type: 'image',
      name: attachment.name,
      url: attachment.data.startsWith('data:') ? attachment.data : `data:${attachment.type || 'image/png'};base64,${attachment.data}`
    } : undefined;

    setTurns((prev: ChatTurn[]) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed || `[Gambar: ${attachment?.name}]`, inputMode, attachment: uiAttachment },
      { id: assistantTurnId, role: 'assistant', text: '' }
    ]);
    setInput('');
    setBusy(true);

    // MAT-AI-OS's /task is a single request/response — no token-by-token streaming —
    // so the assistant bubble is filled in once when the call resolves, not live.
    try {
      const cleanAttachmentPayload = attachment ? {
        type: 'image',
        name: attachment.name,
        url: attachment.data.startsWith('data:') ? attachment.data : `data:${attachment.type};base64,${attachment.data}`
      } : undefined;

      const result = await api.chat({
        userText: trimmed,
        uiSelection,
        inputMode,
        localModelName: selectedLocalModel,
        attachment: cleanAttachmentPayload
      });

      if (!result.ok) {
        setTurns((prev: ChatTurn[]) => prev.map(t => t.id === assistantTurnId ? { ...t, text: `MAT.ai Error: ${result.error}` } : t));
      } else {
        setTurns((prev: ChatTurn[]) => prev.map(t => t.id === assistantTurnId ? { ...t, text: result.text } : t));
      }
    } catch (err: any) {
      setTurns((prev: ChatTurn[]) => prev.map(t => t.id === assistantTurnId ? { ...t, text: `MAT.ai Crash: ${err.message || err}` } : t));
    } finally {
      setBusy(false);
    }
  }, [turns, busy, uiSelection, selectedLocalModel, setTurns, setBusy, setInput]);

  useEffect(() => { sendRef.current = sendWithText }, [sendWithText, sendRef]);

  return { sendWithText };
};