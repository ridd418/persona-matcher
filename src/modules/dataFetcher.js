// Pulls data from external JSON
const getData = async (url) => {
    try {
        console.log('Loading quiz data...')
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        console.log('Quiz data loaded.')
        return data
    } catch (err) {
        console.error('Failed to load quiz data:', err)
        return undefined
    }
}

export default getData