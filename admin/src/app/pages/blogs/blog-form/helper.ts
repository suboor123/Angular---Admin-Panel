export const validateBlogForm = (
    title: string,
    description: string,
    image: File,
    htmlContent: string
  ) => {
    const errors = [];
  
    if (title === '' || !title) {
      errors.push('Name');
    }
  
    if (description === '' || !description) {
      errors.push('Description');
    }
  
    if (!image) {
      errors.push('Image');
    }
  
    if (htmlContent === '') {
      errors.push('Content');
    }
  
    return {
      hasErrors: errors.length !== 0,
      errors,
    };
  };