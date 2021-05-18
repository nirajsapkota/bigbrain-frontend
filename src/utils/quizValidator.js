import questionValidator from './questionValidator';

const quizValidator = (quiz) => {
  if (quiz.name === undefined) {
    return [false, 'Missing mandatory field: a quiz must contain a \'name\' field.'];
  }

  if (typeof quiz.name !== 'string') {
    return [false, 'Incorrect mandatory field type: a quizzes name field must be a string.'];
  }

  if (quiz.name.length === 0) {
    return [false, 'Invalid mandatory field value: a quizzes name field must be non-empty.'];
  }

  if (quiz.thumbnail !== undefined) {
    if (typeof quiz.thumbnail !== 'string') {
      return [false, 'Incorrect optional field type: if a thumbnail is provided, it must be a string.'];
    }

    if (quiz.thumbnail.length === 0) {
      return [false, 'Invalid optional field value: if a thumbnail is provided, it must be non-empty.'];
    }
  }

  if (quiz.questions !== undefined) {
    if (!Array.isArray(quiz.questions)) {
      return [false, 'Incorrect optional field type: if questions are provided, it must be an array.'];
    }

    if (quiz.questions.find(question => typeof question !== 'object') !== undefined) {
      return [false, 'Incorrect optional field value: if an array of questions are provided, it must only contain objects.'];
    }

    for (const question of quiz.questions) {
      const [success, message] = questionValidator(question);
      if (!success) return [success, message];
    }
  }

  return [true, 'Quiz validated successfully'];
}

export default quizValidator;
