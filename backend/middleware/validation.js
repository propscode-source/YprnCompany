// Input validation middleware untuk backend API
// Mencegah input tidak valid atau berbahaya

const validateRequired = (fields) => (req, res, next) => {
  const missing = []
  for (const field of fields) {
    if (!req.body[field] || req.body[field].toString().trim() === '') {
      missing.push(field)
    }
  }
  
  if (missing.length > 0) {
    return res.status(400).json({
      message: `Field berikut harus diisi: ${missing.join(', ')}`
    })
  }
  
  next()
}

const validateLength = (field, min, max) => (req, res, next) => {
  const value = req.body[field]
  if (value && (value.length < min || value.length > max)) {
    return res.status(400).json({
      message: `${field} harus antara ${min}-${max} karakter`
    })
  }
  next()
}

const validateNumber = (field, min = null, max = null) => (req, res, next) => {
  const value = req.body[field]
  
  if (value !== undefined && value !== null && value !== '') {
    const num = Number(value)
    if (isNaN(num)) {
      return res.status(400).json({
        message: `${field} harus berupa angka`
      })
    }
    
    if (min !== null && num < min) {
      return res.status(400).json({
        message: `${field} tidak boleh kurang dari ${min}`
      })
    }
    
    if (max !== null && num > max) {
      return res.status(400).json({
        message: `${field} tidak boleh lebih dari ${max}`
      })
    }
  }
  
  next()
}

const sanitizeInput = (req, res, next) => {
  // Trim semua string input
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim()
    }
  }
  next()
}

export { validateRequired, validateLength, validateNumber, sanitizeInput }
