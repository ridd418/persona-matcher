// Pulls data from external JSON

// Object Deep Freezer (makes them immutable)
const deepFreeze = (obj) => {
  Object.freeze(obj)
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  })
  return obj
}

// Fetch, Deep Freeze and Return Data
const getData = async (url) => {
    try {
        console.log('Loading quiz data...')
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        console.log('Quiz data loaded.')
        return deepFreeze(data)
    } catch (err) {
        console.error('Failed to load quiz data:', err)
        return undefined
    }
}

export default getData