import { SkillLevelTypes } from '@core/models/tags/types';

export const validateTagsForm = (
  title: string,
  description: string,
  level: SkillLevelTypes,
  imageFile: File
): {
  hasError: boolean;
  errors: string[];
} => {
  let isValidated = true;
  const errors = [];

  if (!title.trim().length) {
    errors.push('Title');
  }

  if (!description.trim().length) {
    errors.push('Description');
  }

  if (!level.length) {
    errors.push('Expertise level');
  }

  if (imageFile) {
    errors.push('Image');
  }

  return {
    hasError: !isValidated,
    errors,
  };
};


export const validateUpdateTagForm = (
    title: string,
    description: string,
    level: SkillLevelTypes
  ): {
    hasError: boolean;
    errors: string[];
  } => {
    let isValidated = true;
    const errors = [];
  
    if (!title.trim().length) {
      errors.push('Title');
    }
  
    if (!description.trim().length) {
      errors.push('Description');
    }
  
    if (!level.length) {
      errors.push('Expertise level');
    }
  
    return {
      hasError: !isValidated,
      errors,
    };
  };
  