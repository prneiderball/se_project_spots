export const Settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn--disabled",
  inputErrorClass: "modal__input--error",
  errorClass: "modal__error--active",
};

const showInputError = (inputElement, errorMessage, config) => {
  const errorElement = document.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (inputElement, config) => {
  const errorElement = document.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(inputElement, config);
  }
};

export const resetValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(inputElement, config);
  });

  toggleButtonState(inputList, submitButton, config);
};

const hasInvalidInput = (inputList) => inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.setAttribute("disabled", true);
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.removeAttribute("disabled");
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, submitButton, config);
    });
  });

  toggleButtonState(inputList, submitButton, config);
};

export const enableValidation = (config) => {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

const validateForm = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  let isValid = true;

  inputList.forEach((inputElement) => {
    checkInputValidity(formElement, inputElement, config);
    if (!inputElement.validity.valid) {
      isValid = false;
    }
  });

  const submitButton = formElement.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, submitButton, config);
  
  return isValid;
};
