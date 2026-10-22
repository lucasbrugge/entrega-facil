export function createApi(baseUrl) {
  const url = baseUrl.replace(/\/$/, '');

  async function request(path, options = {}) {
    let response;
    try {
      response = await fetch(`${url}${path}`, {
        ...options,
        signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });
    } catch (cause) {
      const error = new Error('Não foi possível obter resposta do JSON Server.', { cause });
      error.apiUnavailable = true;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`A API respondeu com status ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function readOptional(path) {
    try {
      return await request(path);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  return { url, request, readOptional };
}

export function isApiUnavailable(error) {
  return error.apiUnavailable === true || error.status >= 500;
}
