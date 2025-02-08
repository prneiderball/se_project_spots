const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    hideInputError(form, input, config);
  });
}
