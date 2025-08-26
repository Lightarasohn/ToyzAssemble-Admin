const AddToyTypeAPI = async (body) => {
    const URL = `${import.meta.env.VITE_BASE_API_URL}/toy-type`;
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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

export default AddToyTypeAPI;