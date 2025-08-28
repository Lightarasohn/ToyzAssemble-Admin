const DeleteAllPackageRaritiesByPackageIdAPI = async (packageId) => {
    const URL = `${import.meta.env.VITE_BASE_API_URL}/package-rarity-type/package/${packageId}`;
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

export default DeleteAllPackageRaritiesByPackageIdAPI;