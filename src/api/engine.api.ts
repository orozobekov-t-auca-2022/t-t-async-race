import { API_BASE_URL } from '../constants';

export async function startOrStopEngine(
  id: number,
  status: 'started' | 'stopped',
): Promise<{ velocity: number; distance: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Error ${status} engine for car with id ${id}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function switchToDriveMode(id: number): Promise<{ success: true } | 'engine failure'> {
  try {
    const response = await fetch(`${API_BASE_URL}/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });

    if (response.status === 500) {
      return 'engine failure';
    }

    if (!response.ok) {
      throw new Error(`Error switching to drive mode for car with id ${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
