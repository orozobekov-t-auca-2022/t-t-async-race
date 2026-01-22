import { API_BASE_URL } from '../constants';
import type { Car } from '../models/car.model';

export async function getAllCars(page: number = 1, limit: number = 7): Promise<{ cars: Car[]; total: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/garage?_page=${page}&_limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error fetching cars: ${response.statusText}`);
    }
    const data: Car[] = await response.json();
    const totalCount = Number(response.headers.get('x-total-count')) || 0;
    return { cars: data, total: totalCount };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCarById(id: number): Promise<Car> {
  try {
    const response = await fetch(`${API_BASE_URL}/garage/${id}`);
    if (!response.ok) {
      throw new Error(`Error fetching car with id ${id}: ${response.statusText}`);
    }
    const data: Car = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createCar(name: string, color: string): Promise<Car> {
  try {
    const response = await fetch(`${API_BASE_URL}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
      throw new Error(`Error creating car: ${response.statusText}`);
    }
    const data: Car = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCar(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/garage/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error deleting car with id ${id}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCar(id: number, name: string, color: string): Promise<Car> {
  try {
    const response = await fetch(`${API_BASE_URL}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
      throw new Error(`Error updating car with id ${id}: ${response.statusText}`);
    }
    const data: Car = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
