import { API_BASE_URL } from '../constants';
import type { Winner } from '../models/winner.model';

export async function getAllWinners(
  page: number,
  limit: number,
  sort: 'id' | 'wins' | 'time',
  order: 'ASC' | 'DESC',
): Promise<{ winners: Winner[]; total: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
    if (!response.ok) {
      throw new Error(`Error fetching winners: ${response.statusText}`);
    }
    const data: Winner[] = await response.json();
    const totalCount = Number(response.headers.get('x-total-count')) || 0;
    return { winners: data, total: totalCount };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getWinnerById(id: number): Promise<Winner> {
  try {
    const response = await fetch(`${API_BASE_URL}/winners/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching winner with id ${id}: ${response.statusText}`);
    }
    const data: Winner = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createWinner(id: number, time: number): Promise<Winner> {
  try {
    const response = await fetch(`${API_BASE_URL}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, wins: 1, time }),
    });
    if (!response.ok) {
      throw new Error(`Error creating winner: ${response.statusText}`);
    }
    const data: Winner = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteWinner(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/winners/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting winner with id ${id}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  try {
    const response = await fetch(`${API_BASE_URL}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wins, time }),
    });
    if (!response.ok) {
      throw new Error(`Error updating winner with id ${id}: ${response.statusText}`);
    }
    const data: Winner = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
