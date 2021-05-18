const questionValidator = (question) => {
  if (question.question === undefined) {
    return [false, 'Missing mandatory field: a question must contain a \'question\' field.'];
  }

  if (typeof question.question !== 'string') {
    return [false, 'Incorrect mandatory field type: a question\'s question field must be a string.'];
  }

  if (question.question.length === 0) {
    return [false, 'Invalid mandatory field value: a question\'s question field must be non-empty.'];
  }

  if (question.answers === undefined) {
    return [false, 'Missing mandatory field: a question must contain an \'answers\' field.'];
  }

  if (!Array.isArray(question.answers)) {
    return [false, 'Incorrect mandatory field type: a question\'s answers field must be an array.'];
  }

  if (question.answers.find(answer => typeof answer !== 'object') !== undefined) {
    return [false, 'Incorrect mandatory field value: The array of answers must only contain objects.'];
  }

  if (question.answers.length > 6 || question.answers.length < 2) {
    return [false, 'Invalid mandatory field value: There must be between at least 2, or at most 6 answers objects for the answer array of a question.'];
  }

  let containsCorrectAnswer = false;
  for (const answer of question.answers) {
    if (answer.value === undefined) {
      return [false, 'Missing mandatory field: an answer must contain a \'value\' field.'];
    }

    if (typeof answer.value !== 'string') {
      return [false, 'Incorrect mandatory field type: an answer\'s value must be a string.'];
    }

    if (answer.value.length === 0) {
      return [false, 'Invalid mandatory field value: an answer\'s value must be non-empty.'];
    }

    if (answer.isCorrect === undefined) {
      return [false, 'Missing mandatory field: an answer must contain a \'isCorrect\' field.'];
    }

    if (typeof answer.isCorrect !== 'boolean') {
      return [false, 'Incorrect mandatory field type: an answer\'s isCorrect field must be a boolean.'];
    }

    if (answer.isCorrect) {
      containsCorrectAnswer = true;
    }
  }

  if (!containsCorrectAnswer) {
    return [false, 'Incorrect mandatory field value: there must be at least one correct answer for a question.'];
  }

  if (question.mediaLink !== undefined) {
    if (typeof question.mediaLink !== 'string') {
      return [false, 'Incorrect optional field type: if providing a media link, it must be a string.'];
    }

    if (question.mediaLink.length === 0) {
      return [false, 'Incorrect optional field value: if providing a media link, it must be non-empty.'];
    }
  }

  if (question.points === undefined) {
    return [false, 'Missing mandatory field: a question requires a \'points\' field.'];
  }

  if (typeof question.timeLimit !== 'number') {
    return [false, 'Incorrect mandatory field type: a question\'s \'points\' field should be of type \'number\'.'];
  }

  if (question.points < 1) {
    return [false, 'Invalid mandatory field value: a question\'s points field should be non-negative.'];
  }

  if (question.timeLimit === undefined) {
    return [false, 'Missing mandatory field: a question requires a \'timeLimit\' field.'];
  }

  if (typeof question.timeLimit !== 'number') {
    return [false, 'Incorrect mandatory field type: a question\'s timeLimit field should be of type \'number\'.'];
  }

  if (question.timeLimit < 5) {
    return [false, 'Invalid mandatory field value: a question\'s timeLimit field must be at least 5 seconds.'];
  }

  return [true, 'The question is valid.'];
}

export default questionValidator;
