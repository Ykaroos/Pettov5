const BASE_URL = 'https://petto-api-externa.onrender.com'; 

export async function listarEventos() {
  const response = await fetch(`${BASE_URL}/list-events`);
  return response.json();
}

export async function criarEvento(data: {
  summary: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
}) {
  const response = await fetch(`${BASE_URL}/create-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
