import { useState, useEffect } from 'react';

export const usePlantForm = (initialData, onSubmit) => {
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    price: '',
    stockQuantity: '',
    lightRequirement: 1,
    waterNeeds: 1,
    isPetFriendly: false,
    difficulty: 0,
    categoryId: 1
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        stockQuantity: initialData.stockQuantity.toString(),
        categoryId: initialData.categoryId || 1
      });
      if (initialData.imageUrl) {
        setPreviewUrl(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('scientificName', formData.scientificName);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stockQuantity', formData.stockQuantity);
    data.append('lightRequirement', formData.lightRequirement);
    data.append('waterNeeds', formData.waterNeeds);
    data.append('isPetFriendly', formData.isPetFriendly);
    data.append('difficulty', formData.difficulty);
    data.append('categoryId', formData.categoryId);
    
    if (imageFile) {
      data.append('imageFile', imageFile);
    }

    onSubmit(data);
  };

  return {
    formData,
    previewUrl,
    handleChange,
    handleFileChange,
    handleSubmit
  };
};
