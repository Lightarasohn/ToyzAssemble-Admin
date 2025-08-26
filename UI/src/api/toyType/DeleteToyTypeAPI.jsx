const DeleteToyTypeAPI = async (id) => {
    const URL = `${import.meta.env.VITE_BASE_API_URL}/toy-type/${id}`;
    const payload = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    try {
        const response = await fetch(URL, payload);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching toys:', error);
        throw error;
    }
}

export default DeleteToyTypeAPI;