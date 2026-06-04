const MAX_COMMENT_MESSAGE_LENGTH = 2000;

/**
 * @param {unknown} body
 * @returns {{ ok: true, data: { message: string } } | { ok: false, error: string }}
 */
export function validateCommentMessage(body) {

  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object' };
  }

  const { message } = body;

  if (typeof message !== 'string') {
    return { ok: false, error: 'message is required' };
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return { ok: false, error: 'message cannot be empty' };
  }

  if (trimmedMessage.length > MAX_COMMENT_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `message must be ${MAX_COMMENT_MESSAGE_LENGTH} characters or fewer`,
    };
  }

  return {
    ok: true,
    data: trimmedMessage
  };
}
