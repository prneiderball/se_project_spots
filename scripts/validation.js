document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing form validation...");

  // ------------------------ Configuration Object ------------------------ //
  const settings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn--disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__error_visible",
  };

  // ------------------------ Error Handling Functions ----------------------//
  const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorElement =
      inputElement.parentElement.querySelector(".modal__error");
    if (!errorElement) return;
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  };

  const hideInputError = (formElement, inputElement, config) => {
    const errorElement =
      inputElement.parentElement.querySelector(".modal__error");
    if (!errorElement) return;
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = "";
    errorElement.classList.remove(config.errorClass);
  };

  const checkInputValidity = (formElement, inputElement, config) => {
    if (!inputElement.validity.valid) {
      showInputError(
        formElement,
        inputElement,
        inputElement.validationMessage,
        config
      );
    } else {
      hideInputError(formElement, inputElement, config);
    }
  };

  // ------------------------ Form Validation Functions ------------------------ //

  const hasInvalidInput = (inputList) =>
    inputList.some((input) => !input.validity.valid);

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
    const inputList = Array.from(
      formElement.querySelectorAll(config.inputSelector)
    );
    const submitButton = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, submitButton, config);
      });
    });
  };

  const enableValidation = (config) => {
    const forms = document.querySelectorAll(config.formSelector);
    forms.forEach((formElement) => {
      setEventListeners(formElement, config);
    });
  };

  enableValidation(settings);

  window.validationSettings = settings;
  window.hideInputError = hideInputError;
  window.toggleButtonState = toggleButtonState;
});
